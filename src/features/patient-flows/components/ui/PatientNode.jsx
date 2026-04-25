import BaseFlowNode from '@patient-flows/components/ui/BaseFlowNode';
export function PatientNode({ data, color = 'primary' }) {
    if (data.type === 'CREATED') color = 'success';
    else if (data.type === 'DEACTIVATED') color = 'error';

    return <BaseFlowNode data={data} color={color} />;
}
