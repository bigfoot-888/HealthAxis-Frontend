import { useState } from 'react';
import { Tabs, Box, Tab } from '@mui/material';

import {BasicTableSkeleton} from '@/components/tables/index';
import {ContentLayout} from '@/components/layout/index';

import { useAppointments } from '@appointments/hooks/useAppointments';
import AppointmentsTable from '@appointments/components/views/AppointmentsTable';
import AppointmentsCalendar from '@appointments/components/views/AppointmentsCalendar'

export default function AppointmentManagement() {
    const { data: appointments, isLoading, error: fetchError, refetch } = useAppointments();
    if (fetchError) return <p>Failed to load appointments</p>;
    const [viewMode, setViewMode] = useState('table'); 
    const [error, setError] = useState(null); 
    return (
        <ContentLayout>
            {/* Tabs for switching between table and calendar */}
            <Tabs value={viewMode} onChange={(e, value) => setViewMode(value)} sx={{ mb: 2 }}>
                <Tab label='Tabla' value='table' />
                <Tab label='Calendario' value='calendar' />
            </Tabs>

            {/* Content area */}
            {isLoading ? (
                <BasicTableSkeleton />
            ) : (
                <Box sx={{ mt: 2 }}>
                    {viewMode === 'table' ? (
                        <AppointmentsTable appointments={appointments} setError={setError}/>
                    ) : (
                        <AppointmentsCalendar appointments={appointments} setError={setError}/>
                    )}
                </Box>
            )}
        </ContentLayout>
    );
}
