import { ContentLayout } from '@/components/layout';
import { useAgenda } from '@agendas/hooks/useAgenda';
import { CustomCircularProgress } from '@/components/feedback';
import { AppBreadcrumbs } from '@/components/navigation';
import { Tabs, Tab, Box } from '@mui/material';
import { useState } from 'react';
import { Outlet, Link, useParams } from 'react-router';
import { DetailLayout } from '@/components/entity-detail';

export default function AgendaDetailWrapper() {
    const { uuid } = useParams();
    const { data: agenda, isLoading, error: fetchError, refetch: refetchAgenda } = useAgenda(uuid);
    const [error, setError] = useState(null);
    const currentTab = location.pathname.split('/').pop();

    if (fetchError) return <p>Error al cargar la agenda.</p>;
    if (isLoading || !agenda) return <CustomCircularProgress />;

    return (
        <ContentLayout error={error} onErrorClose={() => setError(null)}>
            <DetailLayout>
                {agenda && (
                    <AppBreadcrumbs items={[{ label: 'Agendas', to: '/agendas' }, { label: `${agenda.name}` }]} />
                )}
                <Tabs value={currentTab}>
                    <Tab label='Agenda' value={uuid} component={Link} to='' />
                    <Tab label='Usuarios' value='users' component={Link} to='users' />
                </Tabs>

                <Box>
                    {isLoading && <CircularProgress />}
                    {agenda && <Outlet context={{ setError, agenda, uuid: agenda.uuid }} />}
                </Box>
            </DetailLayout>
        </ContentLayout>
    );
}
