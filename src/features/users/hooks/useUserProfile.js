import { useQuery } from '@tanstack/react-query';
import { getProfile } from '@users/api/user-api';

export function useUserProfile() {
    return useQuery({
        queryKey: ['profile'],
        queryFn: getProfile,
    });
}
