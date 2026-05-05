import { useParams } from 'react-router';
import { CustomCircularProgress } from '@/components/feedback';
import { ContentLayout } from '@/components/layout';
import { AppBreadcrumbs } from '@/components/navigation';
import EditTreatmentForm from '@/features/clinical-records/treatments/components/forms/EditTreatmentForm';
import { useTreatment } from '@/features/clinical-records/treatments/hooks/useTreatment';

export default function EditTreatmentPage() {
    const { uuid } = useParams();
    const { data: treatment, isLoading, error, refetch } = useTreatment(uuid);
    if (error) return <p>Error al cargar los datos del tratamiento</p>;
    if (isLoading) return <CustomCircularProgress />;
    return (
        <ContentLayout>
            <AppBreadcrumbs items={[{ label: 'Tratamientos', to: '/clinical-records/treatments' }, { label: 'Editar' }]} />
            <EditTreatmentForm treatment={treatment}/>
        </ContentLayout>
    );
}
