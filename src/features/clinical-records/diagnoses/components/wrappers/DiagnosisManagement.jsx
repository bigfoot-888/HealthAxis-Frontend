import { useDiagnoses } from '@diagnoses/hooks/useDiagnoses';
import DiagnosesTable from '@diagnoses/components/views/DiagnosesTable';
import Skeleton from '@mui/material/Skeleton';

export default function DiagnosisManagement() {
    const { data: diagnoses, isLoading, error, refetch } = useDiagnoses();
    if (error) return <p>Failed to load users</p>;
    if (!isLoading) return <DiagnosesTable diagnoses={diagnoses}/>;
    else return <Skeleton variant=""></Skeleton>
}
