import { AlertDialog } from '@/components/dialogs';
export default function DeleteSecondaryNodeDialog({ handleClose, handleConfirm, open}) {
    return (
        <AlertDialog
            open={open}
            handleClose={handleClose}
            handleConfirm={handleConfirm}
            title={`Eliminar nodo`}
            content='Esta acción es irreversible. Al finalizar, el nodo será eliminado del flujo.'
        />
    );
}
