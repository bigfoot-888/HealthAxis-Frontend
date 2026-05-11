import { Box, Button, TextField } from '@mui/material';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { Link } from 'react-router';
import { SearchBar } from '@/components/ui';

export default function DiagnosesTableToolBar({ searchText, setSearchText }) {
    return (
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <SearchBar value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="Busca por nombre, paciente, usuarios, estado clínico" />
            <Button
                variant="contained"
                component={Link}
                to="/clinical-records/diagnoses/new"
                state={{ from: `/clinical-records/diagnoses` }}
                startIcon={<PersonAddAltIcon />}
            >
                Añadir diagnóstico
            </Button>
        </Box>
    );
}