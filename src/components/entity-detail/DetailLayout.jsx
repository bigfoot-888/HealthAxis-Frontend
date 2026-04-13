import { Stack, Box } from '@mui/material';
import DrawerHeader from '@/components/layout/drawer/DrawerHeader';
export default function DetailLayout({children}) {
    return (
        <Stack sx={{ flexDirection: 'column', height: '100%', mb: 8 }}>
            <Box
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'start',
                    width: '100%'
                }}
            >
                {children}
            </Box>
        </Stack>
    );
}
