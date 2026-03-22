import Dialog from '@mui/material/Dialog';
import { ErrorAlert } from '@/components/ui/index';
import BasicHorizontalStepper from '@/components/steppers/BasicHorizontalStepper';
export default function HorizontalStepperDialog({
    open,
    handleClose,
    handleSubmit,
    title,
    steps,
    error = null,
    onErrorClose = () => {},
}) {
    return (
        <Dialog open={open} onClose={handleClose} fullWidth>
            <ErrorAlert error={error} onClose={onErrorClose} />
            <BasicHorizontalStepper
                steps={steps}
                onComplete={handleSubmit}
            />
        </Dialog>
    );
}
