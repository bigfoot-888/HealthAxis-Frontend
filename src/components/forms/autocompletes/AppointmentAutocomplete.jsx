import { getAppointments } from '../../../shared/api/formDataApi';
import { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useRef } from 'react';
import { Controller } from 'react-hook-form';
import { useSnackbar } from '@/app/SnackBarContext';
import { Watch } from 'react-hook-form';
import { formatDateTimeUTC } from '@/utils/date-formatters';

export default function AppointmentAutocomplete({ control, errors, rules }) {
    const [options, setOptions] = useState([]);
    const debounceTimeout = useRef(null);
    const { showSnackbar } = useSnackbar();

    const fetchAppointments = (query) => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        if (!query || query.length < 2) {
            setOptions([]);
            return;
        }

        debounceTimeout.current = setTimeout(async () => {
            try {
                const res = await getAppointments({ query, limit: 20 });
                setOptions(res);
            } catch (err) {
                showSnackbar({ message: 'Error al obtener citas', severity: 'error' });
            }
        }, 200);
    };
    return (
        <Controller
            name='appointment'
            control={control}
            rules={rules}
            render={({ field }) => {
                useEffect(() => {
                    if (field.value) {
                        setOptions((prev) => {
                            const exists = prev.some((o) => o.id === field.value.id);
                            return exists ? prev : [field.value, ...prev];
                        });
                    }
                }, [field.value]);

                return (
                    <Autocomplete
                        options={options}
                        value={field.value || null}
                        fullWidth
                        disablePortal
                        isOptionEqualToValue={(option, value) => option.id === value?.id}
                        getOptionLabel={(option) =>
                            `${option.user.name} ${option.user.surname} — ${option.patient.name} ${option.patient.surname} - ${formatDateTimeUTC(
                                option.startTime,
                            )}`
                        }
                        onInputChange={(_, value) => fetchAppointments(value)}
                        onChange={(_, value) => field.onChange(value)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label='Cita asociada (opcional)'
                                error={!!errors['appointment']}
                                helperText={errors['appointment']?.message || ' '}
                            />
                        )}
                    />
                );
            }}
        />
    );
}
