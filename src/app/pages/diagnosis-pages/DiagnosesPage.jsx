import { useDiagnoses } from '@diagnoses/hooks/useDiagnoses';
import DiagnosesTable from '@diagnoses/components/views/DiagnosesTable';
import Skeleton from '@mui/material/Skeleton';
import { CustomCircularProgress } from '@/components/feedback';
import Error from '@/components/feedback/Error';

export default function DiagnosesPage() {
    const { data: diagnoses, isLoading, error } = useDiagnoses();
    if (error) return <Error msg="Error al cargar diagnósticos"/>
    if (isLoading) return <CustomCircularProgress />;
    return <DiagnosesTable diagnoses={diagnoses} />;
}
