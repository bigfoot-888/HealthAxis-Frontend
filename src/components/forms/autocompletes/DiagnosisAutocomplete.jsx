import { getDiagnoses } from '../../../shared/api/formDataApi';
import { useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useRef } from 'react';
import { Controller } from 'react-hook-form';
import { useSnackbar } from '@/app/SnackBarContext';

export default function DiagnosisAutocomplete({ control, rules={}, multiple = false }) {
    const [options, setOptions] = useState([]);
    const debounceTimeout = useRef(null);
    const { showSnackbar } = useSnackbar();

    const fetchDiagnoses = (query) => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        if (!query || query.length < 2) {
            setOptions([]);
            return;
        }

        debounceTimeout.current = setTimeout(async () => {
            try {
                const res = await getDiagnoses({ query, limit: 20 });
                setOptions(res);
            } catch (err) {
                showSnackbar({ message: 'Error al obtener diagnósticos', severity: 'error' });
            }
        }, 200);
    };

    return (
        <Controller
            name="diagnosis"
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
                        return `${option.patient.name} ${option.patient.surname} - ${option.name}`
                    }}
                    onInputChange={(_, value) => fetchDiagnoses(value)}
                    onChange={(_, value) => field.onChange(value)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label='Diagnóstico'
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message || ' '}
                        />
                    )}
                />
            )}
        />
    );
}
