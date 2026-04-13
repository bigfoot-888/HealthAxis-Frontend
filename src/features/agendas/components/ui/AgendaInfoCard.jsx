import {
    Card,
    CardContent,
    Grid,
    Stack,
    Typography,
    Chip,
    Divider,
    Box,
    Button,
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import EventNoteIcon from '@mui/icons-material/EventNote';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';

function getStatusConfig(status) {
    switch (status) {
        case 'ACTIVE':
            return { label: 'Activa', color: 'success' };
        case 'INACTIVE':
            return { label: 'Inactiva', color: 'default' };
        default:
            return { label: 'Desconocido', color: 'warning' };
    }
}

function getPeriodStatusConfig(status) {
    switch (status) {
        case 'OPEN':
            return { label: 'Abierto', color: 'success' };
        case 'CLOSED':
            return { label: 'Cerrado', color: 'default' };
        case 'CANCELLED':
            return { label: 'Cancelado', color: 'error' };
        default:
            return { label: 'Desconocido', color: 'warning' };
    }
}

export default function AgendaInfoCard({ agenda, onEdit, onCreatePeriod }) {
    if (!agenda) return null;

    const status = getStatusConfig(agenda.status);
    const activePeriod = agenda.activePeriod;
    const periodStatus = activePeriod ? getPeriodStatusConfig(activePeriod.agendaStatus) : null;

    return (
        <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Grid container spacing={3} alignItems='flex-start'>
                    <Grid>
                        <Box
                            sx={{
                                width: 80,
                                height: 80,
                                borderRadius: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: 'grey.300',
                                color: 'grey.800',
                            }}
                        >
                            <EventNoteIcon sx={{ fontSize: '2rem' }} />
                        </Box>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 'grow' }}>
                        <Stack direction='row' spacing={2} alignItems='center' mb={1} flexWrap='wrap'>
                            <Typography variant='h4' sx={{ fontWeight: 600 }}>
                                {agenda.name}
                            </Typography>

                            <Chip label={status.label} color={status.color} size='small' variant='outlined' />
                        </Stack>

                        {activePeriod ? (
                            <>
                                <Stack direction='row' spacing={2} alignItems='center' mb={2} flexWrap='wrap'>
                                    <Typography variant='body1'>
                                        <Box component='span' sx={{ fontWeight: 600, color: 'text.secondary' }}>
                                            Periodo activo:{' '}
                                        </Box>
                                        {activePeriod.openingDate} — {activePeriod.closingDate}
                                    </Typography>

                                    <Chip
                                        label={periodStatus.label}
                                        color={periodStatus.color}
                                        size='small'
                                        variant='outlined'
                                    />
                                </Stack>

                                <Divider sx={{ my: 1.5 }} />

                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Typography variant='body2'>
                                            <Box component='span' sx={{ fontWeight: 600, color: 'text.secondary' }}>
                                                Inicio:{' '}
                                            </Box>
                                            {activePeriod.openingDate}
                                        </Typography>
                                    </Grid>

                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Typography variant='body2'>
                                            <Box component='span' sx={{ fontWeight: 600, color: 'text.secondary' }}>
                                                Fin:{' '}
                                            </Box>
                                            {activePeriod.closingDate}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </>
                        ) : (
                            <Typography variant='body2' color='text.secondary'>
                                No hay periodo activo
                            </Typography>
                        )}
                    </Grid>

                    <Grid size={{ xs: 12, md: 'auto' }}>
                        <Stack direction={{ xs: 'column', sm: 'row', md: 'column' }} spacing={1.5}>
                            <Button
                                variant='contained'
                                startIcon={<EditCalendarIcon />}
                                disabled={agenda.status === 'INACTIVE'}
                                onClick={() => onCreatePeriod?.(agenda)}
                            >
                                Nuevo periodo
                            </Button>

                            <Button
                                variant='text'
                                startIcon={<EditIcon />}
                                disabled={agenda.status === 'INACTIVE'}
                                onClick={() => onEdit?.(agenda)}
                            >
                                Editar
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}