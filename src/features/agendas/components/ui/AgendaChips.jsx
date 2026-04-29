import { AGENDA_STATUS_CONFIG, AGENDA_PERIOD_STATUS_CONFIG, AGENDA_PERIOD_AGENDA_STATUS_CONFIG } from '@/shared/constants/agenda.constants';
import { Chip } from '@mui/material';

export function AgendaStatusChip({ value }) {
    return (
        <Chip
            label={AGENDA_STATUS_CONFIG[value].label || value}
            color={AGENDA_STATUS_CONFIG[value].color || 'default'}
            size='small'
        />
    );
}

export function AgendaPeriodStatusChip({ value }) {
    return (
        <Chip
            label={AGENDA_PERIOD_STATUS_CONFIG[value].label || value}
            color={AGENDA_PERIOD_STATUS_CONFIG[value].color || 'default'}
            size='small'
        />
    );
}

export function AgendaPeriodAgendaStatusChip({ value }) {
    return (
        <Chip
            label={AGENDA_PERIOD_AGENDA_STATUS_CONFIG[value].label || value}
            color={AGENDA_PERIOD_AGENDA_STATUS_CONFIG[value].color || 'default'}
            size='small'
        />
    );
}