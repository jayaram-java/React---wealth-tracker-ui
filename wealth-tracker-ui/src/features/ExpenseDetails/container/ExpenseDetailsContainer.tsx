import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  deleteRequest,
  getRequest,
  postRequest,
  putRequest,
} from '../../../serviceconfigs/AxiosAPI';
import { API_ENDPOINTS } from '../../../serviceconfigs/ApiEndpoints';
import { useAuth } from '../../login/context/AuthProvider';
import ExpenseDetailsPresenter from '../presenter/ExpenseDetailsPresenter';
import type { ExpenseCategory } from '../../ExpenseCategory/types/ExpenseCategoryTypes';
import type {
  ExpenseDetails,
  ExpenseDetailsCreatePayload,
  ExpenseDetailsUpdatePayload,
  ExpenseStatus,
} from '../types/ExpenseDetailsTypes';

const buildDefaultFormState = (username: string) => ({
  expenseName: '',
  expenseDate: new Date().toISOString().slice(0, 10),
  amount: '',
  description: '',
  paymentMethod: 'UPI',
  expenseCode: '',
  referenceNumber: '',
  receiptUrl: '',
  currency: 'INR',
  userId: '101',
  status: 'ACTIVE' as ExpenseStatus,
  categoryId: '1',
  createdBy: username || 'web',
  modifiedBy: username || '',
});

const ExpenseDetailsContainer = () => {
  const navigate = useNavigate();
  const { accessToken, tokenType, logout, username } = useAuth();
  const [expenseDetails, setExpenseDetails] = useState<ExpenseDetails[]>([]);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
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

  const fetchExpenseDetails = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await getRequest<ExpenseDetails[]>(
        API_ENDPOINTS.expense.details,
        { headers: authHeader }
      );
      setExpenseDetails(response);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to load expense details.';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getRequest<ExpenseCategory[]>(
        API_ENDPOINTS.expense.categories,
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
      // Ignore category fetch failures; expense details can still load
    }
  };

  useEffect(() => {
    if (!accessToken) {
      navigate('/login');
      return;
    }
    fetchExpenseDetails();
    fetchCategories();
  }, [accessToken, navigate]);

  const handleChange = (field: string, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormState(buildDefaultFormState(username));
    setEditingId(null);
  };

  useEffect(() => {
    setFormState((prev) => ({
      ...prev,
      createdBy: username || 'web',
      modifiedBy: username || '',
    }));
  }, [username]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (editingId !== null) {
        const payload: ExpenseDetailsUpdatePayload = {
          amount: Number(formState.amount),
          description: formState.description.trim(),
          paymentMethod: formState.paymentMethod.trim(),
          modifiedBy: username || 'web',
        };
        await putRequest<ExpenseDetails, ExpenseDetailsUpdatePayload>(
          API_ENDPOINTS.expense.detailById(editingId),
          payload,
          { headers: authHeader }
        );
      } else {
        const payload: ExpenseDetailsCreatePayload = {
          expenseName: formState.expenseName.trim(),
          expenseDate: formState.expenseDate,
          amount: Number(formState.amount),
          description: formState.description.trim(),
          paymentMethod: formState.paymentMethod.trim(),
          expenseCode: formState.expenseCode.trim(),
          referenceNumber: formState.referenceNumber.trim(),
          receiptUrl: formState.receiptUrl.trim(),
          currency: formState.currency.trim(),
          userId: Number(formState.userId),
          status: formState.status,
          categoryId: Number(formState.categoryId),
          createdBy: username || 'web',
        };
        await postRequest<ExpenseDetails, ExpenseDetailsCreatePayload>(
          API_ENDPOINTS.expense.details,
          payload,
          { headers: authHeader }
        );
      }
      resetForm();
      await fetchExpenseDetails();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to save expense details.';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (detail: ExpenseDetails) => {
    setEditingId(detail.id);
    setFormState({
      expenseName: detail.expenseName,
      expenseDate: detail.expenseDate,
      amount: String(detail.amount),
      description: detail.description,
      paymentMethod: detail.paymentMethod,
      expenseCode: detail.expenseCode,
      referenceNumber: detail.referenceNumber,
      receiptUrl: detail.receiptUrl,
      currency: detail.currency,
      userId: String(detail.userId),
      status: detail.status,
      categoryId: String(detail.categoryId),
      createdBy: username || detail.createdBy,
      modifiedBy: username || (detail.modifiedBy ?? ''),
    });

    try {
      const latest = await getRequest<ExpenseDetails>(
        API_ENDPOINTS.expense.detailById(detail.id),
        { headers: authHeader }
      );
      setFormState((prev) => ({
        ...prev,
        amount: String(latest.amount),
        description: latest.description,
        paymentMethod: latest.paymentMethod,
        modifiedBy: latest.modifiedBy ?? prev.modifiedBy,
      }));
    } catch {
      // Ignore refresh failures; keep local values
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm('Delete this expense detail?');
    if (!confirmed) {
      return;
    }
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await deleteRequest<void>(API_ENDPOINTS.expense.detailById(id), {
        headers: authHeader,
      });
      await fetchExpenseDetails();
      if (editingId === id) {
        resetForm();
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to delete expense detail.';
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
    fetchExpenseDetails();
    fetchCategories();
  };

  return (
    <ExpenseDetailsPresenter
      expenseDetails={expenseDetails}
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

export default ExpenseDetailsContainer;
