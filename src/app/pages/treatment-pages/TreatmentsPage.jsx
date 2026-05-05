import { useTreatments } from '@treatments/hooks/useTreatments';
import TreatmentsTable from '@treatments/components/views/TreatmentsTable';
import { CustomCircularProgress } from '@/components/feedback';

export default function TreatmentsPage() {
    const { data: treatments, isLoading, error, refetch } = useTreatments();
    if (error) return <p>Error al cargar tratamientos</p>;
    if (isLoading) return <CustomCircularProgress/>
    return <TreatmentsTable treatments={treatments} />;
}
