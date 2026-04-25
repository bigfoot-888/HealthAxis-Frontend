import { usePatientFlow } from '@patient-flows/hooks/usePatientFlow';
import PatientFlow from '@patient-flows/components/views/PatientFlow';
import { useParams } from 'react-router';
import { CustomCircularProgress } from '@/components/feedback';

export default function PatientFlowPage() {
    const { uuid } = useParams(); 
    const { data: flow, isLoading, error, refetch } = usePatientFlow(uuid);
    if (error) return <p>Failed to load flow</p>;
    if (isLoading) return <CustomCircularProgress />;
    return <PatientFlow flow={flow} refetch={refetch} patientUuid={uuid} />;
}
