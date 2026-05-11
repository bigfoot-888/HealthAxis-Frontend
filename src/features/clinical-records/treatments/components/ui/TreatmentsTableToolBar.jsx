import { Box, Button, TextField } from '@mui/material';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { Link } from 'react-router';
import { SearchBar } from '@/components/ui';

export default function TreatmentsTableToolbar({ searchText, setSearchText }) {
    return (
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <SearchBar value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="Busca por nombre, paciente, usuarios, estado" />

            <Button
                variant="contained"
                component={Link}
                to="/clinical-records/treatments/new"
                state={{ from: `/clinical-records/treatments` }}
                startIcon={<PersonAddAltIcon />}
            >
                Añadir tratamiento
            </Button>
        </Box>
    );
}