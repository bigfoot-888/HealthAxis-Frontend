import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Grid } from '@mui/material';

import { FormDialog } from '@/components/dialogs';
import { PasswordInput } from '@/components/forms/inputs';
import { handleApiError } from '@/utils/handle-errors';

import { changeUserPassword } from '@users/api/user.api';

import { useSnackbar } from '@/app/SnackBarContext';

export default function EditUserPasswordForm({ open, onClose, user }) {
    const {
        register,
        handleSubmit,
        watch,
        setError: setFormError,
        reset,
        formState: { errors },
    } = useForm({
        mode: 'onBlur',
    });

    const [error, setError] = useState(null);
    const { showSnackbar } = useSnackbar();

    const onSubmit = async (data) => {
        try {
            await changeUserPassword(user.uuid, {
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
            });
            reset();
            onClose();
            showSnackbar({ message: 'Contraseña modificada correctamente' });
        } catch (err) {
            handleApiError(err, setError, setFormError);
        }
    };

    return (
        <FormDialog
            open={open}
            handleClose={onClose}
            handleSubmit={handleSubmit(onSubmit)}
            title={`Cambiar contraseña — ${user?.name} ${user?.surname}`}
            error={error}
            onErrorClose={() => setError(null)}
        >
            <Grid container spacing={2} sx={{ pt: 1 }}>
                <Grid size={12}>
                    <PasswordInput
                        label='Contraseña actual'
                        name='currentPassword'
                        register={register}
                        rules={{
                            required: 'La contraseña actual es obligatoria',
                        }}
                        errors={errors}
                    />
                </Grid>

                <Grid size={12}>
                    <PasswordInput
                        label='Nueva contraseña'
                        name='newPassword'
                        register={register}
                        rules={{
                            required: 'La nueva contraseña es obligatoria',
                            minLength: {
                                value: 6,
                                message: 'Mínimo 6 caracteres',
                            },
                            maxLength: {
                                value: 255,
                                message: 'Máximo 255 caracteres',
                            },
                        }}
                        errors={errors}
                    />
                </Grid>

                <Grid size={12}>
                    <PasswordInput
                        label='Confirmar contraseña'
                        name='confirmPassword'
                        register={register}
                        rules={{
                            required: 'Debe confirmar la contraseña',
                            validate: (value) => value === watch('newPassword') || 'Las contraseñas no coinciden',
                        }}
                        errors={errors}
                    />
                </Grid>
            </Grid>
        </FormDialog>
    );
}
