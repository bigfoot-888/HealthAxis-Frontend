import { Card, CardContent, Grid, Stack, Typography, Avatar, Chip, Divider, Box, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

import { ROLE_LABELS } from '@/config/roles';
import { UserStatusChip } from '@users/components/ui/UserChips';
import { Link } from 'react-router';

export default function UserInfoCard({ user }) {
    const initials = `${user.name?.[0] ?? ''}${user.surname?.[0] ?? ''}`.toUpperCase();

    return (
        <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Grid container spacing={3} alignItems='flex-start'>
                    <Grid>
                        <Avatar
                            sx={{
                                width: 80,
                                height: 80,
                                fontSize: '2rem',
                                bgcolor: 'grey.300',
                                color: 'grey.800',
                            }}
                        >
                            {initials}
                        </Avatar>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 'grow' }}>
                        <Stack direction='row' spacing={2} alignItems='center' mb={1} flexWrap='wrap'>
                            <Typography variant='h4' sx={{ fontWeight: 600 }}>
                                {user.surname}, {user.name}
                            </Typography>

                            <UserStatusChip value={user.status} />
                        </Stack>

                        <Stack direction='row' spacing={3} mb={2} flexWrap='wrap'>
                            <Typography variant='body1'>
                                <Box component='span' sx={{ fontWeight: 600, color: 'text.secondary' }}>
                                    ID:{' '}
                                </Box>
                                {user.id}
                            </Typography>
                        </Stack>

                        <Divider sx={{ my: 1.5 }} />

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <Typography variant='body2'>
                                    <Box component='span' sx={{ fontWeight: 600, color: 'text.secondary' }}>
                                        Cargos:{' '}
                                    </Box>
                                    {user.roles?.map((r) => ROLE_LABELS[r.name]).join(', ') || '-'}
                                </Typography>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <Typography variant='body2'>
                                    <Box component='span' sx={{ fontWeight: 600, color: 'text.secondary' }}>
                                        Email:{' '}
                                    </Box>
                                    {user.email}
                                </Typography>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <Typography variant='body2'>
                                    <Box component='span' sx={{ fontWeight: 600, color: 'text.secondary' }}>
                                        Teléfono:{' '}
                                    </Box>
                                    {user.phone}
                                </Typography>
                            </Grid>

                            {/* Agenda (temporal mientras sea 1:1) */}
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <Typography variant='body2'>
                                    <Box component='span' sx={{ fontWeight: 600, color: 'text.secondary' }}>
                                        Agenda:{' '}
                                    </Box>
                                    {user.agenda?.name ?? '-'}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid size={{ xs: 12, md: 'auto' }}>
                        <Stack direction={{ xs: 'column', sm: 'row', md: 'column' }} spacing={1.5}>
                            <Button
                                variant='text'
                                startIcon={<EditIcon />}
                                component={Link}
                                to={`/users/edit/${user.uuid}`}
                                state={{ from: `/users/${user.uuid}` }}
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
