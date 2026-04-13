import List from '@mui/material/List';

import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import LogoutIcon from '@mui/icons-material/Logout';

import CustomListItem from './CustomListItem';
import { Navigate, useNavigate } from 'react-router';
import { logout } from '@auth/auth-api';

export default function DrawerSecondaryOptions({open}) {
    const navigate = useNavigate(); 
    const handleLogout = async () => {
        await logout(); 
        navigate("/login"); 
    }
    return (
        <List>
            <CustomListItem text='Ajustes' open={open}>
                <SettingsIcon />
            </CustomListItem>

            <CustomListItem text='Ayuda' open={open}>
                <HelpIcon />
            </CustomListItem>

            <CustomListItem text='Cerrar Sesión' handleClick={handleLogout} open={open}>
                <LogoutIcon />
            </CustomListItem>
        </List>
    );
}
