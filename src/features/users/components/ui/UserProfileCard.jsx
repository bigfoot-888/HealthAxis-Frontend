import { Card, CardContent, Grid, Stack, Typography, Avatar, Divider, Box, Button } from '@mui/material';

import { useState } from 'react';

import EditIcon from '@mui/icons-material/Edit';
import LockIcon from '@mui/icons-material/Lock';

import { ROLE_LABELS } from '@/config/roles';
import { UserStatusChip } from '@users/components/ui/UserChips';
import { Link } from 'react-router';

import EditUserPasswordForm from '@users/components/forms/EditUserPasswordForm';

export default function UserProfileCard({ user }) {
    const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
    const initials = `${user.name?.[0] ?? ''}${user.surname?.[0] ?? ''}`.toUpperCase();

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                mt: 4,
            }}
        >
            {openPasswordDialog && (
                <EditUserPasswordForm
                    open={openPasswordDialog}
                    onClose={() => setOpenPasswordDialog(false)}
                    user={user}
                />
            )}
            <Card
                elevation={0}
                sx={{
                    width: '100%',
                    maxWidth: 720,
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                }}
            >
                <CardContent sx={{ p: 4 }}>
                    <Stack spacing={3} alignItems='center'>
                        <Avatar
                            sx={{
                                width: 96,
                                height: 96,
                                fontSize: '2.5rem',
                                bgcolor: 'grey.300',
                                color: 'grey.800',
                            }}
                        >
                            {initials}
                        </Avatar>

                        <Stack spacing={1} alignItems='center'>
                            <Typography variant='h4' sx={{ fontWeight: 600 }}>
                                {user.surname}, {user.name}
                            </Typography>

                            <UserStatusChip value={user.status} />
                        </Stack>

                        <Divider sx={{ width: '100%' }} />

                        <Grid container spacing={2}>
                            <Grid size={12}>
                                <Typography variant='body2'>
                                    <Box component='span' sx={{ fontWeight: 600, color: 'text.secondary' }}>
                                        ID:{' '}
                                    </Box>
                                    {user.id}
                                </Typography>
                            </Grid>

                            <Grid size={12}>
                                <Typography variant='body2'>
                                    <Box component='span' sx={{ fontWeight: 600, color: 'text.secondary' }}>
                                        Email:{' '}
                                    </Box>
                                    {user.email}
                                </Typography>
                            </Grid>

                            <Grid size={12}>
                                <Typography variant='body2'>
                                    <Box component='span' sx={{ fontWeight: 600, color: 'text.secondary' }}>
                                        Teléfono:{' '}
                                    </Box>
                                    {user.phone}
                                </Typography>
                            </Grid>

                            <Grid size={12}>
                                <Typography variant='body2'>
                                    <Box component='span' sx={{ fontWeight: 600, color: 'text.secondary' }}>
                                        Cargos:{' '}
                                    </Box>
                                    {user.roles?.map((r) => ROLE_LABELS[r.name]).join(', ') || '-'}
                                </Typography>
                            </Grid>

                            <Grid size={12}>
                                <Typography variant='body2'>
                                    <Box component='span' sx={{ fontWeight: 600, color: 'text.secondary' }}>
                                        Agenda:{' '}
                                    </Box>
                                    {user.agenda?.name ?? '-'}
                                </Typography>
                            </Grid>
                        </Grid>

                        <Divider sx={{ width: '100%' }} />

                        <Stack direction='row' spacing={2}>
                            <Button
                                variant='outlined'
                                startIcon={<EditIcon />}
                                component={Link}
                                to={`/users/edit/${user.uuid}`}
                                state={{ from: `/users/${user.uuid}` }}
                            >
                                Editar
                            </Button>

                            <Button
                                variant='outlined'
                                startIcon={<LockIcon />}
                                onClick={() => setOpenPasswordDialog(true)}
                            >
                                Cambiar contraseña
                            </Button>
                        </Stack>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
}
