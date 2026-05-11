import { usePatientContext } from '@patients/hooks/usePatientContext';
import { useDiagnosesByPatient } from '@diagnoses/hooks/useDiagnosesByPatient';
import PatientDiagnosesTable from '@diagnoses/components/views/PatientDiagnosesTable';
import { CustomCircularProgress } from '@/components/feedback';
import Error from '@/components/feedback/Error';

export default function PatientDiagnosesPage() {
    const { patient, uuid } = usePatientContext();
    const { data: diagnoses, isLoading, error } = useDiagnosesByPatient(uuid);
    if (isLoading) return <CustomCircularProgress />;
    if (error) return <Error msg='Error al cargar diagnósticos' />;
    return <PatientDiagnosesTable diagnoses={diagnoses} patient={patient} />;
}
