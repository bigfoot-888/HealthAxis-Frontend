import { Box, Typography } from '@mui/material';

export default function Error({ msg }) {
    return (
        <Box
            sx={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
            }}
        >
            <Typography variant='h4' color='error' sx={{ fontWeight: 500 }}>
                {msg}
            </Typography>
        </Box>
    );
}
