import { getAgendas } from '../../../shared/api/formDataApi';
import { useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useRef } from 'react';
import { Controller } from 'react-hook-form';

export default function AgendaAutocomplete({ control, errors, rules }) {
    const [options, setOptions] = useState([]);
    const debounceTimeout = useRef(null); // keep track of timeout across renders

    const fetchAgendas = (query) => {
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
                const res = await getAgendas({ query, limit: 20 });
                setOptions(res);
            } catch (err) {
                console.error('Error fetching agendas:', err);
            }
        }, 200); // 300ms debounce
    };
    return (
        <Controller
            name='agenda'
            control={control}
            rules={rules}
            render={({ field }) => (
                <Autocomplete
                    {...field}
                    options={options}
                    name='agenda'
                    fullWidth
                    disablePortal
                    isOptionEqualToValue={(option, value) => option.id === value?.id}
                    getOptionLabel={(option) => option.name}
                    value={field?.value || null}
                    onInputChange={(_, value) => fetchAgendas(value)}
                    onChange={(_, value) => {
                        field.onChange(value);
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label='Agenda'
                            error={!!errors['agenda']}
                            helperText={errors['agenda']?.message || ' '}
                        />
                    )}
                />
            )}
        />
    );
}
