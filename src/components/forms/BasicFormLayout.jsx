import { Stack, Box } from '@mui/material';
import DrawerHeader from '../layout/drawer/DrawerHeader';
export default function BasicFormLayout({children, drawer = true}) {
    return (
        <Stack sx={{ flexDirection: 'column', height: '100%', mb: 8 }}>
            {drawer && <DrawerHeader />}
            <Box
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                {children}
            </Box>
        </Stack>
    );
}
