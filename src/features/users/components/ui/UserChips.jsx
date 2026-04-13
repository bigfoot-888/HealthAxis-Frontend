import {
    USER_STATUS_COLORS,
    USER_STATUS_LABELS
} from '@users/user-constants.js';
import { Chip } from '@mui/material';

export function UserStatusChip({ value }) {
    return (
        <Chip
            label={USER_STATUS_LABELS[value] || value}
            color={USER_STATUS_COLORS[value] || 'default'}
            size='small'
        />
    );
}