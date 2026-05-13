import { Box, Button, Stack } from '@mui/material';

export default function DashboardToolbar({ onSave, onAddWidget, disableAddWidget}) {
    return (
        <Box
            sx={{
                px: 2,
                py: 1,
                borderBottom: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'background.paper',
            }}
        >
            <Stack direction='row' spacing={2}>
                <Button variant='contained' onClick={onSave}>
                    Guardar layout
                </Button>

                <Button variant='outlined' onClick={onAddWidget} disabled={disableAddWidget}>Añadir widget</Button>
            </Stack>
        </Box>
    );
}
