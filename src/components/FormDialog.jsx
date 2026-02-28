import { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Alert } from '@mui/material';
export default function FormDialog({
    open,
    handleClose,
    handleSubmit,
    title,
    children,
    error = null,
    onErrorClose = () => {},
}) {
    return (
        <Dialog open={open} onClose={handleClose} fullWidth>
            {error && (
                <Alert severity='error' onClose={onErrorClose} sx={{ margin: 2 }}>
                    {error}
                </Alert>
            )}
            <form onSubmit={handleSubmit}>
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>{children}</DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button type='submit'>Aceptar</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
