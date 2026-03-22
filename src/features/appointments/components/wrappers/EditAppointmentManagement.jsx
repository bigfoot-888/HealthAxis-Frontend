import { useAppointmentPlain } from '@appointments/hooks/useAppointment';
import EditAppointmentForm from '@appointments/components/forms/EditAppointmentForm';
import { useParams } from 'react-router';
export default function EditAppointmentManagement() {
    const { uuid } = useParams();
    const { data: appointment, isLoading, error, refetch } = useAppointmentPlain(uuid);
    if (isLoading) return <p>Loading users…</p>;
    if (error) return <p>Failed to load users</p>;
    if (!appointment) return <p>vaya</p>;
    return <EditAppointmentForm appointment={appointment} uuid={id} />;
}
