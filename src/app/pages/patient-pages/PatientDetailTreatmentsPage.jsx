import { usePatientContext } from '@patients/hooks/usePatientContext';
import { useTreatmentsByPatient } from '@treatments/hooks/useTreatmentsByPatient';
import PatientTreatmentsTable from '@treatments/components/views/PatientTreatmentsTable';
import { CustomCircularProgress } from '@/components/feedback';

export default function PatientTreatmentsPage() {
    const { setError, patient, uuid } = usePatientContext();
    const { data: treatments, isLoading, error, refetch } = useTreatmentsByPatient(uuid);
    if (error) return <p>Failed to load users</p>;
    if (isLoading) return <CustomCircularProgress />;
    return <PatientTreatmentsTable treatments={treatments} patient={patient}/>;
}
