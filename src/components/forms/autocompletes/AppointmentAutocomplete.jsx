import { getAppointments } from '../../../shared/api/formDataApi';
import { useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useRef } from 'react';
import { Controller } from 'react-hook-form';

export default function AppointmentAutocomplete({ control, errors, rules }) {
    const [options, setOptions] = useState([]);
    const debounceTimeout = useRef(null); // keep track of timeout across renders

    const fetchAppointments = (query) => {
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
                const res = await getAppointments({ query, limit: 20 });
                setOptions(res);
            } catch (err) {
                console.error('Error fetching appointments:', err);
            }
        }, 200);
    };
    return (
        <Controller
            name='appointment'
            control={control}
            rules={rules}
            render={({ field }) => (
                <Autocomplete
                    options={options}
                    {...field}
                    fullWidth
                    disablePortal
                    isOptionEqualToValue={(option, value) => option.id === value?.id}
                    getOptionLabel={(option) =>
                        `${option.user.name} ${option.user.surname} — ${option.patient.name} ${option.patient.surname} - ${new Date(option.start_time).toLocaleString(
                            'es-ES',
                            {
                                timeZone: 'UTC',
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                            },
                        )}`
                    }
                    onInputChange={(_, value) => fetchAppointments(value)}
                    onChange={(_, value) => {
                        field.onChange(value);
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label='Cita asociada (opcional)'
                            error={!!errors['appointment']}
                            helperText={errors['appointment']?.message || ' '}
                        />
                    )}
                />
            )}
        />
    );
}
