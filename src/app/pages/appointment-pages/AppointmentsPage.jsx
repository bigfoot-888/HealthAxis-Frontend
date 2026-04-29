import { useState, useEffect } from 'react';
import { Tabs, Box, Tab } from '@mui/material';

import { TableTopBar } from '@/components/tables/index';
import { ContentLayout } from '@/components/layout/index';

import { useAppointments } from '@appointments/hooks/useAppointments';
import AppointmentsTable from '@appointments/components/views/AppointmentsTable';
import AppointmentsCalendar from '@appointments/components/views/AppointmentsCalendar';
import AppointmentsTableToolbar from '@/features/appointments/components/ui/AppointmentsTableToolBar';
import { CustomCircularProgress } from '@/components/feedback';

export default function AppointmentsPage() {
    const { data: appointments, isLoading, error: fetchError, refetch } = useAppointments();
    if (fetchError) return <p>Error al cargar citas</p>;
    const [viewMode, setViewMode] = useState('table');
    const [error, setError] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(searchText), 300);
        return () => clearTimeout(t);
    }, [searchText]);
    
    return (
        <ContentLayout error={error} onErrorClose={() => setError(null)}>
            <TableTopBar
                left={
                    <Tabs value={viewMode} onChange={(e, value) => setViewMode(value)} >
                        <Tab label='Tabla' value='table' />
                        <Tab label='Calendario' value='calendar' />
                    </Tabs>
                }
                right={<AppointmentsTableToolbar searchText={searchText} setSearchText={setSearchText} />}
            />

            {isLoading ? (
                <CustomCircularProgress />
            ) : (
                <Box sx={{ mt: 0 }}>
                    {viewMode === 'table' ? (
                        <AppointmentsTable
                            appointments={appointments}
                            setError={setError}
                            searchText={debouncedSearch}
                        />
                    ) : (
                        <AppointmentsCalendar appointments={appointments} setError={setError} />
                    )}
                </Box>
            )}
        </ContentLayout>
    );
}
