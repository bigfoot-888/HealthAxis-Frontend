// React
import { useState, useMemo } from 'react';

import { GridActionsCellItem, GridActionsCell } from '@mui/x-data-grid';
import { useNavigate } from 'react-router';
import { Link, useOutletContext } from 'react-router';
import EditIcon from '@mui/icons-material/Edit';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import {BasicTableLayout} from '@/components/tables/index';
import { useSearchFilter } from '@/hooks/useSearchFilter';
import UpdateClinicalDocumentStatusForm from '@clinical-documents/components/forms/UpdateClinicalDocumentStatusForm';
import { handleApiError } from '@/utils/handle-errors';
import { CLINICAL_DOCUMENT_COLUMNS } from '@clinical-documents/config/clinical-document.columns';
import { CLINICAL_DOCUMENT_TYPE_CONFIG } from '@/shared/constants/clinical-document.constants';
import EditClinicalDocumentForm from '@clinical-documents/components/forms/EditClinicalDocumentForm';

function ActionsCell({ row, onUpdateStatus, onEdit, ...gridParams }) {
    return (
        <GridActionsCell {...gridParams}>
            <GridActionsCellItem
                showInMenu
                icon={<SyncAltIcon />}
                label='Actualizar estado'
                onClick={() => onUpdateStatus(row)}
            ></GridActionsCellItem>
            <GridActionsCellItem
                icon={<EditIcon />}
                disabled={row.status === 'INACTIVE'}
                label='Editar'
                onClick={() => onEdit(row)}
            ></GridActionsCellItem>
        </GridActionsCell>
    );
}

export default function ClinicalDocumentsTable({ clinicalDocuments }) {
    const [error, setError] = useState(null);
    const { searchText } = useOutletContext();
    const navigate = useNavigate();
    const [documentToEdit, setDocumentToEdit] = useState(null);

    const filteredClinicalDocuments = useSearchFilter(clinicalDocuments, searchText, null, [
        d => d.title,
        d => CLINICAL_DOCUMENT_TYPE_CONFIG[d.documentType].label,
        d => d.users?.map(u => u.fullName).join(', '),
    ]);

    const [updateClinicalDocumentStatusRow, setUpdateClinicalDocumentStatusRow] = useState(null);

    const columns = useMemo(() => {
        return [
            CLINICAL_DOCUMENT_COLUMNS.title,
            CLINICAL_DOCUMENT_COLUMNS.documentType,
            CLINICAL_DOCUMENT_COLUMNS.users,
            CLINICAL_DOCUMENT_COLUMNS.status,
            CLINICAL_DOCUMENT_COLUMNS.createdAt,
            {
                field: 'actions',
                type: 'actions',
                flex: 3,
                renderCell: params => <ActionsCell {...params} onUpdateStatus={setUpdateClinicalDocumentStatusRow} onEdit={setDocumentToEdit}/>,
            },
        ];
    }, []);

    return (
        <>
            {updateClinicalDocumentStatusRow && (
                <UpdateClinicalDocumentStatusForm
                    clinicalDocument={updateClinicalDocumentStatusRow}
                    handleClose={() => setUpdateClinicalDocumentStatusRow(null)}
                />
            )}
            {documentToEdit && (
                <EditClinicalDocumentForm document={documentToEdit} handleClose={() => setDocumentToEdit(null)}/>
            )}
            <BasicTableLayout
                rows={filteredClinicalDocuments}
                columns={columns}
                onRowClick={params => {
                    navigate(`/clinical-records/clinical-documents/${params.row.uuid}`);
                }}
            />
        </>
    );
}
