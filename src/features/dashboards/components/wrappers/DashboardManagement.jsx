import { useDashboard } from '@dashboards/hooks/useDashboard';
import Skeleton from '@mui/material/Skeleton';
import Dashboard from '@dashboards/components/views/Dashboard';
import { useParams } from 'react-router';
export default function DashboardManagement() {
    // const { uuid } = useParams(); // this is the uuid from the URL
    const uuid = "189oifj3i"; 
    const { data: dashboard, isLoading, error, refetch } = useDashboard(uuid);
    if (isLoading) return <Skeleton variant='rectangular' height={400} />;
    if (error) return <p>Failed to load flow</p>;
    if (!dashboard) return <p>No dashboard found</p>;
    return <Dashboard dashboard={dashboard} />;
}
