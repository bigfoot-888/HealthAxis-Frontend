import { useUserProfile } from '../hooks/useUserProfile';
import ProfileCard from './ProfileCard';

export default function UserProfileManagement() {
    const { data: user, isLoading, error, refetch } = useUserProfile();
    if (isLoading) return <p>Loading users…</p>;
    if (error) return <p>Failed to load users</p>;
    return <ProfileCard user={user} />;
}
