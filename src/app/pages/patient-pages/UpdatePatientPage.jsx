import { CustomCircularProgress } from '@/components/feedback';
import { usePatient } from '@patients/hooks/usePatient';
import UpdatePatientForm from '@patients/components/forms/UpdatePatientForm';
import { useParams } from 'react-router';
export default function UpdatePatientPage() {
    const { uuid } = useParams(); 
    const { data: patient, isLoading, error } = usePatient(uuid);
    if (error) return <p>Failed to load users</p>;
    if (isLoading) {
        return <CustomCircularProgress />;
    }
    return <UpdatePatientForm patient={patient} uuid={uuid} />;
}
