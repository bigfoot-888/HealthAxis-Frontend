export function invalidateCreatePatientQueries(queryClient) {
    queryClient.invalidateQueries(['patients']);
}

export function invalidateEditPatientQueries(queryClient, patient) {
    queryClient.invalidateQueries(['patients']);
    queryClient.invalidateQueries(['patients', patient.uuid]);
}
