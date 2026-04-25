import { styled } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MuiAppBar from '@mui/material/AppBar';
import { useTheme } from '@mui/material/styles';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Link, useMatches, useNavigate } from 'react-router';

const drawerWidth = 240;

const StyledAppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    variants: [
        {
            props: ({ open }) => open,
            style: {
                marginLeft: drawerWidth,
                width: `calc(100% - ${drawerWidth}px)`,
                transition: theme.transitions.create(['width', 'margin'], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.enteringScreen,
                }),
            },
        },
    ],
}));

export default function AppBar({ open, title }) {
    const matches = useMatches();
    const navigate = useNavigate(); 
    const currentRoute = [...matches].reverse().find(
        match => match.handle?.title
    );

    const pageName = currentRoute?.handle?.title ?? '';
    const theme = useTheme();
    const miniWidthXs = `calc(${theme.spacing(7)} + 1px)`; // collapsed drawer width
    const miniWidthSm = `calc(${theme.spacing(8)} + 1px)`; // collapsed drawer width at sm and above
    return (
        <StyledAppBar
            position='fixed'
            open={open}
            sx={{
                width: {
                    xs: open
                        ? `calc(100% - ${drawerWidth}px)`
                        : `calc(100% - ${miniWidthXs})`,
                    sm: open
                        ? `calc(100% - ${drawerWidth}px)`
                        : `calc(100% - ${miniWidthSm})`,
                },
                ml: {
                    xs: open ? `${drawerWidth}px` : miniWidthXs,
                    sm: open ? `${drawerWidth}px` : miniWidthSm,
                },
            }}
        >
            <Toolbar>
                <Typography variant='h6' component="h1" noWrap sx={{ flexGrow: 1 }}>
                    {pageName}
                </Typography>
                <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                    {/* <IconButton
                        size='large'
                        aria-label='show 4 new mails'
                        color='inherit'
                    >
                        <Badge badgeContent={4} color='error'>
                            <MailIcon />
                        </Badge>
                    </IconButton>
                    <IconButton
                        size='large'
                        aria-label='show 17 new notifications'
                        color='inherit'
                    >
                        <Badge badgeContent={17} color='error'>
                            <NotificationsIcon />
                        </Badge>
                    </IconButton> */}
                    <IconButton
                        size='large'
                        edge='end'
                        aria-label='account of current user'
                        aria-haspopup='true'
                        color='inherit'
                        component={Link}
                        to="/profile"
                    >
                        <AccountCircle />
                    </IconButton>
                </Box>
            </Toolbar>
        </StyledAppBar>
    );
}
