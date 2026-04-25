import { useDashboard } from '@dashboards/hooks/useDashboard';
import Skeleton from '@mui/material/Skeleton';
import Dashboard from '@dashboards/components/views/Dashboard';
import { CustomCircularProgress } from '@/components/feedback';
export default function DashboardPage() {
    const { data: dashboard, isLoading, error, refetch } = useDashboard();
    if (isLoading) return <CustomCircularProgress/>
    if (error) return <p>Error al cargar dashboard</p>;
    return <Dashboard dashboard={dashboard} />;
}
