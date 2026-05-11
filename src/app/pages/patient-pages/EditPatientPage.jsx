import { CustomCircularProgress } from '@/components/feedback';
import { usePatient } from '@patients/hooks/usePatient';
import EditPatientForm from '@patients/components/forms/EditPatientForm';
import { useParams } from 'react-router';
import { ContentLayout } from '@/components/layout';
import { AppBreadcrumbs } from '@/components/navigation';
import Error from '@/components/feedback/Error';
export default function EditPatientPage() {
    const { uuid } = useParams();
    const { data: patient, isLoading, error } = usePatient(uuid);
    if (error) return <Error msg="Error al cargar datos del paciente"/>
    if (isLoading) return <CustomCircularProgress />;
    return (
        <ContentLayout>
            <AppBreadcrumbs items={[{ label: 'Pacientes', to: '/patients' }, { label: 'Editar' }]} />
            <EditPatientForm patient={patient} uuid={uuid} />;
        </ContentLayout>
    )
}
