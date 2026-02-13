import { Outlet } from 'react-router';
import AppShell from './AppShell';
export default function Layout() {
    return (
        <AppShell>
            <Outlet />
        </AppShell>
    );
}
