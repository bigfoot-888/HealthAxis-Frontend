import { useQuery } from '@tanstack/react-query';
import { getDiagnosesByAppointment } from '@diagnoses/api/diagnosis.api';

export function useDiagnosesByAppointment(appointmentUuid) {
    return useQuery({
        queryKey: ['diagnoses', { appointmentUuid }],
        queryFn: () => getDiagnosesByAppointment(appointmentUuid),
        enabled: !!appointmentUuid,
    });
}
