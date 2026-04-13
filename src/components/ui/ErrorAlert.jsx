import { Alert } from '@mui/material';
export default function ErrorAlert({ error, onClose = () => {} }) {
    return (
        <>
            {error && (
                <Alert
                    severity='error'
                    onClose={onClose}
                    sx={{
                        my: 2,
                        width: '100%',
                        '& .MuiAlert-message': {
                            width: '100%',
                        },
                        wordBreak: 'break-word',
                    }}
                >
                    {error}
                </Alert>
            )}
        </>
    );
}
