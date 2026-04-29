import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import MiniDrawer from './drawer/MiniDrawer';
import Header from './Header';
export default function AppShell({ children }) {
    const [drawerOpen, setDrawerOpen] = useState(true);

    const handleDrawerOpen = () => {
        setDrawerOpen(true);
    };

    const handleDrawerClose = () => {
        setDrawerOpen(false);
    };
    return (
        <Box sx={{ display: 'flex', height: '100vh' }}>
            <MiniDrawer open={drawerOpen} setOpen={handleDrawerOpen} setClose={handleDrawerClose} />
            <Stack
                sx={(theme) => ({
                    flex: 1,
                    backgroundColor: 'var(--template-palette-surfaceContainerLowest)',
                })}
            >
                <Header open={drawerOpen} />

                <Box
                    component='main'
                    sx={(theme) => ({
                        flex: 1,
                        p: 3,
                        width: '100%',
                        overflow: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        backgroundColor: 'var(--template-palette-surfaceContainerLowest)',
                    })}
                >
                    {children}
                </Box>
            </Stack>
        </Box>
    );
}
