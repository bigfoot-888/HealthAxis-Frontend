import { usePatient } from '@patients/hooks/usePatient';
import UpdatePatientForm from '@patients/components/forms/UpdatePatientForm';
import { useParams } from 'react-router';
export default function UpdatePatientManagement() {
    const { uuid } = useParams(); // this is the uuid from the URL
    const { data: patient, isLoading, error, refetch } = usePatient(uuid);
    if (isLoading) return <p>Loading users…</p>;
    if (error) return <p>Failed to load users</p>;
    if (!patient) return <p>vaya</p>
    return <UpdatePatientForm patient={patient} uuid={uuid} />;
}
