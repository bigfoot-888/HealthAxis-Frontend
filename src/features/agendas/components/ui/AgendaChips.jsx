import {
    AGENDA_STATUS_LABELS,
    AGENDA_STATUS_COLORS,
    AGENDA_PERIOD_STATUS_LABELS,
    AGENDA_PERIOD_STATUS_COLORS,
    AGENDA_PERIOD_AGENDA_STATUS_LABELS,
    AGENDA_PERIOD_AGENDA_STATUS_COLORS
} from '@agendas/agenda-constants.js';
import { Chip } from '@mui/material';

export function AgendaStatusChip({ value }) {
    return (
        <Chip
            label={AGENDA_STATUS_LABELS[value] || value}
            color={AGENDA_STATUS_COLORS[value] || 'default'}
            size='small'
        />
    );
}

export function AgendaPeriodStatusChip({ value }) {
    return (
        <Chip
            label={AGENDA_PERIOD_STATUS_LABELS[value] || value}
            color={AGENDA_PERIOD_STATUS_COLORS[value] || 'default'}
            size='small'
        />
    );
}

export function AgendaPeriodAgendaStatusChip({ value }) {
    return (
        <Chip
            label={AGENDA_PERIOD_AGENDA_STATUS_LABELS[value] || value}
            color={AGENDA_PERIOD_AGENDA_STATUS_COLORS[value] || 'default'}
            size='small'
        />
    );
}