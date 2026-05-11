import { useUser } from '@users/hooks/useUser';
import EditUserForm from '@/features/users/components/forms/EditUserForm';
import { useParams } from 'react-router';
import { CustomCircularProgress } from '@/components/feedback';
import { ContentLayout } from '@/components/layout';
import { AppBreadcrumbs } from '@/components/navigation';
import Error from '@/components/feedback/Error';

export default function EditUserPage() {
    const { uuid } = useParams();
    const { data: user, isLoading, error } = useUser(uuid);
    if (isLoading) return <CustomCircularProgress />;
    if (error) return <Error msg="Error al cargar datos del usuario"/>
    return (
        <ContentLayout>
            <AppBreadcrumbs
                items={[
                    { label: 'Usuarios', to: '/users' },
                    { label: `${user.name} ${user.surname}`, to: `/users/${uuid}` },
                    { label: 'Editar' },
                ]}
            />
            <EditUserForm user={user} uuid={uuid} />;
        </ContentLayout>
    );
}
