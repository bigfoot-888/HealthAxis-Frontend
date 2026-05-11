import { useUserProfile } from '@users/hooks/useUserProfile';
import { CustomCircularProgress } from '@/components/feedback';
import UserProfileCard from '@users/components/ui/UserProfileCard';
import { ContentLayout } from '@/components/layout';
import Error from '@/components/feedback/Error';

export default function ProfilePage() {
    const { data: user, isLoading, error } = useUserProfile();
    if (error) return <Error msg='Error al cargar datos del usuario' />;
    if (isLoading) return <CustomCircularProgress />;
    return (
        <ContentLayout>
            <UserProfileCard user={user} />
        </ContentLayout>
    );
}
