import type { FormEvent } from 'react';
import type { ExpenseCategory } from '../../ExpenseCategory/types/ExpenseCategoryTypes';
import type { ExpenseDetails, ExpenseStatus, ExpenseReceipt } from '../types/ExpenseDetailsTypes';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Toolbar,
  Typography,
  Drawer,
  Fab,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import SearchIcon from '@mui/icons-material/Search';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';

interface ExpenseDetailsPresenterProps {
  expenseDetails: ExpenseDetails[];
  categories: ExpenseCategory[];
  isLoading: boolean;
  isSubmitting: boolean;
  errorMessage: string | null;
  successMessage: string | null;
  formState: {
    expenseName: string;
    expenseDate: string;
    amount: string;
    description: string;
    paymentMethod: string;
    expenseCode: string;
    referenceNumber: string;
    receiptUrl: string;
    currency: string;
    userId: string;
    status: ExpenseStatus;
    categoryId: string;
    createdBy: string;
    modifiedBy: string;
  };
  isEditing: boolean;
  editingId: number | null;
  currentPage: number;
  totalPages: number;
  rowsPerPage: number;
  totalCount: number;
  filteredCount: number;
  searchQuery: string;
  selectedCategoryId: string;
  sortBy: string;
  quickFilter: string;
  drawerOpen: boolean;
  totalExpenses: number;
  monthlySpend: number;
  currentMonthCount: number;
  deleteDialogOpen: boolean;
  deleteTarget: ExpenseDetails | null;
  selectedFiles: File[];
  existingReceipts: ExpenseReceipt[];
  activeReceiptsExpense: ExpenseDetails | null;
  onFileChange: (files: FileList | null) => void;
  onRemoveFile: (index: number) => void;
  onViewReceipt: (expenseId: number, receiptId: number) => void;
  onDownloadReceipt: (expenseId: number, receipt: ExpenseReceipt) => void;
  onOpenReceiptsDialog: (detail: ExpenseDetails | null) => void;
  onCloseReceiptsDialog: () => void;
  onChange: (field: string, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onEdit: (detail: ExpenseDetails) => void;
  onDeleteRequest: (detail: ExpenseDetails) => void;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
  onCancelEdit: () => void;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
  onRefresh: () => void;
  onSearchChange: (value: string) => void;
  onCategoryFilterChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onQuickFilterChange: (value: string) => void;
  onAddNew: () => void;
  onDrawerClose: () => void;
  onSnackbarClose: () => void;
}

const ExpenseDetailsPresenter = ({
  expenseDetails,
  categories,
  isLoading,
  isSubmitting,
  errorMessage,
  successMessage,
  formState,
  isEditing,
  editingId,
  currentPage,
  totalPages,
  rowsPerPage,
  totalCount,
  filteredCount,
  searchQuery,
  selectedCategoryId,
  sortBy,
  quickFilter,
  drawerOpen,
  totalExpenses,
  monthlySpend,
  currentMonthCount,
  deleteDialogOpen,
  deleteTarget,
  selectedFiles,
  existingReceipts,
  activeReceiptsExpense,
  onFileChange,
  onRemoveFile,
  onViewReceipt,
  onDownloadReceipt,
  onOpenReceiptsDialog,
  onCloseReceiptsDialog,
  onChange,
  onSubmit,
  onEdit,
  onDeleteRequest,
  onConfirmDelete,
  onCancelDelete,
  onPageChange,
  onRowsPerPageChange,
  onRefresh,
  onSearchChange,
  onCategoryFilterChange,
  onSortChange,
  onQuickFilterChange,
  onAddNew,
  onCancelEdit,
  onDrawerClose,
  onSnackbarClose,
}: ExpenseDetailsPresenterProps) => {
  return (
    <Box
      sx={{
        minHeight: '100svh',
        px: { xs: 2, md: 3 },
        py: { xs: 2, md: 3 },
        background:
          'radial-gradient(circle at top left, rgba(25,118,210,0.09), transparent 38%), linear-gradient(180deg, #f8fafc 0%, #eef4fb 100%)',
      }}
    >
      <Stack spacing={2.5}>
        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 12px 32px rgba(15, 23, 42, 0.08)',
          }}
        >
          <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: 2,
                alignItems: { xs: 'flex-start', md: 'center' },
                justifyContent: 'space-between',
              }}
            >
              <Box>
                <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1.2 }}>
                  Personal Finance Hub
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
                  Expense Details
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                  Track your expenses and savings efficiently.
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  startIcon={<PublicOutlinedIcon />}
                  onClick={onRefresh}
                  disabled={isLoading || isSubmitting}
                >
                  Refresh
                </Button>
                <Button variant="contained" startIcon={<AddIcon />} onClick={onAddNew}>
                  Add New Expense
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 2.5 }}>
          <Card sx={{ borderRadius: 3, height: '100%' }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">Total Expenses</Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, mt: 1 }}>
                  ₹{totalExpenses.toLocaleString('en-IN')}
                </Typography>
              </CardContent>
            </Card>
            <Card sx={{ borderRadius: 3, height: '100%' }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">Monthly Spend</Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, mt: 1 }}>
                  ₹{monthlySpend.toLocaleString('en-IN')}
                </Typography>
              </CardContent>
            </Card>
            <Card sx={{ borderRadius: 3, height: '100%' }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">Categories</Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, mt: 1 }}>{categories.length}</Typography>
              </CardContent>
            </Card>
            <Card sx={{ borderRadius: 3, height: '100%' }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">This Month</Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, mt: 1 }}>
                  {currentMonthCount} Expenses
                </Typography>
              </CardContent>
            </Card>
        </Box>

        <Paper elevation={0} sx={{ p: 1.5, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 1.5, alignItems: 'stretch' }}>
            <TextField
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search by name, category or payment..."
              size="small"
              sx={{ flex: 1 }}
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> } }}
            />
            <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 0.5 }}>
              {['all', ...categories.map((c) => String(c.id))].slice(0, 6).map((value) => (
                <Chip
                  key={value}
                  label={value === 'all' ? 'All' : categories.find((c) => String(c.id) === value)?.name ?? value}
                  clickable
                  color={quickFilter === value ? 'primary' : 'default'}
                  onClick={() => onQuickFilterChange(value)}
                  sx={{ borderRadius: 999 }}
                />
              ))}
            </Box>
          </Box>
        </Paper>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: 3,
          }}
        >
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: '0 12px 32px rgba(15, 23, 42, 0.08)',
            }}
          >
            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
              <Stack spacing={2.5}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: 2,
                    alignItems: { xs: 'flex-start', md: 'center' },
                    justifyContent: 'space-between',
                  }}
                >
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Saved Expenses
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Review, filter, and update the expenses in your ledger.
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Showing {filteredCount} of {totalCount} records
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip label="All" color={quickFilter === 'all' ? 'primary' : 'default'} onClick={() => onQuickFilterChange('all')} clickable />
                  <Chip label="Food" clickable />
                </Box>

                <Paper
                  elevation={0}
                  sx={{
                    p: 1.5,
                    borderRadius: 2.5,
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Toolbar disableGutters sx={{ gap: 1.5, flexWrap: 'wrap', alignItems: 'stretch' }}>
                    <TextField
                      value={searchQuery}
                      onChange={(event) => onSearchChange(event.target.value)}
                      placeholder="Search expenses..."
                      size="small"
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon fontSize="small" />
                            </InputAdornment>
                          ),
                        },
                      }}
                      sx={{ minWidth: { xs: '100%', md: 260 }, flex: 1 }}
                    />
                    <TextField
                      select
                      size="small"
                      label="Category"
                      value={selectedCategoryId}
                      onChange={(event) => onCategoryFilterChange(event.target.value)}
                      sx={{ minWidth: { xs: '100%', md: 180 } }}
                    >
                      <MenuItem value="">All categories</MenuItem>
                      {categories.map((category) => (
                        <MenuItem key={category.id} value={String(category.id)}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </TextField>
                    <TextField
                      select
                      size="small"
                      label="Sort"
                      value={sortBy}
                      onChange={(event) => onSortChange(event.target.value)}
                      sx={{ minWidth: { xs: '100%', md: 220 } }}
                    >
                      <MenuItem value="name">Name</MenuItem>
                      <MenuItem value="category">Category</MenuItem>
                      <MenuItem value="recentlyAdded">Recently Added</MenuItem>
                      <MenuItem value="recentlyUpdated">Recently Updated</MenuItem>
                    </TextField>
                  </Toolbar>
                </Paper>

                <TableContainer
                  component={Paper}
                  elevation={0}
                  sx={{
                    borderRadius: 2.5,
                    border: '1px solid',
                    borderColor: 'divider',
                    overflow: 'auto',
                    maxWidth: '100%',
                  }}
                >
                  <Table stickyHeader sx={{ minWidth: 900 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700 }}>Expense</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Amount</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Payment</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Receipt URL</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Receipts</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700 }}>
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {expenseDetails.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, alignItems: 'center' }}>
                              <CategoryOutlinedIcon color="disabled" sx={{ fontSize: 56 }} />
                              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                No expenses available
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Click &quot;Add New Expense&quot; to create your first record.
                              </Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ) : (
                        expenseDetails.map((detail, index) => {
                          const categoryName =
                            categories.find((category) => category.id === detail.categoryId)?.name ??
                            'Uncategorized';

                          return (
                            <TableRow
                              key={detail.id}
                              hover
                              sx={{
                                '&:nth-of-type(odd)': { backgroundColor: 'action.hover' },
                                '& td': { py: 1.5 },
                              }}
                            >
                              <TableCell>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    {detail.expenseName}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    Ref #{detail.expenseCode || detail.id} - row {index + 1}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Typography sx={{ fontWeight: 600 }}>
                                  {Number(detail.amount).toFixed(2)} {detail.currency}
                                </Typography>
                              </TableCell>
                              <TableCell>{categoryName}</TableCell>
                              <TableCell>{detail.paymentMethod}</TableCell>
                              <TableCell>{detail.expenseDate}</TableCell>
                              <TableCell>
                                <Tooltip title={detail.receiptUrl} arrow>
                                  <Typography
                                    component="a"
                                    href={detail.receiptUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: 0.75,
                                      maxWidth: 240,
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap',
                                      color: 'primary.main',
                                      textDecoration: 'none',
                                    }}
                                  >
                                    <LinkOutlinedIcon fontSize="inherit" />
                                    {detail.receiptUrl}
                                  </Typography>
                                </Tooltip>
                              </TableCell>
                              <TableCell>
                                {detail.receipts && detail.receipts.length > 0 ? (
                                  <Button
                                    size="small"
                                    variant="text"
                                    onClick={() => onOpenReceiptsDialog(detail)}
                                    startIcon={detail.receipts.length === 1 ? <InsertDriveFileOutlinedIcon fontSize="inherit" /> : <AttachFileIcon fontSize="inherit" />}
                                    sx={{
                                      textTransform: 'none',
                                      fontWeight: 600,
                                      padding: 0,
                                      minWidth: 0,
                                      textAlign: 'left',
                                      color: 'primary.main',
                                      '&:hover': {
                                        background: 'transparent',
                                        textDecoration: 'underline',
                                      },
                                    }}
                                  >
                                    {detail.receipts.length === 1 ? '1 Receipt' : `${detail.receipts.length} Receipts`}
                                  </Button>
                                ) : (
                                  <Typography variant="body2" color="text.secondary">
                                    —
                                  </Typography>
                                )}
                              </TableCell>
                              <TableCell align="right">
                                <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                                  <Tooltip title="Edit" arrow>
                                    <IconButton
                                      color="primary"
                                      onClick={() => onEdit(detail)}
                                      aria-label={`Edit expense ${detail.expenseName}`}
                                    >
                                      <EditOutlinedIcon />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Delete" arrow>
                                    <IconButton
                                      color="error"
                                      onClick={() => onDeleteRequest(detail)}
                                      aria-label={`Delete expense ${detail.expenseName}`}
                                    >
                                      <DeleteIcon />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: 2,
                    alignItems: { xs: 'stretch', md: 'center' },
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Page {currentPage} of {totalPages}
                  </Typography>
                  <TablePagination
                    component="div"
                    count={filteredCount}
                    page={Math.max(0, currentPage - 1)}
                    onPageChange={(_, page) => onPageChange(page + 1)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(event) =>
                      onRowsPerPageChange(Number(event.target.value))
                    }
                    rowsPerPageOptions={[5, 10, 25]}
                    labelRowsPerPage="Rows"
                  />
                </Box>

                {isLoading ? (
                  <Typography variant="body2" color="text.secondary">
                    Loading...
                  </Typography>
                ) : null}
              </Stack>
            </CardContent>
          </Card>
        </Box>

        <Fab
          color="primary"
          aria-label="add expense"
          onClick={onAddNew}
          sx={{ position: 'fixed', right: 24, bottom: 24 }}
        >
          <AddIcon />
        </Fab>

        <Drawer anchor="right" open={drawerOpen} onClose={onDrawerClose}>
          <Box sx={{ width: { xs: '100vw', sm: 450 }, p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
              {isEditing ? 'Update Expense' : 'Create Expense'}
            </Typography>
            <Box component="form" onSubmit={onSubmit}>
              {/* reuse the existing business form without changing the payload logic */}
              <Stack spacing={2}>
                <TextField label="Expense Name" value={formState.expenseName} onChange={(e) => onChange('expenseName', e.target.value)} fullWidth disabled={isEditing} />
                <TextField label="Amount" type="number" value={formState.amount} onChange={(e) => onChange('amount', e.target.value)} fullWidth />
                <TextField select label="Category" value={formState.categoryId} onChange={(e) => onChange('categoryId', e.target.value)} fullWidth>
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={String(category.id)}>{category.name}</MenuItem>
                  ))}
                </TextField>
                <TextField select label="Payment Method" value={formState.paymentMethod} onChange={(e) => onChange('paymentMethod', e.target.value)} fullWidth>
                  <MenuItem value="UPI">UPI</MenuItem>
                  <MenuItem value="Cash">Cash</MenuItem>
                  <MenuItem value="Credit card">Credit card</MenuItem>
                  <MenuItem value="Debit card">Debit card</MenuItem>
                  <MenuItem value="Net banking">Net banking</MenuItem>
                </TextField>
                <TextField label="Date" type="date" value={formState.expenseDate} onChange={(e) => onChange('expenseDate', e.target.value)} fullWidth slotProps={{ inputLabel: { shrink: true } }} />
                <TextField label="Receipt" value={formState.receiptUrl} onChange={(e) => onChange('receiptUrl', e.target.value)} fullWidth />
                <TextField label="Description" value={formState.description} onChange={(e) => onChange('description', e.target.value)} fullWidth multiline minRows={3} />
                
                {!isEditing ? (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      Receipts (Optional)
                    </Typography>
                    <Button
                      component="label"
                      variant="outlined"
                      startIcon={<CloudUploadIcon />}
                      fullWidth
                      sx={{ textTransform: 'none', borderStyle: 'dashed' }}
                    >
                      Upload Receipts
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png"
                        style={{ display: 'none' }}
                        onChange={(e) => onFileChange(e.target.files)}
                      />
                    </Button>
                    
                    {selectedFiles.length > 0 && (
                      <List sx={{ mt: 1, bgcolor: 'background.paper', borderRadius: 1.5, border: '1px solid', borderColor: 'divider' }}>
                        {selectedFiles.map((file, idx) => (
                          <ListItem
                            key={idx}
                            secondaryAction={
                              <IconButton edge="end" aria-label="delete" onClick={() => onRemoveFile(idx)} size="small">
                                <DeleteIcon fontSize="small" color="error" />
                              </IconButton>
                            }
                            sx={{ py: 0.5 }}
                          >
                            <ListItemText
                              primary={
                                <Typography variant="body2" noWrap sx={{ maxWidth: 260 }}>
                                  {file.name}
                                </Typography>
                              }
                              secondary={
                                <Typography variant="caption" color="text.secondary">
                                  {(file.size / 1024).toFixed(0)} KB
                                </Typography>
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    )}
                  </Box>
                ) : (
                  existingReceipts && existingReceipts.length > 0 && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                        Uploaded Receipts
                      </Typography>
                      <List sx={{ bgcolor: 'background.paper', borderRadius: 1.5, border: '1px solid', borderColor: 'divider' }}>
                        {existingReceipts.map((receipt) => (
                          <ListItem
                            key={receipt.id}
                            secondaryAction={
                              <Box sx={{ display: 'flex', gap: 0.5 }}>
                                <Tooltip title="View inline" arrow>
                                  <IconButton edge="end" aria-label="view" onClick={() => onViewReceipt(editingId ?? 0, receipt.id)} size="small" color="primary">
                                    <VisibilityIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Download file" arrow>
                                  <IconButton edge="end" aria-label="download" onClick={() => onDownloadReceipt(editingId ?? 0, receipt)} size="small" color="primary">
                                    <DownloadIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            }
                            sx={{ py: 0.5 }}
                          >
                            <ListItemText
                              primary={
                                <Typography variant="body2" noWrap sx={{ maxWidth: 220 }}>
                                  {receipt.fileName}
                                </Typography>
                              }
                              secondary={
                                <Typography variant="caption" color="text.secondary">
                                  {(receipt.fileSize / 1024).toFixed(0)} KB
                                </Typography>
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                      <Alert severity="info" sx={{ mt: 1.5, py: 0.5, px: 1.5 }}>
                        Receipts cannot be modified during editing.
                      </Alert>
                    </Box>
                  )
                )}

                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  <Button variant="outlined" fullWidth onClick={onCancelEdit}>Cancel</Button>
                  <Button type="submit" variant="contained" fullWidth disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Expense'}</Button>
                </Box>
              </Stack>
            </Box>
          </Box>
        </Drawer>

        <Dialog open={deleteDialogOpen} onClose={onCancelDelete}>
          <DialogTitle>Delete expense?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this expense entry? This action cannot be undone.
            </DialogContentText>
            {deleteTarget ? (
              <Typography variant="body2" sx={{ mt: 2, fontWeight: 600 }}>
                {deleteTarget.expenseName}
              </Typography>
            ) : null}
          </DialogContent>
          <DialogActions>
            <Button onClick={onCancelDelete}>Cancel</Button>
            <Button color="error" variant="contained" onClick={onConfirmDelete}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={Boolean(activeReceiptsExpense)}
          onClose={onCloseReceiptsDialog}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Receipts for {activeReceiptsExpense?.expenseName}
            </Typography>
            <IconButton onClick={onCloseReceiptsDialog} size="small">
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <Divider />
          <DialogContent sx={{ p: 2 }}>
            {activeReceiptsExpense?.receipts && activeReceiptsExpense.receipts.length > 0 ? (
              <List sx={{ p: 0 }}>
                {activeReceiptsExpense.receipts.map((receipt, idx) => (
                  <Box key={receipt.id}>
                    {idx > 0 && <Divider sx={{ my: 1.5 }} />}
                    <ListItem disableGutters sx={{ py: 0.5 }}>
                      <ListItemText
                        primary={
                          <Tooltip title={receipt.fileName} arrow>
                            <Typography variant="body1" sx={{ fontWeight: 600, maxWidth: { xs: 200, sm: 300 }, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {receipt.fileName}
                            </Typography>
                          </Tooltip>
                        }
                        secondary={
                          <Typography variant="body2" color="text.secondary">
                            {receipt.contentType.split('/')[1]?.toUpperCase() || 'FILE'} &bull; {(receipt.fileSize / 1024).toFixed(0)} KB
                          </Typography>
                        }
                      />
                      <ListItemSecondaryAction sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<VisibilityIcon />}
                          onClick={() => onViewReceipt(activeReceiptsExpense.id, receipt.id)}
                          sx={{ textTransform: 'none' }}
                        >
                          View
                        </Button>
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<DownloadIcon />}
                          onClick={() => onDownloadReceipt(activeReceiptsExpense.id, receipt)}
                          sx={{ textTransform: 'none' }}
                        >
                          Download
                        </Button>
                      </ListItemSecondaryAction>
                    </ListItem>
                  </Box>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 3 }}>
                No receipts found.
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={onCloseReceiptsDialog}>Close</Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={Boolean(successMessage)}
          autoHideDuration={3500}
          onClose={onSnackbarClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert onClose={onSnackbarClose} severity="success" variant="filled" sx={{ width: '100%' }}>
            {successMessage}
          </Alert>
        </Snackbar>
      </Stack>
    </Box>
  );
};

export default ExpenseDetailsPresenter;
