import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { NavLink } from 'react-router';

export default function CustomListItem({open, text, link, children, handleClick}) {
    return (
        <ListItem
            key={text}
            disablePadding
            sx={{ display: 'block' }}
        >
            <ListItemButton component = {NavLink} to={link} onClick={handleClick}
                sx={[
                    {
                        minHeight: 48,
                        px: 2.5,
                    },
                    open
                        ? { justifyContent: 'initial' }
                        : { justifyContent: 'center' },
                ]}
            >
                <ListItemIcon
                    sx={[
                        {
                            minWidth: 0,
                            justifyContent: 'center',
                        },
                        open ? { mr: 3 } : { mr: 'auto' },
                    ]}
                >
                    {children}
                </ListItemIcon>
                <ListItemText
                    primary={text}
                    sx={[open ? { opacity: 1 } : { opacity: 0 }]}
                />
            </ListItemButton>
        </ListItem>
    );
}
