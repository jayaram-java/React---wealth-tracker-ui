import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  deleteRequest,
  getRequest,
  postRequest,
  putRequest,
} from '../../../serviceconfigs/AxiosAPI';
import { API_ENDPOINTS } from '../../../serviceconfigs/ApiEndpoints';
import ChecklistCategoryPresenter from '../presenter/ChecklistCategoryPresenter';
import type {
  ChecklistCategory,
  ChecklistCategoryCreatePayload,
  ChecklistCategoryUpdatePayload,
} from '../types/ChecklistCategoryTypes';
import { useAuth } from '../../login/context/useAuth';
import { decodeJwtPayload } from '../../../utils/jwt';

interface JwtPayload {
  userId?: number;
}

const buildDefaultFormState = (username: string, userId: number | null) => ({
  name: '',
  description: '',
  userId: userId !== null ? String(userId) : '',
  isActive: true,
  isPrimary: false,
  createdBy: username || 'web',
  modifiedBy: username || '',
});

const ChecklistCategoryContainer = () => {
  const navigate = useNavigate();
  const { accessToken, tokenType, logout, username } = useAuth();
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

  const fetchCategories = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await getRequest<ChecklistCategory[]>(
        API_ENDPOINTS.checklist.categories,
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

  useEffect(() => {
    if (userId === null) {
      return;
    }
    setFormState((prev) => ({
      ...prev,
      userId: String(userId),
    }));
  }, [userId]);

  const handleChange = (
    field: keyof typeof formState,
    value: string
  ) => {
    if (field === 'isActive' || field === 'isPrimary') {
      setFormState((prev) => ({ ...prev, [field]: value === 'true' }));
      return;
    }
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormState(buildDefaultFormState(username, userId));
    setEditingId(null);
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
        const payload: ChecklistCategoryUpdatePayload = {
          name: formState.name.trim(),
          description: formState.description.trim(),
          isActive: formState.isActive,
          isPrimary: formState.isPrimary,
          userId,
          modifiedBy: username || 'web',
        };
        await putRequest<ChecklistCategory, ChecklistCategoryUpdatePayload>(
          API_ENDPOINTS.checklist.categoryById(editingId),
          payload,
          { headers: authHeader }
        );
      } else {
        const payload: ChecklistCategoryCreatePayload = {
          name: formState.name.trim(),
          description: formState.description.trim(),
          isActive: formState.isActive,
          isPrimary: formState.isPrimary,
          userId,
          createdBy: username || 'web',
        };
        await postRequest<ChecklistCategory, ChecklistCategoryCreatePayload>(
          API_ENDPOINTS.checklist.categories,
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

  const handleEdit = async (category: ChecklistCategory) => {
    setEditingId(category.id);
    setFormState({
      name: category.name,
      description: category.description,
      userId: userId !== null ? String(userId) : String(category.userId),
      isActive: category.isActive,
      isPrimary: category.isPrimary,
      createdBy: username || category.createdBy,
      modifiedBy: username || (category.modifiedBy ?? ''),
    });

    try {
      const latest = await getRequest<ChecklistCategory>(
        API_ENDPOINTS.checklist.categoryById(category.id),
        { headers: authHeader }
      );
      setFormState((prev) => ({
        ...prev,
        name: latest.name,
        description: latest.description,
        isActive: latest.isActive,
        isPrimary: latest.isPrimary,
        modifiedBy: latest.modifiedBy ?? prev.modifiedBy,
      }));
    } catch {
      // Ignore if refresh fails; keep local values
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm('Delete this checklist category?');
    if (!confirmed) {
      return;
    }
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await deleteRequest<void>(API_ENDPOINTS.checklist.categoryById(id), {
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
    <ChecklistCategoryPresenter
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

export default ChecklistCategoryContainer;
