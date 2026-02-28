import { useAppointments } from '../hooks/useAppointments';
import AppointmentsTable from './AppointmentsTable';
import Skeleton from '@mui/material/Skeleton';
import BasicTableSkeleton from '../../../components/tables/BasicTableSkeleton';
import { useState } from 'react';
import { Tabs, Box, Tab } from '@mui/material';
import AppointmentsCalendar from './AppointmentsCalendar'
import ContentLayout from '../../../components/layout/ContentLayout';

export default function AppointmentManagement() {
    const { data: appointments, isLoading, error: fetchError, refetch } = useAppointments();
    if (fetchError) return <p>Failed to load appointments</p>;
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'calendar'
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
                        <AppointmentsTable appointments={appointments} />
                    ) : (
                        <AppointmentsCalendar appointments={appointments} />
                    )}
                </Box>
            )}
        </ContentLayout>
    );
}
