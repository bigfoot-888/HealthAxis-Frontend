import { Grid, Typography } from '@mui/material';
import { useFormContext } from 'react-hook-form';

import { BasicTextInput, SelectInput } from '@/components/forms/inputs';

export default function DiagnosisStep() {
    const {
        register,
        control,
        formState: { errors },
    } = useFormContext();

    return (
        <Grid container spacing={1} sx={{ p: 1 }}>
            
            <Grid size={12}>
                <Typography variant='h4' sx={{ pb: 1 }}>
                    Información clínica
                </Typography>
            </Grid>

            <Grid size={12}>
                <BasicTextInput
                    label='Nombre del diagnóstico'
                    name='diagnosis.name'
                    register={register}
                    rules={{ required: 'El nombre es obligatorio' }}
                    errors={errors}
                />
            </Grid>

            <Grid size={12}>
                <SelectInput
                    control={control}
                    errors={errors}
                    name='diagnosis.severity'
                    label='Gravedad'
                    rules={{ required: 'La gravedad es obligatoria' }}
                    items={{
                        LOW: 'Baja',
                        MODERATE: 'Moderada',
                        HIGH: 'Alta',
                        CRITICAL: 'Crítica',
                    }}
                />
            </Grid>

            <Grid size={12}>
                <SelectInput
                    control={control}
                    errors={errors}
                    name='diagnosis.clinicalStatus'
                    label='Estado'
                    rules={{ required: 'El estado es obligatorio' }}
                    items={{
                        ACTIVE: 'Activo',
                        CHRONIC: 'Crónico',
                    }}
                />
            </Grid>

            <Grid size={12}>
                <BasicTextInput
                    label='Descripción'
                    name='diagnosis.description'

                    errors={errors}
                    others={{ multiline: true, rows: 3 }}
                />
            </Grid>

            <Grid size={12}>
                <Typography variant='h4' sx={{ pb: 1 }}>
                    Detalles
                </Typography>
            </Grid>

            <Grid size={12}>
                <BasicTextInput
                    label='Notas (opcional)'
                    name='diagnosis.notes'
                    register={register}
                    errors={errors}
                    others={{ multiline: true, rows: 4 }}
                />
            </Grid>

        </Grid>
    );
}