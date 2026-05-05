import { usePatientContext } from '@patients/hooks/usePatientContext';
import { useAppointmentsByPatient } from '@/features/appointments/hooks/useAppointmentsByPatient';
import PatientAppointmentsTable from '@/features/appointments/components/views/PatientAppointmentsTable';
import { CustomCircularProgress } from '@/components/feedback';

export default function PatientAppointmentsPage() {
    const { uuid, patient } = usePatientContext();
    const { data: appointments, isLoading, error } = useAppointmentsByPatient(uuid);
    if (isLoading) return <CustomCircularProgress />;
    if (error) return <p>Error al cargar pacientes</p>;
    return (
        <PatientAppointmentsTable
            appointments={appointments}
            patient={patient}
        />
    );
}
