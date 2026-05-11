import { useAgendaContext } from '@agendas/hooks/useAgendaContext';
import { useUsersByAgenda } from '@users/hooks/useUsersByAgenda';
import { CustomCircularProgress } from '@/components/feedback';
import AgendaUsersTable from '@/features/users/components/views/AgendaUsersTable';
import Error from '@/components/feedback/Error';
export default function AgendaUsersPage() {
    const { agenda, uuid } = useAgendaContext();
    const { data: users, isLoading, error: fetchError } = useUsersByAgenda(uuid);
    if (fetchError) return <Error msg='Error al cargar los usuarios' />;
    if (isLoading || !agenda) return <CustomCircularProgress />;
    return <AgendaUsersTable users={users} />;
}
