import { useParams } from 'react-router';
import TreatmentInfoCard from '@treatments/components/ui/TreatmentInfoCard';
import PatientSummaryCard from '@patients/components/ui/PatientSummaryCard';
import AppointmentSummaryCard from '@appointments/components/ui/AppointmentSummaryCard';
import DiagnosisSummaryCard from '@diagnoses/components/ui/DiagnosisSummaryCard';

import { ContentLayout } from '@/components/layout';
import { CustomCircularProgress } from '@/components/feedback';
import { useTreatment } from '@treatments/hooks/useTreatment';
import { Box, Stack, Grid, Divider } from '@mui/material';
import UserSummaryCard from '@users/components/ui/UserSummaryCard';
import DetailSectionHeader from '@/components/ui/DetailSectionHeader';
import { RelatedEntityContainer } from '@/components/ui';
import { DetailLayout } from '@/components/entity-detail';
import Error from '@/components/feedback/Error';

export default function TreatmentDetailPage() {
    const { uuid } = useParams();
    const { data: treatment, isLoading, error: fetchError } = useTreatment(uuid);

    if (fetchError) return <Error msg='Error al cargar tratamiento' />;
    if (isLoading || !treatment) return <CustomCircularProgress />;

    const users = treatment.users || [];
    const hasMultipleUsers = users.length > 1;

    return (
        <ContentLayout drawer={false}>
            <DetailLayout>
                <Box>
                    <DetailSectionHeader label='Información del Tratamiento' marginTop={false} />
                    <TreatmentInfoCard treatment={treatment} />
                </Box>

                <Box>
                    <DetailSectionHeader label='Contexto Clínico' />
                    <Stack spacing={4}>
                        <Box>
                            <Grid container spacing={3}>
                                <Grid size={{ xs: 12, md: hasMultipleUsers ? 12 : 6 }}>
                                    <RelatedEntityContainer label='Paciente'>
                                        <PatientSummaryCard patient={treatment.patient} />
                                    </RelatedEntityContainer>
                                </Grid>

                                {users.map(user => (
                                    <Grid key={user.uuid} size={{ xs: 12, md: 6 }}>
                                        <RelatedEntityContainer label='Profesional involucrado'>
                                            <UserSummaryCard user={user} />
                                        </RelatedEntityContainer>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>

                        {(treatment.appointment || treatment.diagnosis) && (
                            <>
                                <Divider sx={{ borderStyle: 'dashed', borderColor: 'outlineVariant' }} />
                                <Box>
                                    <Grid container spacing={3}>
                                        {treatment.diagnosis && (
                                            <Grid size={{ xs: 12, md: 6 }}>
                                                <RelatedEntityContainer label='Diagnóstico asociado'>
                                                    <DiagnosisSummaryCard diagnosis={treatment.diagnosis} />
                                                </RelatedEntityContainer>
                                            </Grid>
                                        )}
                                        {treatment.appointment && (
                                            <Grid size={{ xs: 12, md: 6 }}>
                                                <RelatedEntityContainer label='Cita de origen'>
                                                    <AppointmentSummaryCard appointment={treatment.appointment} />
                                                </RelatedEntityContainer>
                                            </Grid>
                                        )}
                                    </Grid>
                                </Box>
                            </>
                        )}
                    </Stack>
                </Box>
            </DetailLayout>
        </ContentLayout>
    );
}
