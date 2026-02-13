import { useUser } from '../hooks/useUser';
import UpdateUserForm from './UpdateUserForm';
import { useParams } from 'react-router';
export default function EditUserManagement() {
    const { id } = useParams(); // this is the uuid from the URL
    const { data: user, isLoading, error, refetch } = useUser(id);
    if (isLoading) return <p>Loading users…</p>;
    if (error) return <p>Failed to load users</p>;
    if (!user) return <p>vaya</p>;
    return <UpdateUserForm user={user} uuid={id} />;
}
