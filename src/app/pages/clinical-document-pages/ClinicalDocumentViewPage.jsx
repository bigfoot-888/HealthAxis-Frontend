import { useClinicalDocument } from '@clinical-documents/hooks/useClinicalDocument';
import ClinicalDocumentView from '@clinical-documents/components/views/ClinicalDocumentView';
import { useParams } from 'react-router';
import { CustomCircularProgress } from '@/components/feedback';
import Error from '@/components/feedback/Error';

export default function ClinicalDocumentViewPage() {
    const { uuid } = useParams();
    const { data: clinicalDocument, isLoading, error } = useClinicalDocument(uuid);
    if (error) return <Error msg="Error al cargar el documento"/>
    if (isLoading) return <CustomCircularProgress />;
    return <ClinicalDocumentView clinicalDocument={clinicalDocument} />;
}
