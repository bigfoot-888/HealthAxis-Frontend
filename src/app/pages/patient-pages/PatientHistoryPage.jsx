import { usePatientHistory } from '@patients/hooks/usePatientHistory';
import PatientHistory from '@patients/components/views/PatientHistory';
import { useParams } from 'react-router';
import { CustomCircularProgress } from '@/components/feedback';

export default function PatientFlowPage() {
    const { uuid } = useParams(); 
    const { data: logs, isLoading, error, refetch } = usePatientHistory(uuid);
    if (error) return <p>Error al cargar historial</p>;
    if (isLoading) return <CustomCircularProgress />;
    return <PatientHistory logs={logs} />;
}
