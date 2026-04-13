import UserInfoCard from '@users/components/ui/UserInfoCard';
import UserAppointmentsTable from '@appointments/components/views/UserAppointmentsTable';
import { useUser } from '@users/hooks/useUser';
import { useParams } from 'react-router';
import { CustomCircularProgress } from '@/components/feedback';
import { useState } from 'react';
import { ContentLayout } from '@/components/layout';
import { AppBreadcrumbs } from '@/components/navigation';
import { DetailLayout } from '@/components/entity-detail';
import { Stack } from '@mui/material';
import { useAppointmentsByUser } from '@appointments/hooks/useAppointmentsByUser';

export default function UserDetailPage() {
    const { uuid } = useParams();
    const { data: user, isLoading: userIsLoading, error: userFetchError, refetch: refetchUser } = useUser(uuid);
    const {
        data: appointments,
        isLoading: appointmentsIsLoading,
        error: appointmentsFetchError,
        refetch: refetchAppointments,
    } = useAppointmentsByUser(uuid);
    
    const [error, setError] = useState(null);

    if (userFetchError || appointmentsFetchError) return <p>Error al cargar usuario</p>;
    if (userIsLoading || appointmentsIsLoading || !user) return <CustomCircularProgress />;
    return (
        <ContentLayout error={error} onErrorClose={() => setError(null)}>
            <AppBreadcrumbs items={[{ label: 'Usuarios', to: '/users' }, { label: `${user.name} ${user.surname}` }]} />
            <DetailLayout>
                <Stack sx={{ p: { xs: 2, md: 3 }, width: '100%' }} spacing={3}>
                    <UserInfoCard user={user} />
                    <UserAppointmentsTable appointments={appointments} setError={setError} refetch={refetchAppointments} />
                </Stack>
            </DetailLayout>
        </ContentLayout>
    );
}
