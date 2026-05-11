import { usePatientContext } from '@patients/hooks/usePatientContext';
import { useTreatmentsByPatient } from '@treatments/hooks/useTreatmentsByPatient';
import PatientTreatmentsTable from '@treatments/components/views/PatientTreatmentsTable';
import { CustomCircularProgress } from '@/components/feedback';
import Error from '@/components/feedback/Error';

export default function PatientTreatmentsPage() {
    const { patient, uuid } = usePatientContext();
    const { data: treatments, isLoading, error } = useTreatmentsByPatient(uuid);
    if (error) return <Error msg="Error al cargar tratamientos"/>
    if (isLoading) return <CustomCircularProgress />;
    return <PatientTreatmentsTable treatments={treatments} patient={patient}/>;
}
