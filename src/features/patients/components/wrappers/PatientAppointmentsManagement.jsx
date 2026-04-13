
import { usePatientContext } from '@patients/hooks/usePatientContext';
import { useAppointmentsByPatient } from '@/features/appointments';
import PatientAppointmentsTable from '@patients/components/views/PatientAppointmentsTable';

export default function PatientAppointmentsManagement() {
    const { setError, patient, uuid } = usePatientContext();
    const { data: appointments, isLoading, error, refetch } = useAppointmentsByPatient(uuid);
    if (isLoading) return <p>Loading users…</p>;
    if (error) return <p>Failed to load users</p>;
    if (!appointments) return <p>vaya</p>
    return <PatientAppointmentsTable appointments={appointments} setError={setError} />;
}
