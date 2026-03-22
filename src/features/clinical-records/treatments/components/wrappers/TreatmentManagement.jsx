import { useTreatments } from '@treatments/hooks/useTreatments';
import TreatmentTable from '@treatments/components/views/TreatmentTable';
import Skeleton from '@mui/material/Skeleton';

export default function TreatmentManagement() {
    const { data: treatments, isLoading, error, refetch } = useTreatments();
    if (error) return <p>Failed to load users</p>;
    if (!isLoading) return <TreatmentTable treatments={treatments} />;
    else return <Skeleton variant=""></Skeleton>
}
