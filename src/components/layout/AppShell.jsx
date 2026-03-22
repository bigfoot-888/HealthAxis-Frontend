import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import MiniDrawer from './drawer/MiniDrawer';
import Header from './Header';
export default function AppShell({ children }) {
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleDrawerOpen = () => {
        setDrawerOpen(true);
    };

    const handleDrawerClose = () => {
        setDrawerOpen(false);
    };
    return (
        <Box sx={{ display: 'flex', height: '100vh' }}>
            <MiniDrawer
                open={drawerOpen}
                setOpen={handleDrawerOpen}
                setClose={handleDrawerClose}
            />
            <Stack sx={{ width: '100%', height: '100%' }}>
                <Header open={drawerOpen} />

                {/* Main content of the site, dynamically added */}
                <Box
                    component='main'
                    sx={{
                        flexGrow: 1,
                        p: 3,
                        width: '100%',
                        overflow: 'scroll',
                    }}
                >
                    {children}
                </Box>
            </Stack>
        </Box>
    );
}
