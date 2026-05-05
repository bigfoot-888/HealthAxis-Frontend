import { useUsers } from '@users/hooks/useUsers';
import UsersTable from '@/features/users/components/views/UsersTable';
import { CustomCircularProgress } from '@/components/feedback';

export default function UsersPage() {
    const { data: users, isLoading, error, refetch } = useUsers();
    if (error) return <p>Error al cargar usuarios</p>;
    if (isLoading) return <CustomCircularProgress/>
    return <UsersTable users={users} />;
}


