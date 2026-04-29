import { getPatients } from '../../../shared/api/formDataApi';
import { useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useRef } from 'react';
import { Controller } from 'react-hook-form';
import { useSnackbar } from '@/app/SnackBarContext';

export default function PatientAutocomplete({ control, errors, rules }) {
    const [options, setOptions] = useState([]);
    const debounceTimeout = useRef(null); 
    const { showSnackbar } = useSnackbar();

    const fetchPatients = (query) => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }
        if (!query || query.length < 2) {
            setOptions([]);
            return;
        }

        debounceTimeout.current = setTimeout(async () => {
            try {
                const res = await getPatients({ query, limit: 20 });
                setOptions(res);
            } catch (err) {
                showSnackbar({ message: 'Error al obtener pacientes', severity: 'error' });
            }
        }, 200); 
    };
    return (
        <Controller
            name='patient'
            control={control}
            rules={rules}
            render={({ field }) => (
                <Autocomplete
                    {...field}
                    options={options}
                    name='patient'
                    fullWidth
                    disablePortal
                    isOptionEqualToValue={(option, value) => option.id === value?.id}
                    getOptionLabel={(option) => option.name + ' ' + option.surname + ' — ' + option.nhc}
                    value={field?.value || null}
                    onInputChange={(_, value) => fetchPatients(value)}
                    onChange={(_, value) => {
                        field.onChange(value);
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label='Paciente'
                            error={!!errors['patient']}
                            helperText={errors['patient']?.message || ' '}
                        />
                    )}
                />
            )}
        />
    );
}
