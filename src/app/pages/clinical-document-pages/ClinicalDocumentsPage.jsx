import { useClinicalDocuments } from '@clinical-documents/hooks/useClinicalDocuments';
import ClinicalDocumentsTable from '@clinical-documents/components/views/ClinicalDocumentsTable';
import { CustomCircularProgress } from '@/components/feedback';
import Error from '@/components/feedback/Error';

export default function ClinicalDocumentsPage() {
    const { data: clinicalDocuments, isLoading, error } = useClinicalDocuments();
    if (error) return <Error msg="Error al cargar los documentos clínicos"/>
    if (isLoading) return <CustomCircularProgress />;
    return <ClinicalDocumentsTable clinicalDocuments={clinicalDocuments} />;
}
