import { ContentLayout } from '@/components/layout';
import CreateAppointmentForm from '@appointments/components/forms/CreateAppointmentForm';
import { AppBreadcrumbs } from '@/components/navigation';
export default function CreateAppointmentPage() {
    return (
        <ContentLayout>
            <AppBreadcrumbs items={[{ label: 'Citas', to: '/appointments' }, { label: 'Crear' }]} />
            <CreateAppointmentForm />
        </ContentLayout>
    );
}
