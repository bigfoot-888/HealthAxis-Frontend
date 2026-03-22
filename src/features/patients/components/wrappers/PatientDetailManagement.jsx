import { usePatientDetail } from '@patients/hooks/usePatientDetail';
import { useParams, Outlet, Link } from 'react-router';
import { useState } from 'react';
import { Tabs, Box, Tab, CircularProgress } from '@mui/material';
import {ContentLayout} from '@/components/layout/index';

export default function PatientDetailManagement() {
    const { uuid } = useParams(); 
    const { data: patient, isLoading, error: fetchError, refetch } = usePatientDetail(uuid);
    const [viewMode, setViewMode] = useState('profile'); 
    const [error, setError] = useState(null); 
    return (
        <ContentLayout error={error} onErrorClose={()=>setError(null)}>
            <Tabs value={viewMode} onChange={(e, value) => setViewMode(value)} sx={{ mb: 2 }}>
                <Tab label='Perfil' value='profile' component={Link} to='profile' />
                <Tab label='Citas' value='appointments' component={Link} to='appointments' />
                <Tab label='Diagnósticos' value='diagnoses' component={Link} to='diagnoses' />
                <Tab label='Tratamientos' value='treatments' component={Link} to='treatments' />
            </Tabs>

            <Box sx={{ mt: 2 }}>
                {
                    isLoading && <CircularProgress/>
                }
                {
                    patient && <Outlet context={{setError, patient, uuid: patient.uuid}}/>
                }
            </Box>
        </ContentLayout>
    );
}
