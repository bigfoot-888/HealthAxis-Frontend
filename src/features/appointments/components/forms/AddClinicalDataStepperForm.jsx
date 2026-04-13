import HorizontalStepperDialog from '@/components/dialogs/HorizontalStepperDialog';
import { useState } from 'react';
import DiagnosisStep from '@appointments/components/forms/DiagnosisStep';
import { useForm } from 'react-hook-form';
import { FormProvider } from 'react-hook-form';
import TreatmentStep from '@appointments/components/forms/TreatmentStep';
import SummaryStep from '@appointments/components/forms/SummaryStep';
import { handleApiError } from '@/utils/handle-errors';
import {completeAppointmentWithClinicalData} from '@appointments/api/appointment.api'
import { useAppointments } from '@appointments/hooks/useAppointments';

export default function AddClinicalDataStepperForm({ appointment, open, handleClose }) {
    const [error, setError] = useState(null);
    const { refetch } = useAppointments();

    const onSubmit = async (data) => {
        try {
            await completeAppointmentWithClinicalData(appointment.uuid, data);
            refetch();
            handleClose(); 
        } catch (err) {
            handleApiError(err, setError, null);
        }
    };
    const methods = useForm({
        defaultValues: {
            diagnosis: {
                name: '',
                severity: '',
                clinicalStatus: '',
                description: '',
                notes: '',
            },
            treatments: [
                {
                    name: '',
                    clinicalStatus: '',
                    description: '',
                    duration: '',
                    notes: '',
                },
            ],
        },
    });

    const steps = [
        {
            label: 'Añadir diagnóstico',
            isOptional: false,
            isValid: async () => {
                return true;
            },
            content: <DiagnosisStep />,
        },
        {
            label: 'Añadir tratamiento',
            isOptional: false,
            isValid: async () => {
                // const values = methods.getValues('treatments');

                // if (!values.length) return false;

                // return await methods.trigger(
                //     values.flatMap((_, i) => [`treatments.${i}.name`, `treatments.${i}.state`]),
                // );
                return true; 
            },
            content: <TreatmentStep />,
        },
        {
            label: 'Resumen',
            isOptional: false,
            isValid: async () => {return true},
            content: <SummaryStep/>
        },
    ];

    return (
        <FormProvider {...methods}>
            <HorizontalStepperDialog
                open={open}
                handleClose={handleClose}
                handleSubmit={methods.handleSubmit(onSubmit)} 
                error={error}
                setError={() => setError}
                steps={steps}
            />
        </FormProvider>
    );
}
