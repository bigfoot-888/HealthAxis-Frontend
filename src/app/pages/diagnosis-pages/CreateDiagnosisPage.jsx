import { ContentLayout } from '@/components/layout';
import { AppBreadcrumbs } from '@/components/navigation';
import CreateDiagnosisForm from '@/features/clinical-records/diagnoses/components/forms/CreateDiagnosisForm';
export default function CreateDiagnosisPage() {
    return (
        <ContentLayout>
            <AppBreadcrumbs
                items={[{ label: 'Diagnósticos', to: '/clinical-records/diagnoses' }, { label: 'Crear' }]}
            />
            <CreateDiagnosisForm />
        </ContentLayout>
    );
}
