import { useTreatments } from '@treatments/hooks/useTreatments';
import TreatmentsTable from '@treatments/components/views/TreatmentsTable';
import { CustomCircularProgress } from '@/components/feedback';
import Error from '@/components/feedback/Error';

export default function TreatmentsPage() {
    const { data: treatments, isLoading, error } = useTreatments();
    if (error) return <Error msg="Error al cargar tratamientos"/>
    if (isLoading) return <CustomCircularProgress/>
    return <TreatmentsTable treatments={treatments} />;
}
