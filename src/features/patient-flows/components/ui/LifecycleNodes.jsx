import { useCallback } from 'react';
import { Position, Handle } from '@xyflow/react';
import { Box, Typography } from '@mui/material';
import BasicNodeContainer from '@patient-flows/components/ui/BasicNodeContainer';

export function RegistrationNode() {
    return (
        <BasicNodeContainer color='primary'>
            <Typography>Paciente dado de alta</Typography>
            <Handle type='source' position={Position.Right} />
            <Handle type='target' position={Position.Left} />
        </BasicNodeContainer>
    );
}

export function DeactivationNode() {
    return (
        <BasicNodeContainer color='tertiary'>
            <Typography>Paciente dado de baja</Typography>
            <Handle type='source' position={Position.Right} />
            <Handle type='target' position={Position.Left} />
        </BasicNodeContainer>
    );
}

export function ReactivationNode() {
    return (
        <BasicNodeContainer color="secondary">
            <Typography>Paciente reactivado</Typography>
            <Handle type='source' position={Position.Right} />
            <Handle type='target' position={Position.Left} />
        </BasicNodeContainer>
    );
}
