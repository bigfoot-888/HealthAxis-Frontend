import { ContentLayout } from '@/components/layout';
import { AppBreadcrumbs } from '@/components/navigation';
import CreatePatientForm from '@patients/components/forms/CreatePatientForm';
export default function CreatePatientPage() {
    return (
        <ContentLayout>
            <AppBreadcrumbs items={[{ label: 'Pacientes', to: '/patients' }, { label: 'Crear' }]} />
            <CreatePatientForm />
        </ContentLayout>
    );
}
