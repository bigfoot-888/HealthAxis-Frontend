import { useClinicalDocuments } from '@clinical-documents/hooks/useClinicalDocuments';
import ClinicalDocumentsTable from '@clinical-documents/components/views/ClinicalDocumentsTable';
import Skeleton from '@mui/material/Skeleton';

export default function ClinicalDocumentManagement() {
    const { data: clinicalDocuments, isLoading, error, refetch } = useClinicalDocuments();
    if (error) return <p>Failed to load users</p>;
    if (!isLoading) return <ClinicalDocumentsTable clinicalDocuments={clinicalDocuments} />;
    else return <Skeleton variant=""></Skeleton>
}
