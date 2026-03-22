import HorizontalStepperDialog from '@/components/dialogs/HorizontalStepperDialog';
import { useState } from 'react';
import { Box } from '@mui/material';
import { TextField } from '@mui/material';
import DiagnosisStepForm from '@appointments/components/forms/DiagnosisStepForm';
import { useForm } from 'react-hook-form';
import { FormProvider } from 'react-hook-form';
import TreatmentStepForm from '@appointments/components/forms/TreatmentStepForm';
import SummaryStep from '@appointments/components/forms/SummaryStep';

export default function AddClinicalDataStepperForm({ open, handleClose }) {
    const [error, setError] = useState(null);
    const onSubmit = () => {
        console.log('FORMULARIO STEPPER ENVIADO');
    };
    const methods = useForm({
        defaultValues: {
            diagnosis: {
                name: '',
                severity: '',
                state: '',
                description: '',
                notes: '',
            },
            treatments: [
                {
                    name: '',
                    state: '',
                    description: '',
                    duration: '',
                    notes: '',
                },
            ],
        },
    });
    // Define our steps array. Notice how we pass the isValid condition!
    const steps = [
        {
            label: 'Añadir diagnóstico',
            isOptional: false,
            isValid: async () => {
                return true;
            },
            content: <DiagnosisStepForm />,
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
            content: <TreatmentStepForm />,
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
                handleSubmit={onSubmit}
                error={error}
                setError={() => setError}
                steps={steps}
            />
        </FormProvider>
    );
}
