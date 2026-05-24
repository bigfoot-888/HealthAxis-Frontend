export function invalidateCreateUserQueries(queryClient) {
    queryClient.invalidateQueries(['users']);
}

export function invalidateEditUserQueries(queryClient, user) {
    queryClient.invalidateQueries(['users']);
    queryClient.invalidateQueries(['users', user.uuid]);
}
