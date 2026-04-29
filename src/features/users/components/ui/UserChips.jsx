import { USER_STATUS_CONFIG } from '@/shared/constants/user.constants';
import { Chip } from '@mui/material';

export function UserStatusChip({ value }) {
    return (
        <Chip
            label={USER_STATUS_CONFIG[value].label || value}
            color={USER_STATUS_CONFIG[value].color || 'default'}
            size='small'
        />
    );
}