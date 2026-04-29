import { useTreatments } from '@treatments/hooks/useTreatments';
import TreatmentTable from '@treatments/components/views/TreatmentTable';
import Skeleton from '@mui/material/Skeleton';
import { CustomCircularProgress } from '@/components/feedback';

export default function TreatmentsPage() {
    const { data: treatments, isLoading, error, refetch } = useTreatments();
    if (error) return <p>Error al cargar tratamientos</p>;
    if (isLoading) return <CustomCircularProgress/>
    return <TreatmentTable treatments={treatments} />;
}
