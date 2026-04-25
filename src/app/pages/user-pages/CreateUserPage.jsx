import CreateUserForm from '@users/components/CreateUserForm';
import { AppBreadcrumbs } from '@/components/navigation';
import { ContentLayout } from '@/components/layout';
export default function CreateUserPage() {
    return (
        <ContentLayout>
            <AppBreadcrumbs items={[{ label: 'Usuarios', to: '/users' }, { label: 'Crear' }]} />
            <CreateUserForm/>
        </ContentLayout>
    );
}
