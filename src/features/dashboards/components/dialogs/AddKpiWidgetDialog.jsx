import { useMemo } from 'react';

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack } from '@mui/material';

import { useForm } from 'react-hook-form';

import { BasicTextInput, SelectInput } from '@/components/forms/inputs';

import { PATIENT_STATUS_CONFIG } from '@/shared/constants/patient.constants';
import { APPOINTMENT_STATUS_CONFIG } from '@/shared/constants/appointment.constants';
import { DIAGNOSIS_CLINICAL_STATUS_CONFIG } from '@/shared/constants/diagnosis.constants';

import { TREATMENT_CLINICAL_STATUS_CONFIG } from '@/shared/constants/treatment.constants';

function mapOptionsToItems(options) {
    return Object.fromEntries(options.map((option) => [option.value, option.label]));
}

function mapStatusConfigToItems(config) {
    return Object.fromEntries(Object.entries(config).map(([key, value]) => [key, value.label]));
}

const ENTITY_OPTIONS = [
    { value: 'Patient', label: 'Pacientes' },
    { value: 'Appointment', label: 'Citas' }, 
    { value: 'Diagnosis', label: 'Diagnósticos' },
    { value: 'Treatment', label: 'Tratamientos' },
];

const WIDGET_TYPE_OPTIONS = [
    { value: 'KPI', label: 'KPI' },
    { value: 'LINE_CHART', label: 'Gráfico temporal' },
    { value: 'BAR_CHART', label: 'Gráfico de barras' },
];

const COLOR_OPTIONS = [
    { value: 'primary.main', label: 'Azul' },
    { value: 'success.main', label: 'Verde' },
    { value: 'warning.main', label: 'Amarillo' },
    { value: 'error.main', label: 'Rojo' },
];

const BAR_CHART_GROUP_BY_OPTIONS = {
    Patient: {
        status: 'Estado',
    },

    Appointment: {
        status: 'Estado',
    },

    Diagnosis: {
        severity: 'Gravedad',
        clinicalStatus: 'Estado clínico',
    },

    Treatment: {
        clinicalStatus: 'Estado clínico',
    },
};

const TEMPORAL_FIELD_OPTIONS = {
    Patient: {
        createdAt: 'Fecha de creación',
    },

    Appointment: {
        startTime: 'Fecha de inicio cita',
        createdAt: 'Fecha de creación',
    },

    Diagnosis: {
        createdAt: 'Fecha de creación',
        diagnosedAt: 'Fecha de diagnóstico'
    },

    Treatment: {
        createdAt: 'Fecha de creación',
    },
};

export default function AddWidgetDialog({ open, onClose, onSubmit }) {
    const {
        control,
        handleSubmit,
        watch,
        reset,
        register,
        formState: { errors },
    } = useForm({
        defaultValues: {
            title: '',
            type: 'KPI',
            entity: 'Patient',
            aggregation: 'COUNT',
            targetColumn: 'id',

            color: 'primary.main',

            filterType: 'none',
            statusValue: '',
            dateValue: 'today',

            groupBy: '',
            temporalField: 'createdAt',
            timeGrain: 'week',
        },
    });

    const filterType = watch('filterType');
    const entity = watch('entity');
    const widgetType = watch('type');

    const isBarChart = widgetType === 'BAR_CHART';

    const isLineChart = widgetType === 'LINE_CHART';

    const statusOptions = useMemo(() => {
        switch (entity) {
            case 'Patient':
                return mapStatusConfigToItems(PATIENT_STATUS_CONFIG);

            case 'Appointment':
                return mapStatusConfigToItems(APPOINTMENT_STATUS_CONFIG);

            case 'Diagnosis':
                return mapStatusConfigToItems(DIAGNOSIS_CLINICAL_STATUS_CONFIG);

            case 'Treatment':
                return mapStatusConfigToItems(TREATMENT_CLINICAL_STATUS_CONFIG);

            default:
                return {};
        }
    }, [entity]);

    const handleFormSubmit = (values) => {
        const filters = {};

        if (values.filterType === 'status' && values.statusValue) {
            if (values.entity === 'Patient' || values.entity === 'Appointment') {
                filters.status = values.statusValue;
            } else {
                filters.clinicalStatus = values.statusValue;
            }
        }

        if (values.filterType === 'date' && values.dateValue) {
            filters.date = values.dateValue;
        }

        onSubmit({
            title: values.title,
            type: values.type,
            entity: values.entity,
            aggregation: values.aggregation,
            targetColumn: values.targetColumn,
            filters,
            groupBy: isBarChart ? values.groupBy : isLineChart ? values.temporalField : undefined,
            timeGrain: isLineChart ? values.timeGrain : undefined,
            visuals: {
                color: values.color,
            },
        });

        reset();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
            <DialogTitle>Añadir componente</DialogTitle>

            <DialogContent>
                <Stack spacing={2} sx={{ mt: 1 }}>
                    <BasicTextInput
                        label='Título'
                        name='title'
                        type='text'
                        register={register}
                        errors={errors}
                        rules={{
                            required: 'El título es obligatorio',
                        }}
                    />

                    <SelectInput
                        name='type'
                        control={control}
                        label='Tipo de componente'
                        rules={{
                            required: 'El tipo de componente es obligatorio',
                        }}
                        items={mapOptionsToItems(WIDGET_TYPE_OPTIONS)}
                    />

                    <SelectInput
                        name='entity'
                        control={control}
                        label='Entidad'
                        rules={{
                            required: 'La entidad es obligatoria',
                        }}
                        items={mapOptionsToItems(ENTITY_OPTIONS)}
                    />

                    <SelectInput
                        name='color'
                        control={control}
                        label='Color'
                        items={mapOptionsToItems(COLOR_OPTIONS)}
                    />

                    {isBarChart && (
                        <SelectInput
                            name='groupBy'
                            control={control}
                            label='Agrupar por'
                            rules={{
                                required: 'El campo de agrupación es obligatorio',
                            }}
                            items={BAR_CHART_GROUP_BY_OPTIONS[entity] || {}}
                        />
                    )}

                    {isLineChart && (
                        <>
                            <SelectInput
                                name='temporalField'
                                control={control}
                                label='Campo temporal'
                                items={TEMPORAL_FIELD_OPTIONS[entity] || {}}
                            />

                            <SelectInput
                                name='timeGrain'
                                control={control}
                                label='Intervalo temporal'
                                items={{
                                    day: 'Día',
                                    week: 'Semana',
                                    month: 'Mes',
                                }}
                            />
                        </>
                    )}

                    <SelectInput
                        name='filterType'
                        control={control}
                        label='Filtro'
                        items={{
                            none: 'Sin filtro',
                            status: 'Por estado',
                            date: 'Por fecha',
                        }}
                    />

                    {filterType === 'status' && (
                        <SelectInput name='statusValue' control={control} label='Estado' items={statusOptions} />
                    )}

                    {filterType === 'date' && (
                        <SelectInput
                            name='dateValue'
                            control={control}
                            label='Rango temporal'
                            items={{
                                today: 'Hoy',
                                last_7_days: 'Últimos 7 días',
                            }}
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
