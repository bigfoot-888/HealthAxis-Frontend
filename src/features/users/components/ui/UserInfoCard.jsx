import React from 'react';
import { Card, CardContent, Typography, Divider, Box, Grid, Stack, Avatar, Button } from '@mui/material';
import { Link } from 'react-router';

import EditIcon from '@mui/icons-material/Edit';
import { ROLE_LABELS } from '@/config/roles';
import { UserStatusChip } from '@users/components/ui/UserChips';
import { DataItem } from '@/components/ui';
import { PrimaryInfoCard } from '@/components/ui';

export default function UserInfoCard({ user }) {
    if (!user) return null;

    const initials = `${user.name?.[0] ?? ''}${user.surname?.[0] ?? ''}`.toUpperCase();

    return (
        <PrimaryInfoCard>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent='space-between'
                    alignItems={{ xs: 'flex-start', sm: 'flex-start' }}
                    spacing={3}
                >
                    <Box display='flex' gap={2} alignItems='flex-start' flex={1}>
                        <Avatar
                            sx={{
                                width: 56,
                                height: 56,
                                fontSize: '1.25rem',
                                fontWeight: 600,
                                flexShrink: 0,
                                bgcolor: 'primary.container',
                                color: 'primary.onContainer',
                            }}
                        >
                            {initials}
                        </Avatar>

                        <Box>
                            <Typography variant='h5' sx={{ fontWeight: 600, color: 'onSurface', mb: 0.5 }}>
                                {user.surname}, {user.name}
                            </Typography>

                            <Typography variant='body2' sx={{ color: 'onSurfaceVariant' }}>
                                ID: {user.id}
                            </Typography>
                        </Box>
                    </Box>

                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={3}
                        alignItems={{ xs: 'flex-start', sm: 'center' }}
                        sx={{ flexShrink: 0 }}
                    >
                        <Stack spacing={0.5} alignItems={{ xs: 'flex-start', sm: 'flex-end' }}>
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
                            <UserStatusChip value={user.status} />
                        </Stack>

                        <Button
                            variant='outlined'
                            color='primary'
                            startIcon={<EditIcon />}
                            component={Link}
                            to={`/users/edit/${user.uuid}`}
                            state={{ from: `/users/${user.uuid}` }}
                            sx={{
                                mt: { xs: 1, sm: 2.5 },
                                borderRadius: 2,
                            }}
                        >
                            Editar
                        </Button>
                    </Stack>
                </Stack>

                <Divider sx={{ my: 3, borderColor: 'outlineVariant' }} />

                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <DataItem
                            label='Cargos'
                            value={user.roles?.map((r) => ROLE_LABELS[r.name]).join(', ') || '—'}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <DataItem label='Email' value={user.email || '—'} />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <DataItem label='Teléfono' value={user.phone || '—'} />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <DataItem label='Agenda' value={user.agenda?.name || '—'} />
                    </Grid>
                </Grid>
            </CardContent>
        </PrimaryInfoCard>
    );
}
