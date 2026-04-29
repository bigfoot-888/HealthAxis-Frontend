import { Divider, Typography } from '@mui/material';
export default function DetailSectionHeader({ label, marginTop = true }) {
    return (
        <Divider
            textAlign='left'
            sx={{
                mt: marginTop ? 2 : 0,
                mb: 2,
                '&::before': {
                    width: '15%', 
                },
                '&::after': {
                    width: '85%', 
                },
                '&::before, &::after': {
                    borderColor: 'outlineVariant',
                },
            }}
        >
            <Typography
                variant='subtitle2'
                sx={{
                    color: 'onSurfaceVariant',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                    px: 2,
                }}
            >
                {label}
            </Typography>
        </Divider>
    );
}
