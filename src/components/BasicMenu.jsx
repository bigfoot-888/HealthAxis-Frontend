import { useState } from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';

export default function BasicMenu({ id = 'basic-menu', label, icon, items = [] }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleItemClick = (callback) => {
        callback?.();
        handleClose();
    };

    return (
        <div>
            {/* Trigger */}
            {icon ? (
                <Tooltip title={label || 'Menu'}>
                    <IconButton
                        id={`${id}-button`}
                        aria-controls={open ? id : undefined}
                        aria-haspopup='true'
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                    >
                        {icon}
                    </IconButton>
                </Tooltip>
            ) : (
                <Button
                    id={`${id}-button`}
                    aria-controls={open ? id : undefined}
                    aria-haspopup='true'
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                >
                    {label}
                </Button>
            )}

            {/* Menu */}
            <Menu
                id={id}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                slotProps={{
                    list: {
                        'aria-labelledby': `${id}-button`,
                    },
                }}
            >
                {items.map((item, index) => (
                    <MenuItem key={index} onClick={() => handleItemClick(item.onClick)} disabled={item.disabled}>
                        {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
                        {item.label}
                    </MenuItem>
                ))}
            </Menu>
        </div>
    );
}
