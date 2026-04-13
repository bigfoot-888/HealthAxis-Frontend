import { usePatients } from '@patients/hooks/usePatients';
import PatientsTable from '@patients/components/views/PatientsTable';
import { CustomCircularProgress } from '@/components/feedback';

export default function PatientsPage() {
    const { data: patients, isLoading, error } = usePatients();

    if (error) return <p>Failed to load patients</p>;

    if (isLoading) return <CustomCircularProgress />;

    return <PatientsTable patients={patients} />;
}