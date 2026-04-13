import React from 'react';
import { Card, CardContent, Typography, Grid, Avatar, Chip, Stack } from '@mui/material';
import { Link } from 'react-router';

export default function UserSummaryCard({ user }) {
    if (!user) return null;
    const name = user.name?.trim() || '';
    const surname = user.surname?.trim() || '';
    const initials = `${name.charAt(0)}${surname.charAt(0)}`.toUpperCase();

    return (
        <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ p: 2 }}>
                <Grid container spacing={2} alignItems='center'>
                    {/* Avatar */}
                    <Grid>
                        <Avatar
                            sx={{
                                width: 56,
                                height: 56,
                                fontSize: '1.25rem',
                                bgcolor: 'grey.300',
                                color: 'grey.800',
                            }}
                        >
                            {initials}
                        </Avatar>
                    </Grid>

                    {/* Main info */}
                    <Grid size={{ xs: 12, sm: 'grow' }}>
                        <Stack spacing={0.5}>
                            {/* Name + status (aligned with PatientSummaryCard) */}
                            <Stack direction='row' spacing={1} alignItems='center' flexWrap='wrap'>
                                <Typography
                                    variant='subtitle1'
                                    sx={{ fontWeight: 600 }}
                                    component={Link}
                                    to={`/users/${user.uuid}`}
                                    style={{ textDecoration: 'none', color: 'inherit' }}
                                >
                                    {surname}, {name}
                                </Typography>

                                {user.status && (
                                    <Chip
                                        label={user.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
                                        size='small'
                                        color={user.status === 'ACTIVE' ? 'success' : 'default'}
                                        variant='outlined'
                                    />
                                )}
                            </Stack>

                            {/* Role */}
                            <Typography variant='body2' color='text.secondary'>
                                {user.email || '—'}
                            </Typography>
                            <Typography variant='body2' color='text.secondary'>
                                {user.phone || '—'}
                            </Typography>
                        </Stack>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}
