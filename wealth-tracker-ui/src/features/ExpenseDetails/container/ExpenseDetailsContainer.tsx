import { useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  deleteRequest,
  getRequest,
  postRequest,
  putRequest,
  postMultipartRequest,
  getBlobRequest,
} from '../../../serviceconfigs/AxiosAPI';
import { API_ENDPOINTS } from '../../../serviceconfigs/ApiEndpoints';
import { useAuth } from '../../login/context/useAuth';
import ExpenseDetailsPresenter from '../presenter/ExpenseDetailsPresenter';
import type { ExpenseCategory } from '../../ExpenseCategory/types/ExpenseCategoryTypes';
import type {
  ExpenseDetails,
  ExpenseDetailsCreatePayload,
  ExpenseDetailsUpdatePayload,
  ExpenseStatus,
  ExpenseReceipt,
} from '../types/ExpenseDetailsTypes';
import { decodeJwtPayload } from '../../../utils/jwt';
import { useAppNavigation } from '../../../context/AppNavigationContext';

interface JwtPayload {
  userId?: number;
}

type SortBy = 'name' | 'category' | 'recentlyAdded' | 'recentlyUpdated';
type QuickFilter = 'all' | 'category' | 'payment';

const buildDefaultFormState = (username: string, userId: number | null) => ({
  expenseName: '',
  expenseDate: new Date().toISOString().slice(0, 10),
  amount: '',
  description: '',
  paymentMethod: 'UPI',
  expenseCode: '',
  referenceNumber: '',
  receiptUrl: '',
  currency: 'INR',
  userId: userId !== null ? String(userId) : '',
  status: 'ACTIVE' as ExpenseStatus,
  categoryId: '',
  createdBy: username || 'web',
  modifiedBy: username || '',
});

