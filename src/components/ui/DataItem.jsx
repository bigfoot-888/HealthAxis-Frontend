import { Stack, Typography } from '@mui/material';

export default function DataItem({ label, value, icon: Icon }) {
    return (
        <Stack spacing={0.5}>
            <Typography
                variant='caption'
                sx={{
                    color: 'onSurfaceVariant',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    fontWeight: 600,
                }}
            >
                {label}
            </Typography>
            <Stack direction='row' spacing={1} alignItems='center'>
                {Icon && <Icon sx={{ fontSize: 16, color: 'onSurfaceVariant' }} />}
                <Typography variant='body2' sx={{ color: 'onSurface', fontWeight: 500 }}>
                    {value || '—'}
                </Typography>
            </Stack>
        </Stack>
    );
}
