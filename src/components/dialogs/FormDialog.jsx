import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Alert } from '@mui/material';
import { ErrorAlert } from '@/components/ui/index';
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
        <>
            {open && (
                <Dialog open={open} onClose={handleClose} fullWidth>
                    <ErrorAlert error={error} onClose={onErrorClose} />
                    <form onSubmit={handleSubmit}>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogContent>{children}</DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>Cancelar</Button>
                            <Button type='submit'>Aceptar</Button>
                        </DialogActions>
                    </form>
                </Dialog>
            )}
        </>
    );
}
