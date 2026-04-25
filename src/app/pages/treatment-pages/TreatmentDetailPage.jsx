import TreatmentInfoCard from '@treatments/components/ui/TreatmentInfoCard';
import PatientSummaryCard from '@patients/components/ui/PatientSummaryCard';
import AppointmentSummaryCard from '@appointments/components/ui/AppointmentSummaryCard';
import DiagnosisSummaryCard from '@diagnoses/components/ui/DiagnosisSummaryCard';

import { useTreatment } from '@treatments/hooks/useTreatment';

import { useParams } from 'react-router';
import { useState } from 'react';

import { ContentLayout } from '@/components/layout';
import { AppBreadcrumbs } from '@/components/navigation';
import { CustomCircularProgress } from '@/components/feedback';

import { Grid } from '@mui/material';

export default function TreatmentDetailPage() {
    const { uuid } = useParams();

    const { data: treatment, isLoading, error: fetchError } = useTreatment(uuid);

    const [error, setError] = useState(null);

    if (fetchError) return <p>Error al cargar tratamiento</p>;
    if (isLoading || !treatment) return <CustomCircularProgress />;

    return (
        <ContentLayout error={error} onErrorClose={() => setError(null)} drawer={false}>
            <Grid container spacing={2}>
                <Grid size={12}>
                    <TreatmentInfoCard treatment={treatment} />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <PatientSummaryCard patient={treatment.patient} />
                </Grid>

                {treatment.diagnosis && (
                    <Grid size={{ xs: 12, md: 6 }}>
                        <DiagnosisSummaryCard diagnosis={treatment.diagnosis} />
                    </Grid>
                )}

                {treatment.appointment && (
                    <Grid size={{ xs: 12, md: 6 }}>
                        <AppointmentSummaryCard appointment={treatment.appointment} />
                    </Grid>
                )}
            </Grid>
        </ContentLayout>
    );
}
