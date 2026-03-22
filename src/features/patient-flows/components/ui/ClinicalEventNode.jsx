import { Typography } from '@mui/material';
import { Box } from '@mui/material';
import { Handle, Position} from '@xyflow/react';
import BasicNodeContainer from '@patient-flows/components/ui/BasicNodeContainer';

export function DiagnosisNode(node) {
    return (
        <BasicNodeContainer color="secondary">
            <Typography>{node.data.label}</Typography>
            <Handle type='source' position={Position.Right} />
            <Handle type='target' position={Position.Left} />
        </BasicNodeContainer>
    );
}
export function TreatmentNode(node) {
    return (
        <BasicNodeContainer color="secondary">
            <Typography>{node.data.label}</Typography>
            <Handle type='source' position={Position.Right} />
            <Handle type='target' position={Position.Left} />
        </BasicNodeContainer>
    );
}
export function AppointmentNode(node) {
    return (
        <BasicNodeContainer color="secondary">
            <Typography>{node.data.label}</Typography>
            <Handle type='source' position={Position.Right} />
            <Handle type='target' position={Position.Left} />
        </BasicNodeContainer>
    );
}
export function ClinicalDocumentNode(node) {
    return (
        <BasicNodeContainer color="secondary">
            <Typography>{node.data.label}</Typography>
            <Handle type='source' position={Position.Right} />
            <Handle type='target' position={Position.Left} />
        </BasicNodeContainer>
    );
}
