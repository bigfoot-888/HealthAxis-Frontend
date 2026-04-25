import { useAppointmentPlain } from '@appointments/hooks/useAppointment';
import EditAppointmentForm from '@appointments/components/forms/EditAppointmentForm';
import { useParams } from 'react-router';
import { CustomCircularProgress } from '@/components/feedback';
import { ContentLayout } from '@/components/layout';
import { AppBreadcrumbs } from '@/components/navigation';

export default function EditAppointmentPage() {
    const { uuid } = useParams();
    const { data: appointment, isLoading, error, refetch } = useAppointmentPlain(uuid);
    if (error) return <p>Error al cargar los datos de la cita</p>;
    if (isLoading) return <CustomCircularProgress />;
    return (
        <ContentLayout>
            <AppBreadcrumbs items={[{ label: 'Citas', to: '/appointments' }, { label: 'Editar' }]} />
            <EditAppointmentForm appointment={appointment} uuid={uuid} />
        </ContentLayout>
    );
}
