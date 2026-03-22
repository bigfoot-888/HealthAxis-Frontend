import { useClinicalDocument } from '@clinical-documents/hooks/useClinicalDocument';
import ClinicalAttachmentView from '@clinical-documents/components/views/ClinicalAttachmentView'
import Skeleton from '@mui/material/Skeleton';
import { useParams } from 'react-router';

export default function ViewClinicalAttachmentsDocumentManagement() {
    const { uuid } = useParams(); // this is the uuid from the URL
    const { data: clinicalDocument, isLoading, error, refetch } = useClinicalDocument(uuid);
    if (error) return <p>Failed to load users</p>;
    if (!isLoading) return <ClinicalAttachmentView clinicalDocument={clinicalDocument} />;
    else return <Skeleton variant=""></Skeleton>
}
