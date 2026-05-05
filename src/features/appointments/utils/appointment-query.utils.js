export function invalidateCreateAppointmentQueries(queryClient) {
    queryClient.invalidateQueries(['appointments']);
}

export function invalidateCreateAppointmentWithUser(queryClient, user) {
    queryClient.invalidateQueries(['appointments']);
    if (user?.uuid) queryClient.invalidateQueries(['appointments', user.uuid]);
}
export function invalidateCreateAppointmentWithPatient(queryClient, patient) {
    queryClient.invalidateQueries(['appointments']);
    if (patient?.uuid) queryClient.invalidateQueries(['appointments', patient.uuid]);
}

export function invalidateEditAppointmentQueries(queryClient, appointment) {
    queryClient.invalidateQueries(['appointments']);
    queryClient.invalidateQueries(['appointment', appointment.uuid]);
    if (appointment.user?.uuid) queryClient.invalidateQueries(['appointments', appointment.user.uuid]);
    if (appointment.patient?.uuid) queryClient.invalidateQueries(['appointments', appointment.patient.uuid]);
}
