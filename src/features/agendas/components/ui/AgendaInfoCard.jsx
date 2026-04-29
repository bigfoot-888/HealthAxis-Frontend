import React from 'react';
import { Card, CardContent, Stack, Typography, Divider, Box, Button, Avatar, Grid } from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import EventNoteIcon from '@mui/icons-material/EventNote';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DateRangeIcon from '@mui/icons-material/DateRange';
import { DataItem, PrimaryInfoCard } from '@/components/ui';
import { AgendaStatusChip, AgendaPeriodStatusChip } from '@agendas/components/ui/AgendaChips';

export default function AgendaInfoCard({ agenda, onEdit, onCreatePeriod }) {
    if (!agenda) return null;
    const activePeriod = agenda.activePeriod;
    return (
        <PrimaryInfoCard>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    justifyContent='space-between'
                    alignItems={{ xs: 'flex-start', md: 'flex-start' }}
                    spacing={3}
                >
                    <Box display='flex' gap={2} alignItems='flex-start' flex={1}>
                        <Avatar
                            sx={{
                                width: 56,
                                height: 56,
                                flexShrink: 0,
                                bgcolor: 'primary.container',
                                color: 'primary.onContainer',
                            }}
                        >
                            <EventNoteIcon sx={{ fontSize: '1.75rem' }} />
                        </Avatar>

                        <Box>
                            <Typography variant='h5' sx={{ fontWeight: 600, color: 'onSurface', mb: 0.5 }}>
                                {agenda.name}
                            </Typography>

                            {activePeriod ? (
                                <Stack direction='row' spacing={1} alignItems='center' sx={{ mt: 1 }}>
                                    <DateRangeIcon sx={{ fontSize: 16, color: 'onSurfaceVariant' }} />
                                    <Typography variant='body2' sx={{ color: 'onSurfaceVariant', fontWeight: 500 }}>
                                        Periodo actual:
                                    </Typography>
                                    <AgendaPeriodStatusChip value={agenda.activePeriod.agendaStatus} />
                                </Stack>
                            ) : (
                                <Typography variant='body2' sx={{ color: 'onSurfaceVariant', mt: 1 }}>
                                    No hay ningún periodo activo
                                </Typography>
                            )}
                        </Box>
                    </Box>

                    <Stack
                        direction={{ xs: 'column', md: 'row' }}
                        spacing={3}
                        alignItems={{ xs: 'flex-start', md: 'center' }}
                        sx={{ flexShrink: 0 }}
                    >
                        {/* Estado */}
                        <Stack spacing={0.5} alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
                            <Typography
                                variant='caption'
                                sx={{
                                    color: 'onSurfaceVariant',
                                    textTransform: 'uppercase',
                                    letterSpacing: 0.5,
                                    fontWeight: 600,
                                }}
                            >
                                Estado
                            </Typography>
                            <AgendaStatusChip value={agenda.status} />
                        </Stack>

                        <Stack
                            direction='row'
                            spacing={1.5}
                            sx={{
                                mt: { xs: 1, md: 2.5 },
                            }}
                        >
                            <Button
                                variant='outlined'
                                color='primary'
                                startIcon={<EditCalendarIcon />}
                                disabled={agenda.status === 'INACTIVE'}
                                onClick={() => onCreatePeriod?.(agenda)}
                                sx={{ borderRadius: 2 }}
                            >
                                Nuevo periodo
                            </Button>

                            <Button
                                variant='outlined'
                                color='primary'
                                startIcon={<EditIcon />}
                                disabled={agenda.status === 'INACTIVE'}
                                onClick={() => onEdit?.(agenda)}
                                sx={{ borderRadius: 2 }}
                            >
                                Editar
                            </Button>
                        </Stack>
                    </Stack>
                </Stack>

                {activePeriod && (
                    <>
                        <Divider sx={{ my: 3, borderColor: 'outlineVariant' }} />

                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                <DataItem
                                    label='Inicio del periodo'
                                    value={activePeriod.openingDate}
                                    icon={CalendarTodayIcon}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                <DataItem
                                    label='Fin del periodo'
                                    value={activePeriod.closingDate}
                                    icon={CalendarTodayIcon}
                                />
                            </Grid>
                        </Grid>
                    </>
                )}
            </CardContent>
        </PrimaryInfoCard>
    );
}
