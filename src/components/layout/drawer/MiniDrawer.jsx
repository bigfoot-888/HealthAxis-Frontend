import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import FullLogo from '../../ui/FullLogo';

import DrawerMainOptions from './DrawerMainOptions'; 
import DrawerSecondaryOptions from './DrawerSecondaryOptions'; 

const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    variants: [
        {
            props: ({ open }) => open,
            style: {
                ...openedMixin(theme),
                '& .MuiDrawer-paper': openedMixin(theme),
            },
        },
        {
            props: ({ open }) => !open,
            style: {
                ...closedMixin(theme),
                '& .MuiDrawer-paper': closedMixin(theme),
            },
        },
    ],
}));

export default function MiniDrawer({ open, setOpen, setClose }) {
    const theme = useTheme();

    return (
        <Box sx={{ display: 'flex'}}>
            <Drawer variant='permanent' open={open}>
                <DrawerHeader>
                    <Box
                        sx={[
                            { mr: 'auto', ml: 'auto' },
                            !open && { display: 'none' },
                        ]}
                    >
                        <FullLogo />
                    </Box>
                    <IconButton
                        onClick={setClose}
                        sx={!open && { display: 'none' }}
                    >
                        {theme.direction === 'rtl' ? (
                            <ChevronRightIcon />
                        ) : (
                            <ChevronLeftIcon />
                        )}
                    </IconButton>

                    <IconButton
                        color='inherit'
                        aria-label='open drawer'
                        onClick={setOpen}
                        edge='start'
                        sx={[
                            {
                                mr: 'auto',
                                ml: 'auto',
                            },
                            open && { display: 'none' },
                        ]}
                    >
                        <MenuIcon />
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <DrawerMainOptions open={open}/>
                <Divider />
                <DrawerSecondaryOptions open={open}/>
            </Drawer>
        </Box>
    );
}
