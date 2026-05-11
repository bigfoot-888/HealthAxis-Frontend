import { useEffect, useState } from 'react';
import { Tabs, Box, Tab } from '@mui/material';
import { ContentLayout } from '@/components/layout/index';
import { Outlet, useLocation } from 'react-router';
import { Link } from 'react-router';
import { TableTopBar } from '@/components/tables';
import DiagnosesTableToolBar from '@/features/clinical-records/diagnoses/components/ui/DiagnosesTableToolBar';
import TreatmentsTableToolbar from '@/features/clinical-records/treatments/components/ui/TreatmentsTableToolBar';
import ClinicalDocumentsTableToolbar from '@/features/clinical-records/clinical-documents/components/ui/ClinicalDocumentsTableToolBar';

const renderToolbar = (currentTab, searchText, setSearchText) => {
    switch (currentTab) {
        case 'diagnoses':
            return <DiagnosesTableToolBar searchText={searchText} setSearchText={setSearchText} />;
        case 'treatments':
            return <TreatmentsTableToolbar searchText={searchText} setSearchText={setSearchText} />;
        case 'clinical-documents':
            return <ClinicalDocumentsTableToolbar searchText={searchText} setSearchText={setSearchText} />;
        default:
            return null;
    }
};

export default function ClinicalRecordsPage() {
    const [error, setError] = useState(null);
    const location = useLocation();
    const currentTab = location.pathname.split('/').pop();

    const [searchText, setSearchText] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(searchText), 300);
        return () => clearTimeout(t);
    }, [searchText]);

    return (
        <ContentLayout error={error} onErrorClose={() => setError(null)}>
            <TableTopBar
                left={
                    <Tabs
                        value={currentTab}
                        sx={{
                            borderBottom: 1,
                            borderColor: 'divider',
                        }}
                    >
                        <Tab
                            label='Documentos clínicos'
                            value='clinical-documents'
                            component={Link}
                            to='clinical-documents'
                        />
                        <Tab label='Diagnósticos' value='diagnoses' component={Link} to='diagnoses' />
                        <Tab label='Tratamientos' value='treatments' component={Link} to='treatments' />
                    </Tabs>
                }
                right={renderToolbar(currentTab, searchText, setSearchText)}
            />

            <Box
                sx={{
                    mt: 0,
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Outlet context={{ setError, searchText: debouncedSearch }} />
            </Box>
        </ContentLayout>
    );
}
