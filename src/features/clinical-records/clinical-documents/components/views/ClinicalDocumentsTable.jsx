// React
import { useState, useMemo } from 'react';

import { GridActionsCellItem, GridActionsCell } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Link } from 'react-router';
import { Tooltip } from '@mui/material';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import {BasicTableLayout} from '@/components/tables/index';
import { useSearchFilter } from '@/hooks/useSearchFilter';
import UpdateClinicalDocumentStatusForm from '@clinical-documents/components/forms/UpdateClinicalDocumentStatusForm';
import { handleApiError } from '@/utils/handle-errors';
import { CLINICAL_DOCUMENT_COLUMNS } from '@clinical-documents/config/clinical-document.columns';
import { CLINICAL_DOCUMENT_TYPE_CONFIG } from '@/shared/constants/clinical-document.constants';

function ActionsCell({ row, onUpdateStatus, onViewAttachmentsDocument, ...gridParams }) {
    return (
        <GridActionsCell {...gridParams}>
            <GridActionsCellItem
                icon={
                    <Tooltip title='Ver documento'>
                        <VisibilityIcon color='primary' />
                    </Tooltip>
                }
                label='Ver documento'
                component={Link}
                to={`/clinical-records/clinical-documents/${row.uuid}`}
            ></GridActionsCellItem>
            <GridActionsCellItem
                showInMenu
                icon={<SyncAltIcon />}
                label='Actualizar estado'
                onClick={() => onUpdateStatus(row)}
            ></GridActionsCellItem>
        </GridActionsCell>
    );
}

export default function ClinicalDocumentsTable({ clinicalDocuments }) {
    const [searchText, setSearchText] = useState('');
    const [error, setError] = useState(null);

    const filteredClinicalDocuments = useSearchFilter(clinicalDocuments, searchText, null, [
        (d) => d.title,
        (d) => CLINICAL_DOCUMENT_TYPE_CONFIG[d.documentType].label,
        (d) => d.users?.map((u) => u.fullName).join(', '),
    ]);

    const [updateClinicalDocumentStatusRow, setUpdateClinicalDocumentStatusRow] = useState(null);
    const [updateClinicalDocumentRecordStatusRow, setUpdateClinicalDocumentRecordStatusRow] = useState(null);
    const [viewClinicalAttachmentsDocument, setViewClinicalAttachmentsDocument] = useState(null);

    const handleImportDocument = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        try {
            const text = await file.text();
            const users = JSON.parse(text);
            await importUsers(users);
            refetch();
        } catch (err) {
            handleApiError(err, setError, null);
        }
        event.target.value = '';
    };

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
                renderCell: (params) => <ActionsCell {...params} onUpdateStatus={setUpdateClinicalDocumentStatusRow} />,
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
            <BasicTableLayout
                rows={filteredClinicalDocuments}
                columns={columns}
                searchValue={searchText}
                searchPlaceholder={'Busca por ID, nombre, tipo de documento'}
                onSearchChange={(e) => setSearchText(e.target.value)}
                actions={
                    <>
                        <Button
                            variant='contained'
                            component={Link}
                            to='/clinical-records/clinical-documents/new-external'
                            startIcon={<PersonAddAltIcon />}
                            loadingPosition='start'
                            sx={{ mr: 2 }}
                        >
                            Crear documento
                        </Button>
                    </>
                }
            />
        </>
    );
}
