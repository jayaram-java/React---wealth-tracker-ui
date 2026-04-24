import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  deleteRequest,
  getRequest,
  postRequest,
  putRequest,
} from '../../../serviceconfigs/AxiosAPI';
import { API_ENDPOINTS } from '../../../serviceconfigs/ApiEndpoints';
import WebsiteCategoryPresenter from '../presenter/WebsiteCategoryPresenter';
import type {
  WebsiteCategory,
  WebsiteCategoryCreatePayload,
  WebsiteCategoryUpdatePayload,
} from '../types/WebsiteCategoryTypes';
import { useAuth } from '../../login/context/useAuth';

const buildDefaultFormState = (username: string) => ({
  categoryName: '',
  description: '',
  isActive: true,
  createdBy: username || 'web',
  modifiedBy: username || '',
});

const WebsiteCategoryContainer = () => {
  const navigate = useNavigate();
  const { accessToken, tokenType, logout, username } = useAuth();
  const [categories, setCategories] = useState<WebsiteCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
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

  const fetchCategories = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await getRequest<WebsiteCategory[]>(
        API_ENDPOINTS.website.categories,
        { headers: authHeader }
      );
      setCategories(response);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to load categories.';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!accessToken) {
      navigate('/login');
      return;
    }
    fetchCategories();
  }, [accessToken, navigate]);

  useEffect(() => {
    setFormState((prev) => ({
      ...prev,
      createdBy: username || 'web',
      modifiedBy: username || '',
    }));
  }, [username]);

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
        const payload: WebsiteCategoryUpdatePayload = {
          categoryName: formState.categoryName.trim(),
          description: formState.description.trim(),
          isActive: formState.isActive,
          modifiedBy: username || 'web',
        };
        await putRequest<WebsiteCategory, WebsiteCategoryUpdatePayload>(
          API_ENDPOINTS.website.categoryById(editingId),
          payload,
          { headers: authHeader }
        );
      } else {
        const payload: WebsiteCategoryCreatePayload = {
          categoryName: formState.categoryName.trim(),
          description: formState.description.trim(),
          isActive: formState.isActive,
          createdBy: username || 'web',
        };
        await postRequest<WebsiteCategory, WebsiteCategoryCreatePayload>(
          API_ENDPOINTS.website.categories,
          payload,
          { headers: authHeader }
        );
      }
      resetForm();
      await fetchCategories();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to save category.';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (category: WebsiteCategory) => {
    setEditingId(category.id);
    setFormState({
      categoryName: category.categoryName,
      description: category.description,
      isActive: category.isActive,
      createdBy: username || category.createdBy,
      modifiedBy: username || (category.modifiedBy ?? ''),
    });

    try {
      const latest = await getRequest<WebsiteCategory>(
        API_ENDPOINTS.website.categoryById(category.id),
        { headers: authHeader }
      );
      setFormState((prev) => ({
        ...prev,
        categoryName: latest.categoryName,
        description: latest.description,
        isActive: latest.isActive,
        modifiedBy: latest.modifiedBy ?? prev.modifiedBy,
      }));
    } catch {
      // Ignore if refresh fails; keep local values
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm('Delete this category?');
    if (!confirmed) {
      return;
    }
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await deleteRequest<void>(API_ENDPOINTS.website.categoryById(id), {
        headers: authHeader,
      });
      await fetchCategories();
      if (editingId === id) {
        resetForm();
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to delete category.';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <WebsiteCategoryPresenter
      categories={categories}
      isLoading={isLoading}
      errorMessage={errorMessage}
      formState={formState}
      isEditing={editingId !== null}
      onChange={handleChange}
      onSubmit={handleSubmit}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onCancelEdit={handleCancelEdit}
      onRefresh={fetchCategories}
      onLogout={handleLogout}
    />
  );
};

export default WebsiteCategoryContainer;
