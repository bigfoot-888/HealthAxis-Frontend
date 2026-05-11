import { usePatients } from '@patients/hooks/usePatients';
import PatientsTable from '@patients/components/views/PatientsTable';
import { CustomCircularProgress } from '@/components/feedback';
import Error from '@/components/feedback/Error';

export default function PatientsPage() {
    const { data: patients, isLoading, error } = usePatients();
    if (error) return <Error msg='Error al cargar pacientes' />;
    if (isLoading) return <CustomCircularProgress />;
    return <PatientsTable patients={patients} />;
}
