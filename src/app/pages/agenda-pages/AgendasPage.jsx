import { useAgendas } from '@agendas/hooks/useAgendas';
import AgendasTable from '@agendas/components/views/AgendasTable';
import { CustomCircularProgress } from '@/components/feedback';

export default function AgendasPage() {
    const { data: agendas, isLoading, error, refetch } = useAgendas();
    if (isLoading) return <CustomCircularProgress />;
    if (error) return <p>Error al cargar agendas.</p>;
    return <AgendasTable agendas={agendas} />;
}
