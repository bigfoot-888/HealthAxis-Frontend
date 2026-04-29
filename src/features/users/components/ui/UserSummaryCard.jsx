import React from 'react';
import { Card, CardContent, Typography, Avatar, Stack, Box } from '@mui/material';
import { Link } from 'react-router';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import { translate } from '@/utils/translation.utils';

import { SubtleChip } from '@/components/ui';
import { USER_STATUS_CONFIG } from '@/shared/constants/user.constants';

export default function UserSummaryCard({ user }) {
    if (!user) return null;

    const name = user.name?.trim() || '';
    const surname = user.surname?.trim() || '';
    const initials = `${name.charAt(0)}${surname.charAt(0)}`.toUpperCase();

    const assignmentRole = user.assignment?.role;

    return (
        <Card
            elevation={0}
            sx={{
                borderRadius: 0,
                border: '1px solid',
                borderColor: 'outlineVariant',
                bgcolor: 'surfaceContainerLowest',
            }}
        >
            <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent='space-between'
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                    spacing={2}
                >
                    <Box display='flex' gap={2} alignItems='center' flex={1}>
                        <Avatar
                            sx={{
                                width: 56,
                                height: 56,
                                fontSize: '1.25rem',
                                fontWeight: 600,
                                bgcolor: 'primary.container',
                                color: 'primary.onContainer',
                            }}
                        >
                            {initials}
                        </Avatar>

                        <Stack spacing={0.5}>
                            <Typography
                                variant='subtitle1'
                                component={Link}
                                to={`/users/${user.uuid}`}
                                sx={{
                                    fontWeight: 600,
                                    color: 'onSurface',
                                    textDecoration: 'none',
                                    transition: 'color 0.2s',
                                    '&:hover': {
                                        color: 'primary.main',
                                        textDecoration: 'underline',
                                    },
                                }}
                            >
                                {surname}, {name}
                            </Typography>

                            {assignmentRole && (
                                <Stack direction='row' spacing={0.5} alignItems='center'>
                                    <AssignmentIndIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                                    <Typography
                                        variant='body2'
                                        sx={{
                                            color: 'primary.main',
                                            fontWeight: 600,
                                            textTransform: 'capitalize',
                                        }}
                                    >
                                        {translate(assignmentRole)}
                                    </Typography>
                                </Stack>
                            )}

                            <Stack direction='row' spacing={2} flexWrap='wrap' useFlexGap>
                                <Stack direction='row' spacing={0.5} alignItems='center'>
                                    <EmailIcon sx={{ fontSize: 16, color: 'onSurfaceVariant' }} />
                                    <Typography variant='body2' sx={{ color: 'onSurfaceVariant' }}>
                                        {user.email || '—'}
                                    </Typography>
                                </Stack>

                                <Stack direction='row' spacing={0.5} alignItems='center'>
                                    <PhoneIcon sx={{ fontSize: 16, color: 'onSurfaceVariant' }} />
                                    <Typography variant='body2' sx={{ color: 'onSurfaceVariant' }}>
                                        {user.phone || '—'}
                                    </Typography>
                                </Stack>
                            </Stack>
                        </Stack>
                    </Box>

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
                        <SubtleChip
                            label={USER_STATUS_CONFIG[user.status]?.label || 'Desconocido'}
                            color={USER_STATUS_CONFIG[user.status]?.color || 'default'}
                        />
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
}
