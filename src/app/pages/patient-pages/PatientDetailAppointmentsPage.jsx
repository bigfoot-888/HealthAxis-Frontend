import { usePatientContext } from '@patients/hooks/usePatientContext';
import { useAppointmentsByPatient } from '@/features/appointments/hooks/useAppointmentsByPatient';
import PatientAppointmentsTable from '@/features/appointments/components/views/PatientAppointmentsTable';
import { CustomCircularProgress } from '@/components/feedback';
import Error from '@/components/feedback/Error';

export default function PatientAppointmentsPage() {
    const { uuid, patient } = usePatientContext();
    const { data: appointments, isLoading, error } = useAppointmentsByPatient(uuid);
    if (isLoading) return <CustomCircularProgress />;
    if (error) return <Error msg="Error al cargar citas"/>
    return (
        <PatientAppointmentsTable
            appointments={appointments}
            patient={patient}
        />
    );
}
