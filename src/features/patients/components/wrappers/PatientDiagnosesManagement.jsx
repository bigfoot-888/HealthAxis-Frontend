
import { usePatientContext } from '@patients/hooks/usePatientContext';
import { useDiagnosesByPatient } from '@diagnoses';
import PatientDiagnosesTable from '@patients/components/views/PatientDiagnosesTable';

export default function PatientDiagnosesManagement() {
    const { setError, patient, uuid } = usePatientContext();
    const { data: diagnoses, isLoading, error, refetch } = useDiagnosesByPatient(uuid);
    if (isLoading) return <p>Loading users…</p>;
    if (error) return <p>Failed to load users</p>;
    if (!diagnoses) return <p>vaya</p>
    return <PatientDiagnosesTable diagnoses={diagnoses} setError={setError} />;
}
