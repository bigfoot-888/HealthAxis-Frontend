import { useParams } from 'react-router';
import { useState } from 'react';

import DiagnosisInfoCard from '@diagnoses/components/ui/DiagnosisInfoCard';
import PatientSummaryCard from '@patients/components/ui/PatientSummaryCard';
import AppointmentSummaryCard from '@appointments/components/ui/AppointmentSummaryCard';
import DiagnosisTreatmentsTable from '@treatments/components/views/DiagnosisTreatmentsTable';

import { ContentLayout } from '@/components/layout';
import { CustomCircularProgress } from '@/components/feedback';
import DetailSectionHeader from '@/components/ui/DetailSectionHeader';
import { RelatedEntityContainer } from '@/components/ui';

import { useDiagnosis } from '@diagnoses/hooks/useDiagnosis';
import { useTreatmentsByDiagnosis } from '@treatments/hooks/useTreatmentsByDiagnosis';

import { Box, Stack, Grid, Divider } from '@mui/material';
import { DetailLayout } from '@/components/entity-detail';
import UserSummaryCard from '@/features/users/components/ui/UserSummaryCard';
import Error from '@/components/feedback/Error';

export default function DiagnosisDetailPage() {
    const { uuid } = useParams();
    const [error, setError] = useState(null);

    const { data: diagnosis, isLoading: diagnosisIsLoading, error: diagnosisFetchError } = useDiagnosis(uuid);

    const {
        data: treatments,
        isLoading: treatmentsIsLoading,
        error: treatmentsFetchError,
    } = useTreatmentsByDiagnosis(uuid);

    if (treatmentsFetchError || diagnosisFetchError) return <Error msg="Error al cargar el diagnóstico"/>
    if (diagnosisIsLoading || treatmentsIsLoading || !diagnosis) return <CustomCircularProgress />;

    const users = diagnosis.users || [];
    const hasMultipleUsers = users.length > 1;

    return (
        <ContentLayout error={error} onErrorClose={() => setError(null)} drawer={false}>
            <DetailLayout>
                <Box>
                    <DetailSectionHeader label='Información del Diagnóstico' marginTop={false} />
                    <DiagnosisInfoCard diagnosis={diagnosis} />
                </Box>

                <Box>
                    <DetailSectionHeader label='Contexto Clínico' />
                    <Stack spacing={3}>
                        <Box>
                            <Grid container spacing={3}>
                                <Grid size={{ xs: 12, md: hasMultipleUsers ? 12 : 6 }}>
                                    <RelatedEntityContainer label='Paciente'>
                                        <PatientSummaryCard patient={diagnosis.patient} />
                                    </RelatedEntityContainer>
                                </Grid>

                                {users.map((user) => (
                                    <Grid key={user.uuid} size={{ xs: 12, md: 6 }}>
                                        <RelatedEntityContainer label='Profesional involucrado'>
                                            <UserSummaryCard user={user} />
                                        </RelatedEntityContainer>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                        {diagnosis.appointment && (
                            <>
                                <Divider sx={{ borderStyle: 'dashed', borderColor: 'outlineVariant' }} />
                                <Box>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <RelatedEntityContainer label='Cita de origen'>
                                            <AppointmentSummaryCard appointment={diagnosis.appointment} />
                                        </RelatedEntityContainer>
                                    </Grid>
                                </Box>
                            </>
                        )}
                    </Stack>
                </Box>

                {treatments && (
                    <Box>
                        <DetailSectionHeader label='Tratamientos Asociados' />
                        <Box sx={{ px: 1 }}>
                            <DiagnosisTreatmentsTable treatments={treatments} diagnosis={diagnosis} />
                        </Box>
                    </Box>
                )}
            </DetailLayout>
        </ContentLayout>
    );
}
