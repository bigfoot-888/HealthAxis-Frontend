import { Box } from '@mui/material';
export default function BasicNodeContainer({ children, color }) {
    return (
        <Box
            sx={{
                border: '2px solid',
                borderColor: `${color}.main`,
                borderRadius: '8px',
                padding: '1rem',
                backgroundColor: `${color}.container`,
                color: `${color}.onContainer`,
                boxShadow: (theme) => theme.palette.baseShadow,
            }}
        >
            {children}
        </Box>
    );
}
