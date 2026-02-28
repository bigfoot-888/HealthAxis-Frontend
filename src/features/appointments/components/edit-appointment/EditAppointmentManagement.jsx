import { useAppointmentPlain } from '../../hooks/useAppointment';
import EditAppointmentForm from './EditAppointmentForm';
import { useParams } from 'react-router';
export default function EditAppointmentManagement() {
    const { id } = useParams(); // this is the uuid from the URL
    const { data: appointment, isLoading, error, refetch } = useAppointmentPlain(id);
    if (isLoading) return <p>Loading users…</p>;
    if (error) return <p>Failed to load users</p>;
    if (!appointment) return <p>vaya</p>;
    return <EditAppointmentForm appointment={appointment} uuid={id} />;
}
