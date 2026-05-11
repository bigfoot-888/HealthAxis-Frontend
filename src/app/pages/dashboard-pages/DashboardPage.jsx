import { useDashboard } from '@dashboards/hooks/useDashboard';
import Dashboard from '@dashboards/components/views/Dashboard';
import { CustomCircularProgress } from '@/components/feedback';
import Error from '@/components/feedback/Error';
export default function DashboardPage() {
    const { data: dashboard, isLoading, error } = useDashboard();
    if (isLoading) return <CustomCircularProgress/>
    if (error) return <Error msg="Error al cargar dashboard"/>
    return <Dashboard dashboard={dashboard} />;
}
