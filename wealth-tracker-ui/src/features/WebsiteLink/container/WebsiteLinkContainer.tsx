import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  deleteRequest,
  getRequest,
  postRequest,
  putRequest,
} from '../../../serviceconfigs/AxiosAPI';
import { API_ENDPOINTS } from '../../../serviceconfigs/ApiEndpoints';
import { useAuth } from '../../login/context/useAuth';
import WebsiteLinkPresenter from '../presenter/WebsiteLinkPresenter';
import type {
  WebsiteLink,
  WebsiteLinkCreatePayload,
  WebsiteLinkUpdatePayload,
} from '../types/WebsiteLinkTypes';
import type { WebsiteCategory } from '../../WebsiteCategory/types/WebsiteCategoryTypes';

const buildDefaultFormState = (username: string) => ({
  websiteLink: '',
  description: '',
  remarks: '',
  isActive: true,
  categoryId: '1',
  createdBy: username || 'web',
  modifiedBy: username || '',
});

const WebsiteLinkContainer = () => {
  const navigate = useNavigate();
  const { accessToken, tokenType, logout, username } = useAuth();
  const [links, setLinks] = useState<WebsiteLink[]>([]);
  const [categories, setCategories] = useState<WebsiteCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [filterCategoryId, setFilterCategoryId] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [formState, setFormState] = useState(() =>
    buildDefaultFormState(username)
  );

  const authHeader = useMemo(() => {
    if (!accessToken) {
      return {};
    }
    const prefix = tokenType ? tokenType : 'Bearer';
    return { Authorization: `${prefix} ${accessToken}` };
  }, [accessToken, tokenType]);

  const fetchLinks = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await getRequest<WebsiteLink[]>(
        API_ENDPOINTS.website.links,
        { headers: authHeader }
      );
      setLinks(response);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to load website links.';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getRequest<WebsiteCategory[]>(
        API_ENDPOINTS.website.categories,
        { headers: authHeader }
      );
      setCategories(response);
      if (response.length > 0 && editingId === null) {
        const exists = response.some(
          (category) => String(category.id) === formState.categoryId
        );
        if (!exists) {
          setFormState((prev) => ({
            ...prev,
            categoryId: String(response[0].id),
          }));
        }
      }
    } catch {
      // Ignore category fetch failures; links can still load
    }
  };

  useEffect(() => {
    if (!accessToken) {
      navigate('/login');
      return;
    }
    fetchLinks();
    fetchCategories();
  }, [accessToken, navigate]);

  useEffect(() => {
    setFormState((prev) => ({
      ...prev,
      createdBy: username || 'web',
      modifiedBy: username || '',
    }));
  }, [username]);

  const filteredLinks = useMemo(() => {
    if (filterCategoryId === 'all') {
      return links;
    }
    const categoryId = Number(filterCategoryId);
    if (Number.isNaN(categoryId)) {
      return links;
    }
    return links.filter((link) => link.categoryId === categoryId);
  }, [filterCategoryId, links]);

  const totalPages = Math.max(1, Math.ceil(filteredLinks.length / pageSize));
  const pagedLinks = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredLinks.slice(startIndex, startIndex + pageSize);
  }, [currentPage, filteredLinks, pageSize]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleChange = (
    field: keyof typeof formState,
    value: string
  ) => {
    if (field === 'isActive') {
      setFormState((prev) => ({ ...prev, isActive: value === 'true' }));
      return;
    }
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormState(buildDefaultFormState(username));
    setEditingId(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (editingId !== null) {
        const payload: WebsiteLinkUpdatePayload = {
          websiteLink: formState.websiteLink.trim(),
          description: formState.description.trim(),
          remarks: formState.remarks.trim(),
          isActive: formState.isActive,
          categoryId: Number(formState.categoryId),
          modifiedBy: username || 'web',
        };
        await putRequest<WebsiteLink, WebsiteLinkUpdatePayload>(
          API_ENDPOINTS.website.linkById(editingId),
          payload,
          { headers: authHeader }
        );
      } else {
        const payload: WebsiteLinkCreatePayload = {
          websiteLink: formState.websiteLink.trim(),
          description: formState.description.trim(),
          remarks: formState.remarks.trim(),
          isActive: formState.isActive,
          categoryId: Number(formState.categoryId),
          createdBy: username || 'web',
        };
        await postRequest<WebsiteLink, WebsiteLinkCreatePayload>(
          API_ENDPOINTS.website.links,
          payload,
          { headers: authHeader }
        );
      }
      resetForm();
      await fetchLinks();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to save website link.';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (link: WebsiteLink) => {
    setEditingId(link.id);
    setFormState({
      websiteLink: link.websiteLink,
      description: link.description,
      remarks: link.remarks,
      isActive: link.isActive,
      categoryId: String(link.categoryId),
      createdBy: username || link.createdBy,
      modifiedBy: username || (link.modifiedBy ?? ''),
    });

    try {
      const latest = await getRequest<WebsiteLink>(
        API_ENDPOINTS.website.linkById(link.id),
        { headers: authHeader }
      );
      setFormState((prev) => ({
        ...prev,
        websiteLink: latest.websiteLink,
        description: latest.description,
        remarks: latest.remarks,
        isActive: latest.isActive,
        categoryId: String(latest.categoryId),
        modifiedBy: latest.modifiedBy ?? prev.modifiedBy,
      }));
    } catch {
      // Ignore refresh failures; keep local values
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm('Delete this website link?');
    if (!confirmed) {
      return;
    }
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await deleteRequest<void>(API_ENDPOINTS.website.linkById(id), {
        headers: authHeader,
      });
      await fetchLinks();
      if (editingId === id) {
        resetForm();
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to delete website link.';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  const handleFilterChange = (value: string) => {
    setFilterCategoryId(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    const nextPage = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(nextPage);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleRefresh = () => {
    fetchLinks();
    fetchCategories();
  };

  return (
    <WebsiteLinkPresenter
      links={pagedLinks}
      categories={categories}
      isLoading={isLoading}
      errorMessage={errorMessage}
      formState={formState}
      isEditing={editingId !== null}
      filterCategoryId={filterCategoryId}
      currentPage={currentPage}
      totalPages={totalPages}
      onChange={handleChange}
      onSubmit={handleSubmit}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onCancelEdit={handleCancelEdit}
      onFilterChange={handleFilterChange}
      onPageChange={handlePageChange}
      onRefresh={handleRefresh}
      onLogout={handleLogout}
    />
  );
};

export default WebsiteLinkContainer;
