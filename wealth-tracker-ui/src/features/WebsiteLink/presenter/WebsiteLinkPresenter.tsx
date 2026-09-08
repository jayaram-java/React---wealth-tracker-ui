import type { FormEvent } from 'react';
import AddIcon from '@mui/icons-material/Add';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import SearchIcon from '@mui/icons-material/Search';
import AddLinkIcon from '@mui/icons-material/AddLink';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RefreshIcon from '@mui/icons-material/Refresh';
import LanguageIcon from '@mui/icons-material/Language';
import NotesIcon from '@mui/icons-material/Notes';
import CategoryIcon from '@mui/icons-material/Category';
import SettingsIcon from '@mui/icons-material/Settings';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Fab,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import type { WebsiteLink } from '../types/WebsiteLinkTypes';
import type { WebsiteCategory } from '../../WebsiteCategory/types/WebsiteCategoryTypes';
import { getDisplayUrl } from '../../../utils/url';
import '../styles/WebsiteLink.css';

interface WebsiteLinkPresenterProps {
  links: WebsiteLink[];
  categories: WebsiteCategory[];
  filteredCategories: WebsiteCategory[];
  isLoading: boolean;
  errorMessage: string | null;
  formState: {
    websiteLink: string;
    description: string;
    remarks: string;
    isActive: boolean;
    categoryId: string;
    createdBy: string;
    modifiedBy: string;
  };
  isEditing: boolean;
  categorySearch: string;
  searchQuery: string;
  filterCategoryId: string;
  sortBy: 'newest' | 'oldest' | 'alpha' | 'category';
  currentPage: number;
  totalPages: number;
  totalCount: number;
  onChange: (
    field: keyof WebsiteLinkPresenterProps['formState'],
    value: string
  ) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onEdit: (link: WebsiteLink) => void;
  onDelete: (id: number) => void;
  onCancelEdit: () => void;
  onCategorySearchChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onFilterChange: (value: string) => void;
  onSortChange: (value: 'newest' | 'oldest' | 'alpha' | 'category') => void;
  onPageChange: (page: number) => void;
  onRefresh: () => void;
}

