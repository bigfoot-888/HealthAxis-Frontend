export function invalidateCreateAgendaQueries(queryClient) {
    queryClient.invalidateQueries(['agendas']);
}

export function invalidateEditAgendaQueries(queryClient, agenda) {
    queryClient.invalidateQueries(['agendas']);
    if (agenda?.uuid) queryClient.invalidateQueries(['agenda', agenda.uuid]);
}
