import { useQuery } from '@tanstack/react-query';
import { getUser } from '../api/user-api';

export function useUser(uuid) {
    return useQuery({
        queryKey: ['user', uuid],
        queryFn: () => getUser(uuid),
        enabled: !!uuid, // only run if uuid exists
    });
}
