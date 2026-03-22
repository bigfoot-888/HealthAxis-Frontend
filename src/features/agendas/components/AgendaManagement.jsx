import { useAgendas } from '@agendas/hooks/useAgendas';
import AgendasTable from '@agendas/components/AgendasTable';
import CircularProgress from '@mui/material/CircularProgress';

export default function AgendaManagement() {
    const { data: agendas, isLoading, error, refetch } = useAgendas();
    if (isLoading) return <CircularProgress />;
    if (error) return <p>Failed to load agendas</p>;
    return <AgendasTable agendas={agendas} />;
}
