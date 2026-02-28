import { usePatients } from '../hooks/usePatients';
import PatientsTable from './PatientsTable';
import Skeleton from '@mui/material/Skeleton';

export default function UserManagement() {
    const { data: patients, isLoading, error, refetch } = usePatients();
    if (error) return <p>Failed to load patients</p>;
    if (!isLoading) return <PatientsTable patients={patients} />;
    else return <Skeleton variant=""></Skeleton>
}
