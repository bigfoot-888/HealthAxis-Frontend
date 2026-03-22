import { Alert } from '@mui/material';
export default function ErrorAlert({ error, onErrorClose = () => {} }) {
    return (
        <>
            {error && (
                <Alert severity='error' onClose={onErrorClose} sx={{ margin: 2 }}>
                    {error}
                </Alert>
            )}
        </>
    );
}
