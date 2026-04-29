import { useUserProfile } from '@users/hooks/useUserProfile';
import { CustomCircularProgress } from '@/components/feedback';
import UserProfileCard from '@users/components/ui/UserProfileCard';
import { ContentLayout } from '@/components/layout';

export default function ProfilePage() {
    const { data: user, isLoading, error, refetch } = useUserProfile();
    if (error) return <p>Error al cargar datos de usuario</p>;
    if (isLoading) return <CustomCircularProgress />;
    return (
        <ContentLayout>
            <UserProfileCard user={user} />
        </ContentLayout>
    );
}
