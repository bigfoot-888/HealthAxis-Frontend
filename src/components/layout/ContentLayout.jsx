import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import DrawerHeader from '../layout/DrawerHeader';
import { Alert } from '@mui/material';

export default function ContentLayout({
    children,
    error=null,
    onErrorClose = ()=>{},
}) {
    return (
        <Stack sx={{ width: '100%' }}>
            <DrawerHeader />
            {error && (
                <Alert severity='error' onClose={onErrorClose} sx={{ margin: 2 }}>
                    {error}
                </Alert>
            )}
            <Box sx={{ width: '95%', marginY: 'auto', marginX: 'auto' }}>
                {children}
            </Box>
        </Stack>
    );
}
