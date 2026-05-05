export function invalidateCreateTreatmentQueries(queryClient) {
    queryClient.invalidateQueries(['treatments']);
}

export function invalidateCreateTreatmentWithAppointment(queryClient, appointment, diagnosis) {
    queryClient.invalidateQueries(['treatments']);
    if (appointment?.uuid) queryClient.invalidateQueries(['treatments', appointment.uuid]);
    if (diagnosis?.uuid) queryClient.invalidateQueries(['treatments', diagnosis.uuid]);
}

export function invalidateCreateTreatmentWithPatient(queryClient, patient, diagnosis) {
    queryClient.invalidateQueries(['treatments']);
    if (patient?.uuid) queryClient.invalidateQueries(['treatments', patient.uuid]);
    if (diagnosis?.uuid) queryClient.invalidateQueries(['treatments', diagnosis.uuid]);
}

export function invalidateCreateTreatmentWithDiagnosis(queryClient, diagnosis, patient) {
    queryClient.invalidateQueries(['treatments']);
    if (patient?.uuid) queryClient.invalidateQueries(['treatments', patient.uuid]);
    if (diagnosis?.uuid) queryClient.invalidateQueries(['treatments', diagnosis.uuid]);
}

export function invalidateEditTreatmentQueries(queryClient, treatment) {
    queryClient.invalidateQueries(['treatments']);
    queryClient.invalidateQueries(['treatment', treatment.uuid]);
    if (treatment.appointment?.uuid) queryClient.invalidateQueries(['treatments', treatment.appointment.uuid]);
    if (treatment.diagnosis?.uuid) queryClient.invalidateQueries(['treatments', treatment.diagnosis.uuid]);
}
