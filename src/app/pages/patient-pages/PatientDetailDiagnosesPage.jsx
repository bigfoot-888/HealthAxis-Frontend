import { usePatientContext } from '@patients/hooks/usePatientContext';
import { useDiagnosesByPatient } from '@diagnoses/hooks/useDiagnosesByPatient';
import PatientDiagnosesTable from '@diagnoses/components/views/PatientDiagnosesTable';
import { CustomCircularProgress } from '@/components/feedback';

export default function PatientDiagnosesPage() {
    const { patient, uuid } = usePatientContext();
    const { data: diagnoses, isLoading, error, refetch } = useDiagnosesByPatient(uuid);
    if (isLoading) return <CustomCircularProgress />;
    if (error) return <p>Error al cargar diagnósticos.</p>;
    return <PatientDiagnosesTable diagnoses={diagnoses} patient={patient} />;
}
