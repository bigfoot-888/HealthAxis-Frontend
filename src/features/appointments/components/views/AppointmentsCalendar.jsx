import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import esLocale from '@fullcalendar/core/locales/es';
import { Paper } from '@mui/material';
import { useNavigate } from 'react-router';

export default function AppointmentsCalendar({ appointments }) {
    const navigate = useNavigate(); 
    const events = appointments.map((a) => ({
        id: a.uuid,
        title: a.patient.fullName,
        start: a.startTime,
    }));

    return (
        <Paper variant='surface-form-outlined' sx={{ p: 4 }}>
            <FullCalendar
                locale={esLocale}
                plugins={[dayGridPlugin, timeGridPlugin]}
                initialView='timeGridWeek'
                events={events}
                height='auto'
                eventDidMount={(info) => {
                    info.el.style.cursor = 'pointer';
                }}
                eventClick={(info) => {
                    const appointmentId = info.event.id;
                    navigate(`/appointments/${appointmentId}`);
                }}
            />
        </Paper>
    );
}
