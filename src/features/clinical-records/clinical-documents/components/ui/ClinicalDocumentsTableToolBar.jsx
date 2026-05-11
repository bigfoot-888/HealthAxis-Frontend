import { Box, Button, TextField } from '@mui/material';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { Link } from 'react-router';
import { SearchBar } from '@/components/ui';

export default function ClinicalDocumentsTableToolbar({ searchText, setSearchText }) {
    return (
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <SearchBar value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="Busca por ID, nombre, tipo de documento" />

            <Button
                variant="contained"
                component={Link}
                to="/clinical-records/clinical-documents/new"
                state={{ from: `/clinical-records/clinical-documents` }}
                startIcon={<PersonAddAltIcon />}
            >
                Añadir documento
            </Button>
        </Box>
    );
}