import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

interface DeleteConfirmDialogProps {
  open: boolean;
  taskName: string;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmDialog = ({
  open,
  taskName,
  isLoading,
  onConfirm,
  onCancel,
}: DeleteConfirmDialogProps) => (
  <Dialog
    open={open}
    onClose={onCancel}
    aria-labelledby="delete-dialog-title"
    aria-describedby="delete-dialog-description"
  >
    <DialogTitle id="delete-dialog-title">Delete Task</DialogTitle>
    <DialogContent>
      <DialogContentText id="delete-dialog-description">
        Are you sure you want to delete <strong>{taskName}</strong>? This action
        cannot be undone.
      </DialogContentText>
    </DialogContent>
    <DialogActions sx={{ padding: '16px 24px', gap: '8px' }}>
      <button
        type="button"
        className="ghost-button"
        onClick={onCancel}
        disabled={isLoading}
        data-testid="delete-dialog-cancel"
      >
        Cancel
      </button>
      <button
        type="button"
        className="primary-button primary-button--danger"
        onClick={onConfirm}
        disabled={isLoading}
        data-testid="delete-dialog-confirm"
        aria-busy={isLoading}
      >
        {isLoading ? 'Deleting…' : 'Delete'}
      </button>
    </DialogActions>
  </Dialog>
);

export default DeleteConfirmDialog;
