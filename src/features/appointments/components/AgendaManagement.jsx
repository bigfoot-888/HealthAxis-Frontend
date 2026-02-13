import { useAgendas } from '../hooks/useAgendas';
import AgendasTable from './AgendasTable';
import Skeleton from '@mui/material/Skeleton';

export default function AgendaManagement() {
    const { data: agendas, isLoading, error, refetch } = useAgendas();
    if (error) return <p>Failed to load users</p>;
    if (!isLoading) return <AgendasTable agendas={agendas} />;
    else return <Skeleton variant=""></Skeleton>
}