const ExpenseDetailsContainer = () => {
  const { accessToken, tokenType, username } = useAuth();
  const { navigateTo } = useAppNavigation();
  const [expenseDetails, setExpenseDetails] = useState<ExpenseDetails[]>([]);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('recentlyAdded');
  const [quickFilter, setQuickFilter] = useState<QuickFilter>('all');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ExpenseDetails | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [existingReceipts, setExistingReceipts] = useState<ExpenseReceipt[]>([]);
  const [activeReceiptsExpense, setActiveReceiptsExpense] = useState<ExpenseDetails | null>(null);
  const [formState, setFormState] = useState(() =>
    buildDefaultFormState(username, null)
  );

  const authHeader = useMemo<Record<string, string> | undefined>(() => {
    if (!accessToken) {
      return undefined;
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
      if (response.length > 0) {
        setFormState((prev) => {
          if (prev.categoryId) {
            return prev;
          }
          return {
            ...prev,
            categoryId: String(response[0].id),
          };
        });
      }
    } catch {
      // Ignore category fetch failures; expense details can still load
    }
  };

  useEffect(() => {
    if (!accessToken) {
      navigateTo('login');
      return;
    }
    fetchExpenseDetails();
    fetchCategories();
  }, [accessToken, navigateTo]);

  const handleChange = (field: string, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormState(buildDefaultFormState(username, userId));
    setEditingId(null);
    setSelectedFiles([]);
    setExistingReceipts([]);
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
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      if (userId === null) {
        setErrorMessage('Unable to read userId from access token.');
        return;
      }
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
        setSuccessMessage('Expense updated successfully.');
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
          userId,
          status: formState.status,
          categoryId: Number(formState.categoryId),
          createdBy: username || 'web',
        };

        if (selectedFiles.length > 0) {
          const formData = new FormData();
          formData.append(
            'request',
            new Blob([JSON.stringify(payload)], { type: 'application/json' })
          );
          selectedFiles.forEach((file) => {
            formData.append('receipts', file);
          });
          await postMultipartRequest<ExpenseDetails>(
            API_ENDPOINTS.expense.details,
            formData,
            { headers: authHeader }
          );
        } else {
          await postRequest<ExpenseDetails, ExpenseDetailsCreatePayload>(
            API_ENDPOINTS.expense.details,
            payload,
            { headers: authHeader }
          );
        }
        setSuccessMessage('Expense created successfully.');
      }
      resetForm();
      await fetchExpenseDetails();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to save expense details.';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (detail: ExpenseDetails) => {
    setDrawerOpen(true);
    setEditingId(detail.id);
    setExistingReceipts(detail.receipts || []);
    setSelectedFiles([]);
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
      userId: userId !== null ? String(userId) : String(detail.userId),
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

  const handleDeleteRequest = (detail: ExpenseDetails) => {
    setDeleteTarget(detail);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) {
      return;
    }
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      await deleteRequest<void>(API_ENDPOINTS.expense.detailById(deleteTarget.id), {
        headers: authHeader,
      });
      setSuccessMessage('Expense deleted successfully.');
      await fetchExpenseDetails();
      if (editingId === deleteTarget.id) {
        resetForm();
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to delete expense detail.';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
      setDeleteTarget(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteTarget(null);
  };

  const handleAddNew = () => {
    resetForm();
    setDrawerOpen(true);
  };

  const filteredAndSortedExpenses = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const items = expenseDetails.filter((detail) => {
      const categoryName =
        categories.find((category) => category.id === detail.categoryId)?.name ?? '';
      const matchesSearch =
        normalizedQuery.length === 0 ||
        [
          detail.expenseName,
          detail.description,
          detail.paymentMethod,
          detail.expenseCode,
          detail.referenceNumber,
          detail.receiptUrl,
          categoryName,
        ]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(normalizedQuery));
      const matchesCategory =
        selectedCategoryId === '' || String(detail.categoryId) === selectedCategoryId;
      const matchesQuickFilter =
        quickFilter === 'all' ||
        (quickFilter === 'category' && selectedCategoryId !== '') ||
        (quickFilter === 'payment' && detail.paymentMethod);
      return matchesSearch && matchesCategory && matchesQuickFilter;
    });

    const sorted = [...items].sort((left, right) => {
      switch (sortBy) {
        case 'name':
          return left.expenseName.localeCompare(right.expenseName);
        case 'category': {
          const leftCategory =
            categories.find((category) => category.id === left.categoryId)?.name ?? '';
          const rightCategory =
            categories.find((category) => category.id === right.categoryId)?.name ?? '';
          return leftCategory.localeCompare(rightCategory);
        }
        case 'recentlyUpdated':
          return (
            new Date(right.modifiedDate ?? right.createdDate).getTime() -
            new Date(left.modifiedDate ?? left.createdDate).getTime()
          );
        case 'recentlyAdded':
        default:
          return (
            new Date(right.createdDate).getTime() - new Date(left.createdDate).getTime()
          );
      }
    });

    return sorted;
  }, [categories, expenseDetails, quickFilter, searchQuery, selectedCategoryId, sortBy]);

  const totalExpenses = useMemo(
    () => expenseDetails.reduce((sum, detail) => sum + Number(detail.amount || 0), 0),
    [expenseDetails]
  );
  const monthlySpend = useMemo(() => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    return expenseDetails
      .filter((detail) => detail.expenseDate.startsWith(currentMonth))
      .reduce((sum, detail) => sum + Number(detail.amount || 0), 0);
  }, [expenseDetails]);
  const currentMonthCount = useMemo(() => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    return expenseDetails.filter((detail) => detail.expenseDate.startsWith(currentMonth)).length;
  }, [expenseDetails]);

  const totalFilteredCount = filteredAndSortedExpenses.length;
  const totalPages = Math.max(1, Math.ceil(totalFilteredCount / rowsPerPage));
  const pagedExpenses = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredAndSortedExpenses.slice(startIndex, startIndex + rowsPerPage);
  }, [currentPage, filteredAndSortedExpenses, rowsPerPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategoryId, sortBy, rowsPerPage]);

  const handlePageChange = (page: number) => {
    const nextPage = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(nextPage);
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  const handleRefresh = () => {
    fetchExpenseDetails();
    fetchCategories();
  };

  const handleSnackbarClose = () => {
    setSuccessMessage(null);
  };

  const handleFileChange = (newFiles: FileList | null) => {
    setErrorMessage(null);
    if (!newFiles) return;
    const filesList = Array.from(newFiles);

    if (selectedFiles.length + filesList.length > 10) {
      setErrorMessage('A maximum of 10 receipt files is allowed.');
      return;
    }

    const validFiles: File[] = [];
    for (const file of filesList) {
      if (file.size <= 0) {
        setErrorMessage('Receipt file must not be empty.');
        return;
      }
      if (file.size > 15 * 1024 * 1024) {
        setErrorMessage('Receipt file exceeds the maximum allowed size of 15MB.');
        return;
      }
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type.toLowerCase())) {
        setErrorMessage('Unsupported receipt content type. Only PDF, JPEG, and PNG are allowed.');
        return;
      }
      validFiles.push(file);
    }

    setSelectedFiles((prev) => [...prev, ...validFiles]);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleViewReceipt = async (expenseId: number, receiptId: number) => {
    try {
      const url = API_ENDPOINTS.expense.receiptById(expenseId, receiptId);
      const blob = await getBlobRequest(url, { headers: authHeader });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
      setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to view receipt.';
      setErrorMessage(message);
    }
  };

  const handleDownloadReceipt = async (expenseId: number, receipt: ExpenseReceipt) => {
    try {
      const url = API_ENDPOINTS.expense.receiptById(expenseId, receipt.id);
      const blob = await getBlobRequest(url, { headers: authHeader });
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = receipt.fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to download receipt.';
      setErrorMessage(message);
    }
  };

  return (
    <ExpenseDetailsPresenter
      expenseDetails={pagedExpenses}
      categories={categories}
      isLoading={isLoading}
      isSubmitting={isSubmitting}
      errorMessage={errorMessage}
      successMessage={successMessage}
      formState={formState}
      isEditing={editingId !== null}
      editingId={editingId}
      currentPage={currentPage}
      totalPages={totalPages}
      rowsPerPage={rowsPerPage}
      totalCount={expenseDetails.length}
      filteredCount={totalFilteredCount}
      searchQuery={searchQuery}
      selectedCategoryId={selectedCategoryId}
      sortBy={sortBy}
      quickFilter={quickFilter}
      drawerOpen={drawerOpen}
      totalExpenses={totalExpenses}
      monthlySpend={monthlySpend}
      currentMonthCount={currentMonthCount}
      deleteDialogOpen={deleteTarget !== null}
      deleteTarget={deleteTarget}
      selectedFiles={selectedFiles}
      existingReceipts={existingReceipts}
      activeReceiptsExpense={activeReceiptsExpense}
      onFileChange={handleFileChange}
      onRemoveFile={handleRemoveFile}
      onViewReceipt={handleViewReceipt}
      onDownloadReceipt={handleDownloadReceipt}
      onOpenReceiptsDialog={setActiveReceiptsExpense}
      onCloseReceiptsDialog={() => setActiveReceiptsExpense(null)}
      onChange={handleChange}
      onSubmit={handleSubmit}
      onEdit={handleEdit}
      onDeleteRequest={handleDeleteRequest}
      onConfirmDelete={handleConfirmDelete}
      onCancelDelete={handleDeleteCancel}
      onCancelEdit={handleCancelEdit}
      onPageChange={handlePageChange}
      onRowsPerPageChange={setRowsPerPage}
      onRefresh={handleRefresh}
      onSearchChange={setSearchQuery}
      onCategoryFilterChange={setSelectedCategoryId}
      onSortChange={(value) => setSortBy(value as SortBy)}
      onQuickFilterChange={(value) => setQuickFilter(value as QuickFilter)}
      onAddNew={handleAddNew}
      onDrawerClose={() => setDrawerOpen(false)}
      onSnackbarClose={handleSnackbarClose}
    />
  );
};

export default ExpenseDetailsContainer;
