
import DrawerHeader from '../../../components/layout/DrawerHeader';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';

import Box from '@mui/material/Box';

import { Link, useNavigate } from 'react-router';

import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

export default function ProfileCard({user}) {

    const navigate = useNavigate();
    return (
        <Stack sx={{ flexDirection: 'column', height: '100%', mb: 8 }}>
            <DrawerHeader />
            <Box
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Paper
                    variant='surface-form-outlined'
                    sx={{ width: '480px'}}
                >
                    <Typography variant="h2" component="h2" sx={{p: 4}}>
                        Datos Personales
                    </Typography>
                    <Divider/>
                    <Stack sx={{p: 4}}>
                        <Typography variant="body1" gutterBottom>
                            Nombre: {user.name + " " + user.surname} 
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            Correo: {user.email} 
                        </Typography>
                    </Stack>
                </Paper>
            </Box>
        </Stack>
    );
}
