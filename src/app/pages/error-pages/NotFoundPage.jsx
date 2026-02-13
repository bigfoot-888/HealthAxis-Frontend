import AppShell from '../../../components/layout/AppShell';
import { useRouteError, isRouteErrorResponse } from 'react-router';
import DrawerHeader from '../../../components/layout/DrawerHeader';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export default function NotFoundPage() {
    const error = useRouteError();
    return (
        <AppShell>
            <Stack sx={{ width: '100%', height: '100%' }}>
                <DrawerHeader />
                <Box sx={{marginY: 'auto', marginX: 'auto', pb: 8 }}>
                    {isRouteErrorResponse(error) && error.status === 404 ? (
                        <Typography variant="h1" gutterBottom sx={{textAlign: 'center'}}> 404 - Página no encontrada </Typography>
                    ) : (
                        <Typography variant="h1" gutterBottom sx={{textAlign: 'center'}}> Also salió mal </Typography>
                    )}
                </Box>
            </Stack>
        </AppShell>
    );
}
