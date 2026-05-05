export function invalidateCreateDiagnosisQueries(queryClient) {
    queryClient.invalidateQueries(['diagnoses']);
}

export function invalidateCreateDiagnosisWithAppointment(queryClient, appointment) {
    queryClient.invalidateQueries(['diagnoses']);
    if (appointment?.uuid) queryClient.invalidateQueries(['diagnoses', appointment.uuid]);
    if (appointment?.patient?.uuid) queryClient.invalidateQueries(['diagnoses', appointment.patient.uuid]);
}

export function invalidateCreateDiagnosisWithPatient(queryClient, patient) {
    queryClient.invalidateQueries(['diagnoses']);
    if (patient?.uuid) queryClient.invalidateQueries(['diagnoses', patient.uuid]);
}

export function invalidateEditDiagnosisQueries(queryClient, diagnosis) {
    queryClient.invalidateQueries(['diagnoses']);
    queryClient.invalidateQueries(['diagnoses', diagnosis.uuid]);
    if (diagnosis.patient?.uuid) queryClient.invalidateQueries(['diagnoses', diagnosis.patient.uuid]);
    if (diagnosis.appointment?.uuid) queryClient.invalidateQueries(['diagnoses', diagnosis.appointment.uuid]);
}
