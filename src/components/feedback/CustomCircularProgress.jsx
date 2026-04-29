import { Box, CircularProgress } from '@mui/material';

export default function CustomCircularProgress() {
    return (
        <Box
            sx={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
            }}
        >
            <CircularProgress />
        </Box>
    );
}
