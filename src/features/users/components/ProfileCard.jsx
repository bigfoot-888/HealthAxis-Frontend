import { useNavigate } from 'react-router';
import { Paper, Stack, Typography, Divider, Box } from '@mui/material';

import { ContentLayout } from '@/components/layout';

export default function ProfileCard({ user }) {
    const navigate = useNavigate();

    return (
        <ContentLayout>
            <Paper
                variant='surface-form-outlined'
                sx={{ width: '480px', borderRadius: 2 }}
            >
                {/* HEADER */}
                <Box sx={{ p: 3 }}>
                    <Typography variant='h2'>
                        Perfil de usuario
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                        Información personal y de contacto
                    </Typography>
                </Box>

                <Divider />

                {/* CONTENT */}
                <Stack spacing={2} sx={{ p: 3 }}>
                    
                    {/* Nombre */}
                    <Box>
                        <Typography variant='caption' color='text.secondary'>
                            Nombre completo
                        </Typography>
                        <Typography variant='body1'>
                            {user.name} {user.surname}
                        </Typography>
                    </Box>

                    {/* Email */}
                    <Box>
                        <Typography variant='caption' color='text.secondary'>
                            Correo electrónico
                        </Typography>
                        <Typography variant='body1'>
                            {user.email}
                        </Typography>
                    </Box>

                    {/* Teléfono (opcional) */}
                    {user.phone && (
                        <Box>
                            <Typography variant='caption' color='text.secondary'>
                                Teléfono
                            </Typography>
                            <Typography variant='body1'>
                                {user.phone}
                            </Typography>
                        </Box>
                    )}
                </Stack>
            </Paper>
        </ContentLayout>
    );
}