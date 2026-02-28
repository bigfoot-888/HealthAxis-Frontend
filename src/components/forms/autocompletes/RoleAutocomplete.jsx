import { ROLE_LABELS } from '../../../config/roles';
import { Controller } from 'react-hook-form';
import { Autocomplete, TextField } from '@mui/material';
import Chip from '@mui/material/Chip';

export default function RoleAutocomplete({control, errors}) {
    return (
        <Controller
            name='roles'
            control={control}
            rules={{
                required: 'El cargo es obligatorio',
            }}
            render={({ field }) => (
                <Autocomplete
                    multiple
                    {...field}
                    onChange={(_, value) => field.onChange(value)}
                    value={field.value || []}
                    disablePortal
                    options={Object.values(ROLE_LABELS)}
                    fullWidth
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label='Cargo'
                            error={!!errors.role}
                            helperText={errors.role?.message || ' '}
                        />
                    )}
                />
            )}
        ></Controller>
    );
}
