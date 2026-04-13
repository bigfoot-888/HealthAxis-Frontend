import { usePatientDetail } from '@patients/hooks/usePatientDetail';
import { useParams, Outlet, Link } from 'react-router';
import { useState } from 'react';
import { Tabs, Box, Tab, CircularProgress } from '@mui/material';
import {ContentLayout} from '@/components/layout/index';
import { AppBreadcrumbs } from '@/components/navigation';
import { useLocation } from 'react-router';

export default function PatientDetailManagement() {
    const { uuid } = useParams(); 
    const { data: patient, isLoading, error: fetchError, refetch } = usePatientDetail(uuid);
    const [error, setError] = useState(null); 
    const location = useLocation();
    const currentTab = location.pathname.split('/').pop();
    return (
        <ContentLayout error={error} onErrorClose={()=>setError(null)}>
            {patient && (
                <AppBreadcrumbs
                    items={[
                        { label: 'Pacientes', to: '/patients' },
                        { label: `${patient.name} ${patient.surname}` },
                    ]}
                />
            )}
            <Tabs value={currentTab}>
                <Tab label='Perfil' value='profile' component={Link} to='' />
                <Tab label='Citas' value='appointments' component={Link} to='appointments' />
                <Tab label='Diagnósticos' value='diagnoses' component={Link} to='diagnoses' />
                <Tab label='Tratamientos' value='treatments' component={Link} to='treatments' />
                <Tab label='Evolución' value='patient-flow' component={Link} to='flow'/>
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
