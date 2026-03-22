
import { useNavigate } from 'react-router';

import {Paper, Stack, Typography, Divider} from '@mui/material'

import { ContentLayout } from '@/components/layout';

export default function ProfileCard({ user }) {
    const navigate = useNavigate();
    return (
        <ContentLayout>
            <Paper variant='surface-form-outlined' sx={{ width: '480px' }}>
                <Typography variant='h2' component='h2' sx={{ p: 4 }}>
                    Datos Personales
                </Typography>
                <Divider />
                <Stack sx={{ p: 4 }}>
                    <Typography variant='body1' gutterBottom>
                        Nombre: {user.name + ' ' + user.surname}
                    </Typography>
                    <Typography variant='body1' gutterBottom>
                        Correo: {user.email}
                    </Typography>
                </Stack>
            </Paper>
        </ContentLayout>
    );
}
