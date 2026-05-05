import { useState } from 'react';
import { Tabs, Box, Tab } from '@mui/material';
import { ContentLayout } from '@/components/layout/index';
import { Outlet, useLocation } from 'react-router';
import { Link } from 'react-router';

export default function ClinicalRecordsPage() {
    const [error, setError] = useState(null);
    const location = useLocation();
    const currentTab = location.pathname.split('/').pop();

    return (
        <ContentLayout error={error} onErrorClose={() => setError(null)}>
            <Tabs value={currentTab} sx={{ mb: 2 }}>
                <Tab label='Documentos clínicos' value='clinical-documents' component={Link} to='clinical-documents' />
                <Tab label='Diagnósticos' value='diagnoses' component={Link} to='diagnoses' />
                <Tab label='Tratamientos' value='treatments' component={Link} to='treatments' />
            </Tabs>

            <Box
                sx={{
                    mt: 2,
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Outlet context={{ setError }} />
            </Box>
        </ContentLayout>
    );
}
