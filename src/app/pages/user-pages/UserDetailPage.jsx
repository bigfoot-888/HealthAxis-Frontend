import UserInfoCard from '@users/components/ui/UserInfoCard';
import UserAppointmentsTable from '@appointments/components/views/UserAppointmentsTable';
import { useUser } from '@users/hooks/useUser';
import { useParams } from 'react-router';
import { CustomCircularProgress } from '@/components/feedback';
import { useState } from 'react';
import { ContentLayout } from '@/components/layout';
import { AppBreadcrumbs } from '@/components/navigation';
import { DetailLayout } from '@/components/entity-detail';
import { Stack, Box } from '@mui/material';
import { useAppointmentsByUser } from '@appointments/hooks/useAppointmentsByUser';
import DetailSectionHeader from '@/components/ui/DetailSectionHeader';
import Error from '@/components/feedback/Error';

export default function UserDetailPage() {
    const { uuid } = useParams();
    const { data: user, isLoading: userIsLoading, error: userFetchError } = useUser(uuid);
    const {
        data: appointments,
        isLoading: appointmentsIsLoading,
        error: appointmentsFetchError,
    } = useAppointmentsByUser(uuid);

    const [error, setError] = useState(null);

    if (userFetchError || appointmentsFetchError) return <Error msg='Error al cargar usuario' />;
    if (userIsLoading || appointmentsIsLoading || !user) return <CustomCircularProgress />;
    return (
        <ContentLayout error={error} onErrorClose={() => setError(null)}>
            <DetailLayout>
                <AppBreadcrumbs
                    items={[{ label: 'Usuarios', to: '/users' }, { label: `${user.name} ${user.surname}` }]}
                />
                <Box>
                    <DetailSectionHeader label='Información del Paciente' marginTop={false} />
                    <UserInfoCard user={user} />
                </Box>
                <Box>
                    <DetailSectionHeader label='Citas Asociadas' />
                    <Box sx={{ px: 1 }}>
                        <UserAppointmentsTable user={user} appointments={appointments} />
                    </Box>
                </Box>
            </DetailLayout>
        </ContentLayout>
    );
}
