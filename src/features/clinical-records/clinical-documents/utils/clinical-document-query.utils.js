export function invalidateCreateDocumentQueries(queryClient) {
    queryClient.invalidateQueries(['clinical-documents']);
}

export function invalidateEditDocumentQueries(queryClient, document) {
    queryClient.invalidateQueries(['clinical-documents']);
    if (document?.uuid) queryClient.invalidateQueries(['clinical-documents', document.uuid]);
}
