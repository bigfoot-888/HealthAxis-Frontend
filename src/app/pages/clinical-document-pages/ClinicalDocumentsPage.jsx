import { useClinicalDocuments } from '@clinical-documents/hooks/useClinicalDocuments';
import ClinicalDocumentsTable from '@clinical-documents/components/views/ClinicalDocumentsTable';
import { CustomCircularProgress } from '@/components/feedback';

export default function ClinicalDocumentsPage() {
    const { data: clinicalDocuments, isLoading, error } = useClinicalDocuments();
    if (error) return <p>Error al cargar los documentos clínicos</p>;
    if (isLoading) return <CustomCircularProgress />;
    return <ClinicalDocumentsTable clinicalDocuments={clinicalDocuments} />;
}
