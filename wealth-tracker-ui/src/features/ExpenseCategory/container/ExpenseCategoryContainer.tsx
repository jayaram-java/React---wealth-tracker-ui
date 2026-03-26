import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteRequest, getRequest, postRequest, putRequest } from '../../../serviceconfigs/AxiosAPI';
import { API_ENDPOINTS } from '../../../serviceconfigs/ApiEndpoints';
import ExpenseCategoryPresenter from '../presenter/ExpenseCategoryPresenter';
import type {
  ExpenseCategory,
  ExpenseCategoryCreatePayload,
  ExpenseCategoryStatus,
  ExpenseCategoryUpdatePayload,
} from '../types/ExpenseCategoryTypes';
import { useAuth } from '../../login/context/AuthProvider';
import { decodeJwtPayload } from '../../../utils/jwt';

interface JwtPayload {
  userId?: number;
}

const buildDefaultFormState = (username: string, userId: number | null) => ({
  name: '',
  description: '',
  userId: userId !== null ? String(userId) : '',
  permissionId: '2001',
  status: 'ACTIVE' as ExpenseCategoryStatus,
  createdBy: username || 'web',
  modifiedBy: username || '',
});

const ExpenseCategoryContainer = () => {
  const navigate = useNavigate();
  const { accessToken, tokenType, logout, username } = useAuth();
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
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
      const response = await getRequest<ExpenseCategory[]>(
        API_ENDPOINTS.expense.categories,
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

  const handleChange = (field: string, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormState(buildDefaultFormState(username, userId));
    setEditingId(null);
  };

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
        const payload: ExpenseCategoryUpdatePayload = {
          name: formState.name.trim(),
          description: formState.description.trim(),
          status: formState.status,
          modifiedBy: username || 'web',
        };
        await putRequest<ExpenseCategory, ExpenseCategoryUpdatePayload>(
          API_ENDPOINTS.expense.categoryById(editingId),
          payload,
          { headers: authHeader }
        );
      } else {
        const payload: ExpenseCategoryCreatePayload = {
          name: formState.name.trim(),
          description: formState.description.trim(),
          userId,
          permissionId: Number(formState.permissionId),
          status: formState.status,
          createdBy: username || 'web',
        };
        await postRequest<ExpenseCategory, ExpenseCategoryCreatePayload>(
          API_ENDPOINTS.expense.categories,
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

  const handleEdit = async (category: ExpenseCategory) => {
    setEditingId(category.id);
    setFormState({
      name: category.name,
      description: category.description,
      userId: userId !== null ? String(userId) : String(category.userId),
      permissionId: String(category.permissionId),
      status: category.status,
      createdBy: username || category.createdBy,
      modifiedBy: username || (category.modifiedBy ?? ''),
    });

    try {
      const latest = await getRequest<ExpenseCategory>(
        API_ENDPOINTS.expense.categoryById(category.id),
        { headers: authHeader }
      );
      setFormState((prev) => ({
        ...prev,
        name: latest.name,
        description: latest.description,
        status: latest.status,
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
      await deleteRequest<void>(API_ENDPOINTS.expense.categoryById(id), {
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
    <ExpenseCategoryPresenter
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

export default ExpenseCategoryContainer;
