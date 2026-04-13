import { useState } from 'react';

import AgendaInfoCard from '@agendas/components/ui/AgendaInfoCard';
import AgendaPeriodsTable from '@agendas/components/views/AgendaPeriodsTable';

import EditAgendaForm from '@agendas/components/EditAgendaForm';
import CreateAgendaPeriodForm from '@agendas/components/CreatePeriodForm';

import { useAgendaContext } from '@agendas/hooks/useAgendaContext';

import { DetailLayout } from '@/components/entity-detail';
import { Stack } from '@mui/material';

export default function AgendaDetailPage() {
    const { setError, agenda } = useAgendaContext();

    const [agendaToEdit, setAgendaToEdit] = useState(null);
    const [agendaForNewPeriod, setAgendaForNewPeriod] = useState(null);

    if (!agenda) return null;

    return (
        <>
            {agendaToEdit && (
                <EditAgendaForm agenda={agendaToEdit} handleClose={() => setAgendaToEdit(null)} setError={setError} />
            )}

            {agendaForNewPeriod && (
                <CreateAgendaPeriodForm
                    agenda={agendaForNewPeriod}
                    handleClose={() => setAgendaForNewPeriod(null)}
                    setError={setError}
                />
            )}

            <DetailLayout>
                <Stack sx={{ p: { xs: 2, md: 3 }, width: '100%' }} spacing={3}>
                    <AgendaInfoCard agenda={agenda} onEdit={setAgendaToEdit} onCreatePeriod={setAgendaForNewPeriod} />

                    <AgendaPeriodsTable periods={agenda.periods || []} />
                </Stack>
            </DetailLayout>
        </>
    );
}
