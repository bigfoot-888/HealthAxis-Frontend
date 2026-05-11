import { ContentLayout } from '@/components/layout';
import { AppBreadcrumbs } from '@/components/navigation';
import CreateExternalClinicalDocumentForm from '@/features/clinical-records/clinical-documents/components/forms/CreateExternalClinicalDocument';
export default function CreateClinicalDocumentPage() {
    return (
        <ContentLayout>
            <AppBreadcrumbs
                items={[{ label: 'Documentos', to: '/clinical-records/clinical-documents' }, { label: 'Crear' }]}
            />
            <CreateExternalClinicalDocumentForm />
        </ContentLayout>
    );
}
