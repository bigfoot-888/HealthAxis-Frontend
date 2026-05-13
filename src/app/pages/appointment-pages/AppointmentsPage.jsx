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
import Error from '@/components/feedback/Error';

export default function AppointmentsPage() {
    const { data: appointments, isLoading: appointmentsIsLoading, error: appointmentsFetchError } = useAppointments();
    const {
        data: myAppointments,
        isLoading: myAppointmentsIsLoading,
        error: myAppointmentsFetchError,
    } = useMyAppointments();

    if (appointmentsFetchError || myAppointmentsFetchError) return <Error msg='Error al cargar citas' />;
    const [viewMode, setViewMode] = useState('table');
    const [error, setError] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [todayOnly, setTodayOnly] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(searchText), 300);
        return () => clearTimeout(t);
    }, [searchText]);

    useEffect(() => {
        if (viewMode === 'calendar') 
            setTodayOnly(false);
    }, [viewMode]);

    return (
        <ContentLayout error={error} onErrorClose={() => setError(null)}>
            <TableTopBar
                left={
                    <Tabs
                        value={viewMode}
                        onChange={(e, value) => setViewMode(value)}
                        sx={{
                            borderBottom: 1,
                            borderColor: 'divider',
                        }}
                    >
                        <Tab label='Tabla' value='table' />
                        <Tab label='Calendario' value='calendar' />
                    </Tabs>
                }
                right={
                    <AppointmentsTableToolbar
                        searchText={searchText}
                        setSearchText={setSearchText}
                        todayOnly={todayOnly}
                        setTodayOnly={setTodayOnly}
                        viewMode={viewMode}
                    />
                }
            />

            {appointmentsIsLoading || myAppointmentsIsLoading ? (
                <CustomCircularProgress />
            ) : (
                <Box sx={{ mt: 0 }}>
                    {viewMode === 'table' ? (
                        <AppointmentsTable
                            appointments={appointments}
                            setError={setError}
                            searchText={debouncedSearch}
                            todayOnly={todayOnly}
                        />
                    ) : (
                        <AppointmentsCalendar appointments={myAppointments} setError={setError} />
                    )}
                </Box>
            )}
        </ContentLayout>
    );
}
