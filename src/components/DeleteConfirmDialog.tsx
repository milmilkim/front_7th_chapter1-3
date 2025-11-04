import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

import { Event } from '../types';

interface DeleteConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  event: Event | null;
}

const DeleteConfirmDialog = ({ open, onClose, onConfirm, event }: DeleteConfirmDialogProps) => {
  if (!event) return null;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>일정 삭제</DialogTitle>
      <DialogContent>
        <DialogContentText>
          '{event.title}' 일정을 삭제하시겠습니까?
          <br />
          삭제된 일정은 복구할 수 없습니다.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>취소</Button>
        <Button color="error" variant="contained" onClick={onConfirm}>
          삭제
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmDialog;

