import { useState, useEffect } from 'react';
import { Tabs, Box, Tab } from '@mui/material';

import { TableTopBar } from '@/components/tables/index';
import { ContentLayout } from '@/components/layout/index';

import { useAppointments } from '@appointments/hooks/useAppointments';
import AppointmentsTable from '@appointments/components/views/AppointmentsTable';
import AppointmentsCalendar from '@appointments/components/views/AppointmentsCalendar';
import AppointmentsTableToolbar from '@/features/appointments/components/ui/AppointmentsTableToolBar';
import { CustomCircularProgress } from '@/components/feedback';
import { useMyAppointments } from '@/features/appointments/hooks/useMyAppointments';
import { useAuth } from '@/app/AuthContext';

export default function AppointmentsPage() {
    const { data: appointments, isLoading: appointmentsIsLoading, error: appointmentsFetchError } = useAppointments();
    const {
        data: myAppointments,
        isLoading: myAppointmentsIsLoading,
        error: myAppointmentsFetchError,
    } = useMyAppointments();

    if (appointmentsFetchError || myAppointmentsFetchError) return <p>Error al cargar citas</p>;
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
                    <Tabs value={viewMode} onChange={(e, value) => setViewMode(value)}>
                        <Tab label='Tabla' value='table' />
                        <Tab label='Calendario' value='calendar' />
                    </Tabs>
                }
                right={<AppointmentsTableToolbar searchText={searchText} setSearchText={setSearchText} />}
            />

            {(appointmentsIsLoading || myAppointmentsIsLoading) ? (
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
                        <AppointmentsCalendar appointments={myAppointments} setError={setError} />
                    )}
                </Box>
            )}
        </ContentLayout>
    );
}
