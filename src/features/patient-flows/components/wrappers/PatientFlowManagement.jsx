import { usePatientFlow } from '@patient-flows/hooks/usePatientFlow';
import Skeleton from '@mui/material/Skeleton';
import PatientFlow from '@patient-flows/components/views/PatientFlow';
import { useParams } from 'react-router';
export default function PatientFlowManagement() {
    const { uuid } = useParams(); // this is the uuid from the URL
    const { data: flow, isLoading, error, refetch } = usePatientFlow(uuid);
    if (isLoading) return <Skeleton variant='rectangular' height={400} />;
    if (error) return <p>Failed to load flow</p>;
    if (!flow) return <p>No flow found</p>;
    return <PatientFlow flow={flow} />;
}
