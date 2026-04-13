import { useLoaderData, Outlet } from 'react-router';
import { AuthProvider } from '@/app/AuthContext';
import AppShell from '@/components/layout/AppShell';

function Layout() {
    const user = useLoaderData();

    return (
        <AuthProvider initialUser={user}>
            <AppShell>
                <Outlet />
            </AppShell>
        </AuthProvider>
    );
}

export default Layout;