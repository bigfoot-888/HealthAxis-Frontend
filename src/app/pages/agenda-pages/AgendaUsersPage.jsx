import { useAgendaContext } from '@agendas/hooks/useAgendaContext';
import { useUsersByAgenda } from '@users/hooks/useUsersByAgenda';
import { CustomCircularProgress } from '@/components/feedback';
import AgendaUsersTable from '@/features/users/components/views/AgendaUsersTable';
export default function AgendaUsersPage() {
    const { setError, agenda, uuid } = useAgendaContext();
    const { data: users, isLoading, error: fetchError, refetch: refetchUsers } = useUsersByAgenda(uuid);
    if (fetchError) return <p>Error al cargar la agenda.</p>;
    if (isLoading || !agenda) return <CustomCircularProgress />;
    return <AgendaUsersTable users={users} />;
}
