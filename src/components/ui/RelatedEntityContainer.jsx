import { Stack, Typography } from '@mui/material';

export default function RelatedEntityContainer({ label, children }) {
    return (
        <Stack spacing={1}>
            <Typography
                variant='overline'
                sx={{
                    color: 'onSurfaceVariant',
                    fontWeight: 600,
                    letterSpacing: 1,
                    lineHeight: 1,
                    ml: 1,
                }}
            >
                {label}
            </Typography>
            {children}
        </Stack>
    );
}
