import { ContentLayout } from '@/components/layout';
import { AppBreadcrumbs } from '@/components/navigation';
import CreateTreatmentForm from '@treatments/components/forms/CreateTreatmentForm';
export default function CreateTreatmentPage() {
    return (
        <ContentLayout>
            <AppBreadcrumbs
                items={[{ label: 'Tratamientos', to: '/clinical-records/treatments' }, { label: 'Crear' }]}
            />
            <CreateTreatmentForm />
        </ContentLayout>
    );
}
