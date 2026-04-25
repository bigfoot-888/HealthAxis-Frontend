import { Box } from '@mui/material';

export default function TableTopBar({ left, right }) {
    return (
        <Box
            sx={{
                minHeight: 48,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2,
                mb: 2,
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>{left}</Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>{right}</Box>
        </Box>
    );
}
