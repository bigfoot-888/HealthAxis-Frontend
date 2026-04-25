import { Box, Button, TextField } from '@mui/material';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { Link } from 'react-router';
import { SearchBar } from '@/components/ui';

export default function DiagnosesTableToolBar({ searchText, setSearchText }) {
    return (
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <SearchBar value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="Busca por ID, nombre" />

            <Button
                variant="contained"
                component={Link}
                to="/appointments/new"
                startIcon={<PersonAddAltIcon />}
            >
                Añadir cita
            </Button>
        </Box>
    );
}