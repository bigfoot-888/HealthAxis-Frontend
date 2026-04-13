import { useUser } from '@users/hooks/useUser';
import EditUserForm from '@users/components/EditUserForm';
import { useParams } from 'react-router';
export default function EditUserManagement() {
    const { uuid } = useParams(); // this is the uuid from the URL
    const { data: user, isLoading, error, refetch } = useUser(uuid);
    if (isLoading) return <p>Loading users…</p>;
    if (error) return <p>Failed to load users</p>;
    if (!user) return <p>vaya</p>;
    return <EditUserForm user={user} uuid={uuid} />;
}
