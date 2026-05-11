import { useAgendas } from '@agendas/hooks/useAgendas';
import AgendasTable from '@agendas/components/views/AgendasTable';
import { CustomCircularProgress } from '@/components/feedback';
import Error from '@/components/feedback/Error';

export default function AgendasPage() {
    const { data: agendas, isLoading, error } = useAgendas();
    if (isLoading) return <CustomCircularProgress />;
    if (error) return <Error msg='Error al cargar agendas' />;
    return <AgendasTable agendas={agendas} />;
}
