import { useState } from 'react';

import AgendaInfoCard from '@agendas/components/ui/AgendaInfoCard';
import AgendaPeriodsTable from '@agendas/components/views/AgendaPeriodsTable';

import EditAgendaForm from '@agendas/components/forms/EditAgendaForm';
import CreateAgendaPeriodForm from '@/features/agendas/components/forms/CreateAgendaPeriodForm';

import { ContentLayout } from '@/components/layout';
import { Box } from '@mui/material';
import { useParams } from 'react-router';

import { useAgenda } from '@agendas/hooks/useAgenda';

import { DetailSectionHeader } from '@/components/ui';
import { AppBreadcrumbs } from '@/components/navigation';
import { useUsersByAgenda } from '@users/hooks/useUsersByAgenda';

import AgendaUsersTable from '@/features/users/components/views/AgendaUsersTable';
import { CustomCircularProgress } from '@/components/feedback';
import { DetailLayout } from '@/components/entity-detail';
import Error from '@/components/feedback/Error';

export default function AgendaDetailPage() {
    const { uuid } = useParams();
    const { data: agenda, isLoading: agendaIsLoading, error: agendaFetchError } = useAgenda(uuid);
    const { data: users, isLoading: usersIsLoading, error: usersFetchError } = useUsersByAgenda(uuid);

    const [agendaToEdit, setAgendaToEdit] = useState(null);
    const [agendaForNewPeriod, setAgendaForNewPeriod] = useState(null);

    if (agendaIsLoading || usersIsLoading) return <CustomCircularProgress />;
    if (agendaFetchError || usersFetchError) return <Error msg='Error al cargar la agenda' />;

    return (
        <>
            {agendaToEdit && <EditAgendaForm agenda={agendaToEdit} handleClose={() => setAgendaToEdit(null)} />}

            {agendaForNewPeriod && (
                <CreateAgendaPeriodForm agenda={agendaForNewPeriod} handleClose={() => setAgendaForNewPeriod(null)} />
            )}

            <ContentLayout>
                <DetailLayout>
                    <AppBreadcrumbs items={[{ label: 'Agendas', to: '/agendas' }, { label: `${agenda.name}` }]} />
                    <Box>
                        <DetailSectionHeader label='Información de la Agenda' marginTop={false} />
                        <AgendaInfoCard
                            agenda={agenda}
                            onEdit={setAgendaToEdit}
                            onCreatePeriod={setAgendaForNewPeriod}
                        />
                    </Box>
                    <Box>
                        <DetailSectionHeader label='Periodos asociados' />
                        <AgendaPeriodsTable periods={agenda.periods || []} />
                    </Box>
                    <Box>
                        <DetailSectionHeader label='Usuarios asociados' />
                        <AgendaUsersTable users={users} />
                    </Box>
                </DetailLayout>
            </ContentLayout>
        </>
    );
}
