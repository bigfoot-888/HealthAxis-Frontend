import { useUsers } from '@users/hooks/useUsers';
import UsersTable from '@users/components/UsersTable';
import Skeleton from '@mui/material/Skeleton';

export default function UsersPage() {
    const { data: users, isLoading, error, refetch } = useUsers();
    if (error) return <p>Failed to load users</p>;
    if (!isLoading) return <UsersTable users={users} />;
    else return <Skeleton variant=""></Skeleton>
}
