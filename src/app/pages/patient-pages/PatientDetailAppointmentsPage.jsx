import { usePatientContext } from '@patients/hooks/usePatientContext';
import { useAppointmentsByPatient } from '@/features/appointments';
import PatientAppointmentsTable from '@patients/components/views/PatientAppointmentsTable';
import { CustomCircularProgress } from '@/components/feedback';

export default function PatientAppointmentsPage() {
    const { setError, uuid } = usePatientContext();
    const { data: appointments, isLoading, error, refetch } = useAppointmentsByPatient(uuid);
    if (isLoading) return <CustomCircularProgress />;
    if (error) return <p>Error al cargar pacientes</p>;
    return (
        <PatientAppointmentsTable
            appointments={appointments}
            setError={setError}
            refetchPatientAppointments={refetch}
        />
    );
}
