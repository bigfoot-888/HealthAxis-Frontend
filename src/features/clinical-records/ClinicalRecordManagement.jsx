import { useState } from 'react';
import { Tabs, Box, Tab } from '@mui/material';
import {ContentLayout} from '@/components/layout/index';
import { Outlet } from 'react-router';
import { Link } from 'react-router';

export default function ClinicalRecordManagement() {
    const [viewMode, setViewMode] = useState('clinical-documents'); 
    const [error, setError] = useState(null); 
    return (
        <ContentLayout error={error} onErrorClose={()=>setError(null)}>
            <Tabs value={viewMode} onChange={(e, value) => setViewMode(value)} sx={{ mb: 2 }}>
                <Tab label='Documentos clínicos' value='clinical-documents' component={Link} to='clinical-documents' />
                <Tab label='Diagnósticos' value='diagnoses' component={Link} to='diagnoses' />
                <Tab label='Tratamientos' value='treatments' component={Link} to='treatments' />
            </Tabs>

            <Box sx={{ mt: 2 }}>
                <Outlet context={{setError}}/>
            </Box>
        </ContentLayout>
    );
}
