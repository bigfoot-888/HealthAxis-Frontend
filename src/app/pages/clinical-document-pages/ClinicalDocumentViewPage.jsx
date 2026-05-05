import { useClinicalDocument } from '@clinical-documents/hooks/useClinicalDocument';
import ClinicalDocumentView from '@clinical-documents/components/views/ClinicalDocumentView';
import { useParams } from 'react-router';
import { CustomCircularProgress } from '@/components/feedback';

export default function ClinicalDocumentViewPage() {
    const { uuid } = useParams();
    const { data: clinicalDocument, isLoading, error, refetch } = useClinicalDocument(uuid);
    if (error) return <p>Error al cargar documento</p>;
    if (isLoading) return <CustomCircularProgress />;
    return <ClinicalDocumentView clinicalDocument={clinicalDocument} />;
}
