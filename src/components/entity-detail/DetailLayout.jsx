import { Stack, Box } from '@mui/material';
export default function DetailLayout({ children }) {
    return (
        <Stack sx={{ p: 1, width: '100%' }} spacing={3}>
            {children}
        </Stack>
    );
}
