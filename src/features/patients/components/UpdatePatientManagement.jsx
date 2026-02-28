import { usePatient } from '../hooks/usePatient';
import UpdatePatientForm from './UpdatePatientForm';
import { useParams } from 'react-router';
export default function UpdatePatientManagement() {
    const { id } = useParams(); // this is the uuid from the URL
    const { data: patient, isLoading, error, refetch } = usePatient(id);
    if (isLoading) return <p>Loading users…</p>;
    if (error) return <p>Failed to load users</p>;
    if (!patient) return <p>vaya</p>
    return <UpdatePatientForm patient={patient} uuid={id} />;
}
