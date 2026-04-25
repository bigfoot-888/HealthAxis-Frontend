import { useDiagnoses } from '@diagnoses/hooks/useDiagnoses';
import DiagnosesTable from '@diagnoses/components/views/DiagnosesTable';
import Skeleton from '@mui/material/Skeleton';
import { CustomCircularProgress } from '@/components/feedback';

export default function DiagnosesPage() {
    const { data: diagnoses, isLoading, error, refetch } = useDiagnoses();
    if (error) return <p>Error al cargar diagnósticos</p>;
    if (isLoading) return <CustomCircularProgress />;
    return <DiagnosesTable diagnoses={diagnoses} />;
}
