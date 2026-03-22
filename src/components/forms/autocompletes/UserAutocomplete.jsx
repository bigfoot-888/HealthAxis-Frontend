import { getUsers } from '../../../shared/api/formDataApi';
import { useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useRef } from 'react';
import { Controller } from 'react-hook-form';

export default function UserAutocomplete({ control, name, rules, multiple = false }) {
    const [options, setOptions] = useState([]);
    const debounceTimeout = useRef(null);

    const fetchUsers = (query) => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        if (!query || query.length < 2) {
            setOptions([]);
            return;
        }

        debounceTimeout.current = setTimeout(async () => {
            try {
                const res = await getUsers({ query, limit: 20 });
                setOptions(res);
            } catch (err) {
                console.error('Error fetching users:', err);
            }
        }, 200);
    };

    return (
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field, fieldState }) => (
                <Autocomplete
                    {...field}
                    options={options}
                    multiple={multiple}
                    fullWidth
                    disablePortal
                    value={field.value ?? (multiple ? [] : null)}
                    isOptionEqualToValue={(option, value) => option.id === value?.id}
                    getOptionLabel={(option) => {
                        if (!option) return ''; 
                        const roles = option.roles?.map((r) => r.name).join(', ') ?? '';
                        return `${option.name ?? ''} ${option.surname ?? ''}${roles ? ` — ${roles}` : ''}`;
                    }}
                    onInputChange={(_, value) => fetchUsers(value)}
                    onChange={(_, value) => field.onChange(value)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label='Profesional'
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message || ' '}
                        />
                    )}
                />
            )}
        />
    );
}
