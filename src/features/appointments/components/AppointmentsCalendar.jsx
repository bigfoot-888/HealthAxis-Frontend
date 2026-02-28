import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import esLocale from '@fullcalendar/core/locales/es';
import { Paper } from '@mui/material';

export default function AppointmentsCalendar({ appointments }) {
    if (appointments) console.log(appointments);
    const events = appointments.map((a) => ({
        id: a.uuid,
        title: a.patient.fullName,
        start: a.start_time,
    }));

    return (
        <Paper variant='surface-form-outlined' sx={{ p: 4 }}>
            <FullCalendar
                locale={esLocale}
                plugins={[dayGridPlugin, timeGridPlugin]}
                initialView='timeGridWeek'
                events={events}
                height='auto'
            />
        </Paper>
    );
}
