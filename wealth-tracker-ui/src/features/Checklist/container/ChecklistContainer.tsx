import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  deleteRequest,
  getRequest,
  postRequest,
  putRequest,
} from '../../../serviceconfigs/AxiosAPI';
import { API_ENDPOINTS } from '../../../serviceconfigs/ApiEndpoints';
import ChecklistPresenter from '../presenter/ChecklistPresenter';
import type {
  ChecklistCreatePayload,
  ChecklistItem,
  ChecklistStatus,
  ChecklistUpdatePayload,
} from '../types/ChecklistTypes';
import type { ChecklistCategory } from '../../ChecklistCategory/types/ChecklistCategoryTypes';
import { useAuth } from '../../login/context/useAuth';
import { decodeJwtPayload } from '../../../utils/jwt';

interface JwtPayload {
  userId?: number;
}

const buildDefaultFormState = (username: string, userId: number | null) => ({
  title: '',
  description: '',
  checklistCategoryId: '1',
  userId: userId !== null ? String(userId) : '',
  status: 'PENDING' as ChecklistStatus,
  referenceLink: '',
  completedAt: '',
  createdBy: username || 'web',
  modifiedBy: username || '',
});

const ChecklistContainer = () => {
  const navigate = useNavigate();
  const { accessToken, tokenType, logout, username } = useAuth();
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [categories, setCategories] = useState<ChecklistCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formState, setFormState] = useState(() =>
    buildDefaultFormState(username, null)
  );

  const authHeader = useMemo(() => {
    if (!accessToken) {
      return {};
    }
    const prefix = tokenType ? tokenType : 'Bearer';
    return { Authorization: `${prefix} ${accessToken}` };
  }, [accessToken, tokenType]);

  const userId = useMemo(() => {
    if (!accessToken) {
      return null;
    }
    const payload = decodeJwtPayload<JwtPayload>(accessToken);
    return typeof payload?.userId === 'number' ? payload.userId : null;
  }, [accessToken]);

  const fetchItems = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await getRequest<ChecklistItem[]>(
        API_ENDPOINTS.checklist.items,
        { headers: authHeader }
      );
      setItems(response);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to load checklist items.';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getRequest<ChecklistCategory[]>(
        API_ENDPOINTS.checklist.categories,
        { headers: authHeader }
      );
      setCategories(response);
      if (response.length > 0 && editingId === null) {
        const exists = response.some(
          (category) => String(category.id) === formState.checklistCategoryId
        );
        if (!exists) {
          setFormState((prev) => ({
            ...prev,
            checklistCategoryId: String(response[0].id),
          }));
        }
      }
    } catch {
      // Ignore category fetch failures; checklist items can still load
    }
  };

  useEffect(() => {
    if (!accessToken) {
      navigate('/login');
      return;
    }
    fetchItems();
    fetchCategories();
  }, [accessToken, navigate]);

  useEffect(() => {
    setFormState((prev) => ({
      ...prev,
      createdBy: username || 'web',
      modifiedBy: username || '',
    }));
  }, [username]);

  useEffect(() => {
    if (userId === null) {
      return;
    }
    setFormState((prev) => ({
      ...prev,
      userId: String(userId),
    }));
  }, [userId]);

  const handleChange = (field: keyof typeof formState, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormState(buildDefaultFormState(username, userId));
    setEditingId(null);
  };

  const toCompletedAt = (value: string) => (value.trim() ? value : null);

  const normalizeCompletedAt = (value?: string | null) => {
    if (!value) {
      return '';
    }
    return value.length >= 16 ? value.slice(0, 16) : value;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (userId === null) {
        setErrorMessage('Unable to read userId from access token.');
        return;
      }
      if (editingId !== null) {
        const payload: ChecklistUpdatePayload = {
          title: formState.title.trim(),
          description: formState.description.trim(),
          checklistCategoryId: Number(formState.checklistCategoryId),
          userId,
          status: formState.status,
          referenceLink: formState.referenceLink.trim(),
          completedAt: toCompletedAt(formState.completedAt),
          modifiedBy: username || 'web',
        };
        await putRequest<ChecklistItem, ChecklistUpdatePayload>(
          API_ENDPOINTS.checklist.itemById(editingId),
          payload,
          { headers: authHeader }
        );
      } else {
        const payload: ChecklistCreatePayload = {
          title: formState.title.trim(),
          description: formState.description.trim(),
          checklistCategoryId: Number(formState.checklistCategoryId),
          userId,
          status: formState.status,
          referenceLink: formState.referenceLink.trim(),
          completedAt: toCompletedAt(formState.completedAt),
          createdBy: username || 'web',
        };
        await postRequest<ChecklistItem, ChecklistCreatePayload>(
          API_ENDPOINTS.checklist.items,
          payload,
          { headers: authHeader }
        );
      }
      resetForm();
      await fetchItems();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to save checklist item.';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (item: ChecklistItem) => {
    setEditingId(item.id);
    setFormState({
      title: item.title,
      description: item.description,
      checklistCategoryId: String(item.checklistCategoryId),
      userId: userId !== null ? String(userId) : String(item.userId),
      status: item.status,
      referenceLink: item.referenceLink,
      completedAt: normalizeCompletedAt(item.completedAt),
      createdBy: username || item.createdBy,
      modifiedBy: username || (item.modifiedBy ?? ''),
    });

    try {
      const latest = await getRequest<ChecklistItem>(
        API_ENDPOINTS.checklist.itemById(item.id),
        { headers: authHeader }
      );
      setFormState((prev) => ({
        ...prev,
        description: latest.description,
        status: latest.status,
        referenceLink: latest.referenceLink,
        completedAt: normalizeCompletedAt(latest.completedAt),
        modifiedBy: latest.modifiedBy ?? prev.modifiedBy,
      }));
    } catch {
      // Ignore refresh failures; keep local values
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm('Delete this checklist item?');
    if (!confirmed) {
      return;
    }
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await deleteRequest<void>(API_ENDPOINTS.checklist.itemById(id), {
        headers: authHeader,
      });
      await fetchItems();
      if (editingId === id) {
        resetForm();
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to delete checklist item.';
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

  const handleRefresh = () => {
    fetchItems();
    fetchCategories();
  };

  return (
    <ChecklistPresenter
      items={items}
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
      onRefresh={handleRefresh}
      onLogout={handleLogout}
    />
  );
};

export default ChecklistContainer;
