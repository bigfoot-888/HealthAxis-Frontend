import { useParams } from 'react-router';
import { CustomCircularProgress } from '@/components/feedback';
import { ContentLayout } from '@/components/layout';
import { AppBreadcrumbs } from '@/components/navigation';
import EditDiagnosisForm from '@/features/clinical-records/diagnoses/components/forms/EditDiagnosisForm';
import { useDiagnosis } from '@/features/clinical-records/diagnoses/hooks/useDiagnosis';
import Error from '@/components/feedback/Error';

export default function EditDiagnosisPage() {
    const { uuid } = useParams();
    const { data: diagnosis, isLoading, error, refetch } = useDiagnosis(uuid);
    if (error) return <Error msg="Error al cargar los datos del diagnóstico"/>
    if (isLoading) return <CustomCircularProgress />;
    return (
        <ContentLayout>
            <AppBreadcrumbs items={[{ label: 'Diagnósticos', to: '/clinical-records/diagnoses' }, { label: 'Editar' }]} />
            <EditDiagnosisForm diagnosis={diagnosis}/>
        </ContentLayout>
    );
}
