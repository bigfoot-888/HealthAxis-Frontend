import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { ErrorAlert } from '@/components/ui/index';

export default function AlertDialog({ open, handleClose, handleConfirm, title, content, error, onErrorClose }) {
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
        >
            <DialogTitle id='alert-dialog-title'>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id='alert-dialog-description'>{content}</DialogContentText>
                {error && <ErrorAlert error={error} onClose={onErrorClose}/>}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancelar</Button>
                <Button onClick={handleConfirm} autoFocus>
                    Aceptar
                </Button>
            </DialogActions>
        </Dialog>
    );
}
