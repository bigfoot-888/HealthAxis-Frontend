import { usePatients } from '@patients/hooks/usePatients';
import PatientsTable from '@patients/components/views/PatientsTable';
import Skeleton from '@mui/material/Skeleton';

export default function PatientManagement() {
    const { data: patients, isLoading, error, refetch } = usePatients();
    if (error) return <p>Failed to load patients</p>;
    if (!isLoading) return <PatientsTable patients={patients} />;
    else return <Skeleton variant=""></Skeleton>
}
