import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '../../login/context/useAuth';
import { useAppNavigation } from '../../../context/AppNavigationContext';
import {
  getAllTasks,
  getTasksByEmployee,
  getTasksByStatus,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from '../api/taskApi';
import MyTasksPresenter from '../presenter/MyTasksPresenter';
import type {
  EmployeeTask,
  TaskFormState,
  TaskFilters,
  TaskStatus,
  IsActive,
  TaskSummary,
} from '../types/MyTasksTypes';
import { MAX_TEXT_LENGTH, DEFAULT_PROJECT } from '../constants';

// --- Helpers ------------------------------------------------------------------

const getLocalDate = () => {
  const now = new Date();
  const timezoneOffset = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - timezoneOffset).toISOString().slice(0, 10);
};

const buildDefaultForm = (): TaskFormState => ({
  assignedTo: '',
  officeName: 'Aspire_Systems',
  taskCategory: '',
  taskStatus: 'IN_PROGRESS',
  isActive: 'Y',
  taskName: '',
  taskDescription: '',
  startDate: getLocalDate(),
  endDate: '',
  project: DEFAULT_PROJECT,
});

const validateForm = (f: TaskFormState): string | null => {
  if (!f.taskName.trim()) return 'Task name is required.';
  if (f.taskName.length > MAX_TEXT_LENGTH) return `Task name must be at most ${MAX_TEXT_LENGTH} characters.`;

  if (!f.taskStatus) return 'Status is required.';
  if (!f.taskCategory) return 'Category is required.';
  if (!f.officeName.trim()) return 'Office name is required.';
  if (f.officeName.length > MAX_TEXT_LENGTH) return `Office name must be at most ${MAX_TEXT_LENGTH} characters.`;
  if (!f.startDate) return 'Start date is required.';
  if (!f.endDate) return 'End date is required.';
  if (f.endDate < f.startDate) return 'End date must not be before start date.';
  if (f.taskDescription.length > MAX_TEXT_LENGTH)
    return `Description must be at most ${MAX_TEXT_LENGTH} characters.`;
  return null;
};

const applyLocalFilters = (tasks: EmployeeTask[], filters: TaskFilters): EmployeeTask[] => {
  let result = tasks;
  if (filters.projectFilter) {
    result = result.filter((t) => t.project === filters.projectFilter);
  }
  if (filters.nameSearch.trim()) {
    const q = filters.nameSearch.trim().toLowerCase();
    result = result.filter((t) => t.taskName.toLowerCase().includes(q));
  }
  // The API does not guarantee ordering. A higher task id is the newest record,
  // so every filtered view remains consistently newest first.
  return [...result].sort((left, right) => right.taskId - left.taskId);
};

// --- Container ----------------------------------------------------------------

