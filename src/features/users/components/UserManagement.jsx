import { useUsers } from '../hooks/useUsers';
import UsersTable from './UsersTable';
import Skeleton from '@mui/material/Skeleton';

export default function UserManagement() {
    const { data: users, isLoading, error, refetch } = useUsers();
    if (error) return <p>Failed to load users</p>;
    if (!isLoading) return <UsersTable users={users} />;
    else return <Skeleton variant=""></Skeleton>
}
