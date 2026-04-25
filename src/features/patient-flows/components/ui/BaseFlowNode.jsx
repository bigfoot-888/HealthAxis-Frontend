import { Box, Typography, Stack } from '@mui/material';
import { Handle, Position } from '@xyflow/react';
import { formatDateTimeUTC } from '@/utils/date-formatters';
import { translate } from '@/utils/translation.utils';

import PersonIcon from '@mui/icons-material/Person';
import EventIcon from '@mui/icons-material/Event';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import MedicationIcon from '@mui/icons-material/Medication';
import DescriptionIcon from '@mui/icons-material/Description';

const TYPE_COLORS = {
    PATIENT: 'primary.main',
    APPOINTMENT: 'info.main',
    DIAGNOSIS: 'warning.main',
    TREATMENT: 'success.main',
    CLINICAL_DOCUMENT: 'secondary.main',
    OTHER: 'divider',
};

const TYPE_ICONS = {
    PATIENT: PersonIcon,
    APPOINTMENT: EventIcon,
    DIAGNOSIS: MedicalInformationIcon,
    TREATMENT: MedicationIcon,
    CLINICAL_DOCUMENT: DescriptionIcon,
};

export default function BaseFlowNode({ data, selected, type }) {
    const borderColor = TYPE_COLORS[type] || 'divider';
    const Icon = TYPE_ICONS[type];

    return (
        <Box
            sx={(theme) => ({
                minWidth: 180,
                border: '1.5px solid',
                borderColor: selected ? 'primary.main' : borderColor,
                borderStyle: data.role === 'SECONDARY' ? 'dashed' : 'solid',
                borderRadius: 2,
                p: 1.5,
                backgroundColor: theme.palette.background.paper,
                boxShadow: selected ? 4 : 1,
                transition: 'all 0.2s ease',
                cursor: "pointer"
            })}
        >
            <Stack spacing={0.5}>
                <Stack direction='row' spacing={0.5} alignItems='flex-end'>
                    {Icon && <Icon fontSize='small' color='action' sx={{ position: 'relative', bottom: 2 }} />}

                    <Typography variant='caption' color='text.secondary'>
                        {translate(data.type)}
                    </Typography>
                </Stack>

                <Typography variant='body2' fontWeight={600}>
                    {data?.title ?? 'Sin título'}
                </Typography>

                {data?.date && (
                    <Typography variant='caption' color='text.secondary'>
                        {formatDateTimeUTC(data.date)}
                    </Typography>
                )}
            </Stack>

            <Handle id="left" type='target' position={Position.Left} />
            <Handle id="right" type='source' position={Position.Right} />
            <Handle id="top" type="target" position={Position.Top} />
            <Handle id="bottom" type="source" position={Position.Bottom} />
        </Box>
    );
}
