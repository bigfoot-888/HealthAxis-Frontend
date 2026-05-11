import { useUsers } from '@users/hooks/useUsers';
import UsersTable from '@/features/users/components/views/UsersTable';
import { CustomCircularProgress } from '@/components/feedback';
import Error from '@/components/feedback/Error';

export default function UsersPage() {
    const { data: users, isLoading, error } = useUsers();
    if (error) return <Error msg='Error al cargar usuarios' />;
    if (isLoading) return <CustomCircularProgress />;
    return <UsersTable users={users} />;
}
