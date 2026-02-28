import { getUsers } from '../../../shared/api/formDataApi';
import { useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useRef } from 'react';
import { Controller } from 'react-hook-form';

export function UserAutocomplete({ control, errors, rules }) {
    const [options, setOptions] = useState([]);
    const debounceTimeout = useRef(null); // keep track of timeout across renders

    const fetchUsers = (query) => {
        // Cancel previous timeout
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }
        // Minimum characters check
        if (!query || query.length < 2) {
            setOptions([]);
            return;
        }

        // Set new timeout
        debounceTimeout.current = setTimeout(async () => {
            try {
                const res = await getUsers({ query, limit: 20 });
                setOptions(res);
            } catch (err) {
                console.error('Error fetching users:', err);
            }
        }, 200); // 300ms debounce
    };
    return (
        <Controller
            name='user'
            control={control}
            rules={rules}
            render={({ field }) => (
                <Autocomplete
                    {...field}
                    options={options}
                    name='user'
                    fullWidth
                    disablePortal
                    isOptionEqualToValue={(option, value) => option.id === value?.id}
                    getOptionLabel={(option) =>
                        `${option.name} ${option.surname} — ${option.roles.map((r) => r.name).join(', ')}`
                    }
                    value={field?.value || null}
                    onInputChange={(_, value) => fetchUsers(value)}
                    onChange={(_, value) => {
                        field.onChange(value);
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label='Profesional'
                            error={!!errors['user']}
                            helperText={errors['user']?.message || ' '}
                        />
                    )}
                />
            )}
        />
    );
}
