import { Chip } from '@mui/material';

export default function SubtleChip({ label = "Desconocido", color = 'default', ...props }) {
    return (
        <Chip
            label={label}
            size='small'
            variant='outlined'
            color={color}
            sx={{
                fontWeight: 500,
                opacity: 0.9,
            }}
            {...props}
        />
    );
}
