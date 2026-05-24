import { useAppointmentPlain } from '@appointments/hooks/useAppointment';
import EditAppointmentForm from '@appointments/components/forms/EditAppointmentForm';
import { useParams } from 'react-router';
import { CustomCircularProgress } from '@/components/feedback';
import { ContentLayout } from '@/components/layout';
import { AppBreadcrumbs } from '@/components/navigation';
import Error from '@/components/feedback/Error';

export default function EditAppointmentPage() {
    const { uuid } = useParams();
    const { data: appointment, isLoading, error } = useAppointmentPlain(uuid);
    if (error) return <Error msg="Error al cargar datos de la cita"/>
    if (isLoading) return <CustomCircularProgress />;
    return (
        <ContentLayout>
            <AppBreadcrumbs items={[{ label: 'Citas', to: '/appointments' }, { label: 'Editar' }]} />
            <EditAppointmentForm appointment={appointment} uuid={uuid} />
        </ContentLayout>
    );
}
