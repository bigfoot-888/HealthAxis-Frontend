import DiagnosisInfoCard from '@diagnoses/components/ui/DiagnosisInfoCard';
import PatientSummaryCard from '@patients/components/ui/PatientSummaryCard';
import AppointmentSummaryCard from '@appointments/components/ui/AppointmentSummaryCard';
import DiagnosisTreatmentsTable from '@treatments/components/views/DiagnosisTreatmentsTable';

import { useDiagnosis } from '@diagnoses/hooks/useDiagnosis';
import { useTreatmentsByDiagnosis } from '@treatments/hooks/useTreatmentsByDiagnosis';

import { useParams } from 'react-router';
import { useState } from 'react';

import { ContentLayout } from '@/components/layout';
import { AppBreadcrumbs } from '@/components/navigation';
import { CustomCircularProgress } from '@/components/feedback';

import { Grid } from '@mui/material';

export default function DiagnosisDetailPage() {
    const { uuid } = useParams();

    const { data: diagnosis, isLoading: diagnosisIsLoading, error: diagnosisFetchError } = useDiagnosis(uuid);
    const {
        data: treatments,
        isLoading: treatmentsIsLoading,
        error: treatmentsFetchError,
    } = useTreatmentsByDiagnosis(uuid);

    const [error, setError] = useState(null);

    if (treatmentsFetchError || diagnosisFetchError) return <p>Error al cargar diagnóstico</p>;
    if (diagnosisIsLoading || treatmentsIsLoading || !diagnosis) return <CustomCircularProgress />;

    return (
        <ContentLayout error={error} onErrorClose={() => setError(null)} drawer={false}>
            <Grid container spacing={2}>
                <Grid size={12}>
                    <DiagnosisInfoCard diagnosis={diagnosis} />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <PatientSummaryCard patient={diagnosis.patient} />
                </Grid>

                {diagnosis.appointment && (
                    <Grid size={{ xs: 12, md: 6 }}>
                        <AppointmentSummaryCard appointment={diagnosis.appointment} />
                    </Grid>
                )}

                <Grid size={12}>
                    <DiagnosisTreatmentsTable treatments={treatments} />
                </Grid>
            </Grid>
        </ContentLayout>
    );
}