const WebsiteLinkPresenter = ({
  links,
  categories,
  filteredCategories,
  isLoading,
  errorMessage,
  formState,
  isEditing,
  categorySearch,
  searchQuery,
  filterCategoryId,
  sortBy,
  currentPage,
  totalPages,
  totalCount,
  onChange,
  onSubmit,
  onEdit,
  onDelete,
  onCancelEdit,
  onCategorySearchChange,
  onSearchChange,
  onFilterChange,
  onSortChange,
  onPageChange,
  onRefresh,
}: WebsiteLinkPresenterProps) => {
  const categoryLookup = new Map(
    categories.map((category) => [category.id, category.categoryName])
  );
  const selectedCategory = categories.find(
    (category) => String(category.id) === formState.categoryId
  );
  const selectedCategoryInFilteredList = filteredCategories.some(
    (category) => String(category.id) === formState.categoryId
  );

  const categoryOptions =
    categories.length === 0 ? (
      <MenuItem value="">No categories available</MenuItem>
    ) : filteredCategories.length === 0 ? (
      <MenuItem value="">No categories found</MenuItem>
    ) : !selectedCategoryInFilteredList && selectedCategory ? (
      <>
        <MenuItem value={String(selectedCategory.id)}>{selectedCategory.categoryName}</MenuItem>
        {filteredCategories
          .filter((category) => category.id !== selectedCategory.id)
          .map((category) => (
            <MenuItem key={category.id} value={String(category.id)}>
              {category.categoryName}
            </MenuItem>
          ))}
      </>
    ) : (
      filteredCategories.map((category) => (
        <MenuItem key={category.id} value={String(category.id)}>
          {category.categoryName}
        </MenuItem>
      ))
    );

  const buildHref = (value: string) => {
    try {
      return new URL(value).toString();
    } catch {
      try {
        return new URL(`https://${value}`).toString();
      } catch {
        return '';
      }
    }
  };

  const totalCategories = categories.length;
  const activeLinks = links.filter((link) => link.isActive).length;
  const recentLinks = links.filter((link) => {
    if (!link.createdDate) return false;
    const createdAt = new Date(link.createdDate);
    const daysSinceCreated = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
    return Number.isFinite(daysSinceCreated) && daysSinceCreated <= 30;
  }).length;

  return (
    <Box
      data-testid="website-link-page"
      sx={{
        minHeight: '100svh',
        px: { xs: 2, md: 3 },
        py: { xs: 2, md: 3 },
        background:
          'radial-gradient(circle at top left, rgba(25,118,210,0.09), transparent 38%), linear-gradient(180deg, #f8fafc 0%, #eef4fb 100%)',
      }}
    >
      <Box sx={{ display: 'grid', gap: 2.5 }}>
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
                  Website Link Center
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
                  Website Links
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                  Manage and organize your favorite website shortcuts.
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={onRefresh}
                  disabled={isLoading}
                >
                  Refresh
                </Button>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() =>
                    document
                      .querySelector('[data-testid="website-link-form"]')
                      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }
                >
                  Add New Link
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
            gap: 2.5,
          }}
        >
          <Card sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Total Links
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, mt: 1 }}>
                {links.length}
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Categories
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, mt: 1 }}>
                {totalCategories}
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Active
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, mt: 1 }}>
                {activeLinks}
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Recently Added
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, mt: 1 }}>
                {recentLinks}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Paper elevation={0} sx={{ p: 1.5, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 1.5, alignItems: 'stretch' }}>
            <TextField
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search website..."
              size="small"
              sx={{ flex: 1 }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 0.5 }}>
              {[
                { value: 'all', label: 'All' },
                ...categories.map((category) => ({
                  value: String(category.id),
                  label: category.categoryName,
                })),
              ]
                .slice(0, 6)
                .map((category) => (
                  <Chip
                    key={category.value}
                    label={category.label}
                    clickable
                    color={filterCategoryId === category.value ? 'primary' : 'default'}
                    onClick={() => onFilterChange(category.value)}
                    sx={{ borderRadius: 999 }}
                  />
                ))}
            </Box>
          </Box>
        </Paper>

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
            <Box sx={{ display: 'grid', gap: 2.5 }}>
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
                    Saved Links
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Review, search and manage your saved website links.
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Showing {links.length ? totalCount : 0} of {totalCount} records
                </Typography>
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
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 1.5, alignItems: 'stretch' }}>
                  <TextField
                    value={searchQuery}
                    onChange={(event) => onSearchChange(event.target.value)}
                    placeholder="Search website..."
                    size="small"
                    sx={{ minWidth: { xs: '100%', md: 260 }, flex: 1 }}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon fontSize="small" />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                  <TextField
                    select
                    size="small"
                    label="Category"
                    value={filterCategoryId}
                    onChange={(event) => onFilterChange(event.target.value)}
                    sx={{ minWidth: { xs: '100%', md: 180 } }}
                  >
                    <MenuItem value="all">All categories</MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={String(category.id)}>
                        {category.categoryName}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    select
                    size="small"
                    label="Sort"
                    value={sortBy}
                    onChange={(event) => onSortChange(event.target.value as WebsiteLinkPresenterProps['sortBy'])}
                    sx={{ minWidth: { xs: '100%', md: 180 } }}
                  >
                    <MenuItem value="newest">Newest</MenuItem>
                    <MenuItem value="oldest">Oldest</MenuItem>
                    <MenuItem value="alpha">A-Z</MenuItem>
                    <MenuItem value="category">Category</MenuItem>
                  </TextField>
                  <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={onRefresh}
                    disabled={isLoading}
                  >
                    Refresh
                  </Button>
                </Box>
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
                      <TableCell sx={{ fontWeight: 700 }}>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          <LanguageIcon fontSize="small" />
                          Website
                        </Box>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          <NotesIcon fontSize="small" />
                          Description
                        </Box>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          <CategoryIcon fontSize="small" />
                          Category
                        </Box>
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
                          <SettingsIcon fontSize="small" />
                          Actions
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {links.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, alignItems: 'center' }}>
                            <CategoryOutlinedIcon color="disabled" sx={{ fontSize: 56 }} />
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                              No links available
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Click &quot;Add New Link&quot; to create your first record.
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ) : (
                      links.map((link) => {
                        const href = buildHref(link.websiteLink);

                        return (
                          <TableRow
                            key={link.id}
                            hover
                            sx={{
                              '&:nth-of-type(odd)': { backgroundColor: 'common.white' },
                              '&:nth-of-type(even)': { backgroundColor: '#FAFAFA' },
                              '& td': { py: 1.5 },
                              transition: 'background-color 200ms ease, box-shadow 200ms ease',
                              cursor: 'pointer',
                              '&:hover': {
                                backgroundColor: 'action.hover',
                                boxShadow: 'inset 0 0 0 1px rgba(25,118,210,0.12)',
                              },
                            }}
                          >
                            <TableCell>
                              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <LinkOutlinedIcon color="primary" fontSize="small" />
                                {href ? (
                                  <Tooltip title={link.websiteLink} arrow>
                                    <Box
                                      component="a"
                                      href={href}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={(event) => event.stopPropagation()}
                                      aria-label={`Open ${link.websiteLink} in a new tab`}
                                      sx={{
                                        color: 'primary.main',
                                        fontWeight: 600,
                                        textDecoration: 'none',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 0.75,
                                        '&:hover': { textDecoration: 'underline' },
                                      }}
                                    >
                                      {getDisplayUrl(link.websiteLink)}
                                    </Box>
                                  </Tooltip>
                                ) : (
                                  <Tooltip title={link.websiteLink} arrow>
                                    <Typography
                                      component="span"
                                      sx={{
                                        color: 'primary.main',
                                        fontWeight: 600,
                                      }}
                                    >
                                      {getDisplayUrl(link.websiteLink) || link.websiteLink}
                                    </Typography>
                                  </Tooltip>
                                )}
                              </Box>
                            </TableCell>
                            <TableCell>{link.description}</TableCell>
                            <TableCell>{categoryLookup.get(link.categoryId) ?? '-'}</TableCell>
                            <TableCell align="right">
                              <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                                <Tooltip title="Edit" arrow>
                                  <IconButton
                                    color="primary"
                                    onClick={() => onEdit(link)}
                                    aria-label={`Edit website link ${link.websiteLink}`}
                                    data-testid={`website-link-edit-${link.id}`}
                                  >
                                    <EditOutlinedIcon />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete" arrow>
                                  <IconButton
                                    color="error"
                                    onClick={() => onDelete(link.id)}
                                    aria-label={`Delete website link ${link.websiteLink}`}
                                    data-testid={`website-link-delete-${link.id}`}
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
                  count={totalCount}
                  page={Math.max(0, currentPage - 1)}
                  onPageChange={(_, page) => onPageChange(page + 1)}
                  rowsPerPage={10}
                  rowsPerPageOptions={[10]}
                  onRowsPerPageChange={() => undefined}
                  labelRowsPerPage="Rows"
                />
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card
          component="form"
          onSubmit={onSubmit}
          data-testid="website-link-form"
          elevation={0}
          sx={{
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 12px 32px rgba(15, 23, 42, 0.08)',
          }}
        >
          <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
            <Box sx={{ display: 'grid', gap: 2.5 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {isEditing ? 'Update Website Link' : 'Create Website Link'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Keep your shortcuts organized and easy to update.
                </Typography>
              </Box>

              <Box sx={{ display: 'grid', gap: 2 }}>
                <TextField
                  label="Website URL"
                  data-testid="website-link-url"
                  value={formState.websiteLink}
                  onChange={(event) => onChange('websiteLink', event.target.value)}
                  required
                  fullWidth
                  type="url"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <PublicOutlinedIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <TextField
                  label="Description"
                  data-testid="website-link-description"
                  value={formState.description}
                  onChange={(event) => onChange('description', event.target.value)}
                  required
                  fullWidth
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <NotesIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <TextField
                  label="Category Search"
                  data-testid="website-link-category-search"
                  value={categorySearch}
                  onChange={(event) => onCategorySearchChange(event.target.value)}
                  fullWidth
                  autoComplete="off"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <TextField
                  select
                  label="Category"
                  data-testid="website-link-category"
                  value={formState.categoryId}
                  onChange={(event) => onChange('categoryId', event.target.value)}
                  required
                  fullWidth
                  disabled={categories.length === 0}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <CategoryIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    },
                  }}
                >
                  {categoryOptions}
                </TextField>
                <TextField
                  label="Remarks"
                  data-testid="website-link-remarks"
                  value={formState.remarks}
                  onChange={(event) => onChange('remarks', event.target.value)}
                  required
                  fullWidth
                  multiline
                  minRows={3}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                          <NotesIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  type="submit"
                  startIcon={<AddLinkIcon />}
                  data-testid="website-link-submit"
                  disabled={isLoading}
                >
                  {isEditing ? 'Update Link' : 'Save Link'}
                </Button>
                {isEditing ? (
                  <Button
                    variant="outlined"
                    type="button"
                    startIcon={<ArrowBackIcon />}
                    onClick={onCancelEdit}
                    data-testid="website-link-cancel"
                  >
                    Cancel
                  </Button>
                ) : null}
              </Box>

              {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Fab
        color="primary"
        aria-label="add website link"
        onClick={() =>
          document
            .querySelector('[data-testid="website-link-form"]')
            ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
        sx={{ position: 'fixed', right: 24, bottom: 24 }}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default WebsiteLinkPresenter;
