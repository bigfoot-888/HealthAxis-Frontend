import { Box, Button, TextField } from '@mui/material';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { Link } from 'react-router';
import { SearchBar } from '@/components/ui';

export default function AppointmentsTableToolbar({ searchText, setSearchText }) {
    return (
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <SearchBar value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="Busca por motivo, paciente, usuario, estado, fecha" />

            <Button
                variant="contained"
                component={Link}
                to="/appointments/new"
                state={{ from: `/appointments` }}
                startIcon={<PersonAddAltIcon />}
            >
                Añadir cita
            </Button>
        </Box>
    );
}