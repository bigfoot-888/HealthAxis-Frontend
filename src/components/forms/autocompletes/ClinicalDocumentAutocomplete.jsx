import { getFilteredClinicalDocuments } from '@clinical-documents';
import { useState, useRef } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Controller } from 'react-hook-form';

export default function ClinicalDocumentAutocomplete({ control, rules = {}, multiple = false }) {
    const [options, setOptions] = useState([]);
    const debounceTimeout = useRef(null);

    const fetchDocuments = (query) => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        if (!query || query.length < 2) {
            setOptions([]);
            return;
        }

        debounceTimeout.current = setTimeout(async () => {
            try {
                const res = await getFilteredClinicalDocuments(query, 20);
                console.log(res)
                setOptions(res);
            } catch (err) {
                console.error('Error fetching clinical documents:', err);
            }
        }, 200);
    };

    return (
        <Controller
            name='clinicalDocument'
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
                        return option.title ?? 'Documento';
                    }}
                    onInputChange={(_, value) => fetchDocuments(value)}
                    onChange={(_, value) => field.onChange(value)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label='Documento clínico'
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message || ' '}
                        />
                    )}
                />
            )}
        />
    );
}
