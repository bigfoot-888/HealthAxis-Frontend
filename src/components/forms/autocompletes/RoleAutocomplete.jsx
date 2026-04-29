import { Controller } from 'react-hook-form';
import { Autocomplete, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { getRoles } from '../../../shared/api/formDataApi';
import { ROLE_LABELS } from '../../../config/roles';
import { useSnackbar } from '@/app/SnackBarContext';

export default function RoleAutocomplete({ control, rules }) {
    const [roles, setRoles] = useState([]);
    const { showSnackbar } = useSnackbar();

    useEffect(() => {
        async function fetchRoles() {
            try {
                const res = await getRoles();
                setRoles(res);
            } catch (err) {
                showSnackbar({ message: 'Error al obtener roles', severity: 'error' });
            }
        }

        fetchRoles();
    }, []);

    const options = roles.map((role) => ({
        value: role.name,
        label: ROLE_LABELS[role.name] || role.name,
    }));

    return (
        <Controller
            name='roles'
            control={control}
            rules={rules}
            render={({ field, fieldState }) => (
                <Autocomplete
                    multiple
                    options={options}
                    fullWidth
                    disablePortal
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(option, value) => option.value === value.value}
                    value={options.filter((opt) => field.value?.includes(opt.value)) || []}
                    onChange={(_, value) => field.onChange(value.map((v) => v.value))}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label='Cargo'
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message || ' '}
                        />
                    )}
                />
            )}
        />
    );
}
