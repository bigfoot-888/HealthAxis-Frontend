import { useMemo } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, TextField, MenuItem } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { BasicTextInput } from '@/components/forms/inputs';

const ENTITY_OPTIONS = [
    { value: 'Patient', label: 'Pacientes' },
    { value: 'Appointment', label: 'Citas' },
    { value: 'Diagnosis', label: 'Diagnósticos' },
    { value: 'Treatment', label: 'Tratamientos' },
];

const COLOR_OPTIONS = [
    { value: 'primary.main', label: 'Azul' },
    { value: 'success.main', label: 'Verde' },
    { value: 'warning.main', label: 'Amarillo' },
    { value: 'info.main', label: 'Info' },
    { value: 'error.main', label: 'Rojo' },
];

export default function AddKpiWidgetDialog({ open, onClose, onSubmit }) {
    const { control, handleSubmit, watch, reset, register, formState: { errors }, } = useForm({
        defaultValues: {
            title: '',
            entity: 'Patient',
            aggregation: 'COUNT',
            targetColumn: 'id',
            color: 'primary.main',
            filterType: 'none',
            statusValue: '',
            dateValue: 'today',
        },
    });

    const filterType = watch('filterType');
    const entity = watch('entity');

    const statusOptions = useMemo(() => {
        switch (entity) {
            case 'Patient':
                return ['ACTIVE', 'INACTIVE'];
            case 'Appointment':
                return ['SCHEDULED', 'CHECKED_IN', 'COMPLETED', 'CANCELLED', 'NO_SHOW'];
            case 'Diagnosis':
                return ['VALID', 'VOID', 'ENTERED_IN_ERROR'];
            case 'Treatment':
                return ['VALID', 'VOID', 'ENTERED_IN_ERROR'];
            default:
                return [];
        }
    }, [entity]);

    const handleFormSubmit = (values) => {
        const filters = {};

        if (values.filterType === 'status' && values.statusValue) {
            filters.status = values.statusValue;
        }

        if (values.filterType === 'date' && values.dateValue) {
            filters.date = values.dateValue;
        }

        onSubmit({
            title: values.title,
            type: 'KPI',
            entity: values.entity,
            aggregation: values.aggregation,
            targetColumn: values.targetColumn,
            filters,
            visuals: {
                color: values.color,
            },
        });

        reset();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
            <DialogTitle>Añadir KPI</DialogTitle>

            <DialogContent>
                <Stack spacing={2} sx={{ mt: 1 }}>
                    <BasicTextInput
                        label='Título'
                        name='title'
                        type='text'
                        register={register}
                        errors={errors}
                        rules={{ required: true }}
                    />
                    <Controller
                        name='entity'
                        control={control}
                        render={({ field }) => (
                            <TextField {...field} select label='Entidad' fullWidth>
                                {ENTITY_OPTIONS.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}
                    />

                    <Controller
                        name='color'
                        control={control}
                        render={({ field }) => (
                            <TextField {...field} select label='Color' fullWidth>
                                {COLOR_OPTIONS.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}
                    />

                    <Controller
                        name='filterType'
                        control={control}
                        render={({ field }) => (
                            <TextField {...field} select label='Filtro' fullWidth>
                                <MenuItem value='none'>Sin filtro</MenuItem>
                                <MenuItem value='status'>Por estado</MenuItem>
                                <MenuItem value='date'>Por fecha</MenuItem>
                            </TextField>
                        )}
                    />

                    {filterType === 'status' && (
                        <Controller
                            name='statusValue'
                            control={control}
                            render={({ field }) => (
                                <TextField {...field} select label='Estado' fullWidth>
                                    {statusOptions.map((status) => (
                                        <MenuItem key={status} value={status}>
                                            {status}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />
                    )}

                    {filterType === 'date' && (
                        <Controller
                            name='dateValue'
                            control={control}
                            render={({ field }) => (
                                <TextField {...field} select label='Rango temporal' fullWidth>
                                    <MenuItem value='today'>Hoy</MenuItem>
                                    <MenuItem value='last_7_days'>Últimos 7 días</MenuItem>
                                </TextField>
                            )}
                        />
                    )}
                </Stack>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button variant='contained' onClick={handleSubmit(handleFormSubmit)}>
                    Añadir
                </Button>
            </DialogActions>
        </Dialog>
    );
}