const MyTasksContainer = () => {
  const { accessToken, tokenType } = useAuth();
  const { navigateTo } = useAppNavigation();

  // Data
  const [allTasks, setAllTasks] = useState<EmployeeTask[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [listError, setListError] = useState<string | null>(null);

  // Form
  const [formState, setFormState] = useState<TaskFormState>(buildDefaultForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Filters
  const [filters, setFilters] = useState<TaskFilters>({
    statusFilter: '',
    employeeIdFilter: '',
    nameSearch: '',
    projectFilter: '',
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Delete
  const [deleteTarget, setDeleteTarget] = useState<EmployeeTask | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // View
  const [viewTarget, setViewTarget] = useState<EmployeeTask | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const token = accessToken;
  const tType = tokenType;

  // --- Fetch ------------------------------------------------------------------

  const fetchTasks = useCallback(
    async (currentFilters: TaskFilters) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setIsLoading(true);
      setListError(null);

      try {
        let data: EmployeeTask[];
        const empId = currentFilters.employeeIdFilter.trim();
        const status = currentFilters.statusFilter;

        if (empId && !isNaN(Number(empId)) && Number(empId) > 0) {
          data = await getTasksByEmployee(Number(empId), token, tType);
          if (status) data = data.filter((t) => t.taskStatus === status);
        } else if (status) {
          data = await getTasksByStatus(status, token, tType);
        } else {
          data = await getAllTasks(token, tType);
        }

        if (controller.signal.aborted) return;
        setAllTasks(data);
        setCurrentPage(1); // reset to first page on new data
      } catch (err) {
        if (controller.signal.aborted) return;
        setListError(err instanceof Error ? err.message : 'Failed to load tasks.');
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    },
    [token, tType]
  );

  // --- Mount ------------------------------------------------------------------

  useEffect(() => {
    if (!accessToken) { navigateTo('login'); return; }
    void fetchTasks(filters);
    return () => { abortRef.current?.abort(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, navigateTo]);

  // Re-fetch when server-side filters change
  useEffect(() => {
    if (!accessToken) return;
    void fetchTasks(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.statusFilter, filters.employeeIdFilter]);

  // --- Derived ----------------------------------------------------------------

  const dynamicStatuses = useMemo(
    () => [...new Set(allTasks.map((t) => t.taskStatus))],
    [allTasks]
  );

  const filteredTasks = useMemo(
    () => applyLocalFilters(allTasks, filters),
    [allTasks, filters]
  );

  const taskSummary = useMemo<TaskSummary>(
    () => ({
      total: filteredTasks.length,
      inProgress: filteredTasks.filter((task) => task.taskStatus === 'IN_PROGRESS').length,
      completed: filteredTasks.filter((task) => task.taskStatus === 'COMPLETED').length,
      active: filteredTasks.filter((task) => task.isActive === 'Y').length,
    }),
    [filteredTasks]
  );

  // Reset to page 1 when client-side name search changes
  useEffect(() => { setCurrentPage(1); }, [filters.nameSearch]);

  const totalTasks = filteredTasks.length;
  const totalPages = Math.max(1, Math.ceil(totalTasks / rowsPerPage));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedTasks = useMemo(() => {
    const start = (safePage - 1) * rowsPerPage;
    return filteredTasks.slice(start, start + rowsPerPage);
  }, [filteredTasks, safePage, rowsPerPage]);

  // --- Handlers ---------------------------------------------------------------

  const handleFilterChange = (field: keyof TaskFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleClearFilters = () => {
    const cleared: TaskFilters = { statusFilter: '', employeeIdFilter: '', nameSearch: '', projectFilter: '' };
    setFilters(cleared);
    void fetchTasks(cleared);
  };

  const handleFormChange = (field: keyof TaskFormState, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    setFormError(null);
  };

  const resetForm = () => {
    setFormState(buildDefaultForm());
    setEditingId(null);
    setFormError(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const err = validateForm(formState);
    if (err) { setFormError(err); return; }
    setIsSubmitting(true);
    setFormError(null);

    const payload = {
      assignedTo: Number(formState.assignedTo),
      officeName: formState.officeName.trim(),
      taskCategory: formState.taskCategory,
      taskStatus: formState.taskStatus as TaskStatus,
      isActive: formState.isActive as IsActive,
      taskName: formState.taskName.trim(),
      taskDescription: formState.taskDescription.trim(),
      startDate: formState.startDate,
      endDate: formState.endDate,
      project: formState.project.trim(),
    };

    try {
      if (editingId !== null) {
        await updateTask(editingId, payload, token, tType);
      } else {
        await createTask(payload, token, tType);
      }
      resetForm();
      await fetchTasks(filters);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to save task.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (task: EmployeeTask) => {
    setEditingId(task.taskId);
    setFormError(null);
    setFormState({
      assignedTo: String(task.assignedTo),
      officeName: task.officeName,
      taskCategory: task.taskCategory,
      taskStatus: task.taskStatus,
      isActive: task.isActive,
      taskName: task.taskName,
      taskDescription: task.taskDescription,
      startDate: task.startDate,
      endDate: task.endDate,
      project: task.project ?? '',
    });
    try {
      const latest = await getTaskById(task.taskId, token, tType);
      setFormState({
        assignedTo: String(latest.assignedTo),
        officeName: latest.officeName,
        taskCategory: latest.taskCategory,
        taskStatus: latest.taskStatus,
        isActive: latest.isActive,
        taskName: latest.taskName,
        taskDescription: latest.taskDescription,
        startDate: latest.startDate,
        endDate: latest.endDate,
        project: latest.project ?? '',
      });
    } catch {
      // Keep local values if refresh fails
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => resetForm();

  const handleDeleteRequest = (task: EmployeeTask) => setDeleteTarget(task);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteTask(deleteTarget.taskId, token, tType);
      setDeleteTarget(null);
      if (editingId === deleteTarget.taskId) resetForm();
      await fetchTasks(filters);
    } catch (err) {
      setListError(err instanceof Error ? err.message : 'Failed to delete task.');
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => setDeleteTarget(null);
  const handleView = (task: EmployeeTask) => setViewTarget(task);
  const handleCloseView = () => setViewTarget(null);
  const handleRefresh = () => void fetchTasks(filters);

  // --- Pagination handlers -----------------------------------------------------

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleRowsPerPageChange = (rows: number) => {
    setRowsPerPage(rows);
    setCurrentPage(1);
  };

  return (
    <MyTasksPresenter
      tasks={paginatedTasks}
      isLoading={isLoading}
      isSubmitting={isSubmitting}
      isDeleting={isDeleting}
      listError={listError}
      formError={formError}
      formState={formState}
      isEditing={editingId !== null}
      filters={filters}
      dynamicStatuses={dynamicStatuses}
      deleteTarget={deleteTarget}
      viewTarget={viewTarget}
      // pagination
      currentPage={safePage}
      totalPages={totalPages}
      totalTasks={totalTasks}
      rowsPerPage={rowsPerPage}
      taskSummary={taskSummary}
      // handlers
      onFilterChange={handleFilterChange}
      onClearFilters={handleClearFilters}
      onFormChange={handleFormChange}
      onSubmit={handleSubmit}
      onCancelEdit={handleCancelEdit}
      onView={handleView}
      onCloseView={handleCloseView}
      onEdit={handleEdit}
      onDeleteRequest={handleDeleteRequest}
      onDeleteConfirm={handleDeleteConfirm}
      onDeleteCancel={handleDeleteCancel}
      onRefresh={handleRefresh}
      onPageChange={handlePageChange}
      onRowsPerPageChange={handleRowsPerPageChange}
    />
  );
};

export default MyTasksContainer;
