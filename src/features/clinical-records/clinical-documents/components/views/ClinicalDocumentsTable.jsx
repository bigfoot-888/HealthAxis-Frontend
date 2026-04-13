// React
import { useState, useMemo } from 'react';

// External libraries
import { GridActionsCellItem, GridActionsCell } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Link } from 'react-router';
import { Tooltip } from '@mui/material';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import GroupAddIcon from '@mui/icons-material/GroupAdd';

import {BasicTableLayout} from '@/components/tables/index';

import { formatDateTimeUTC, formatCreatedAt } from '@/utils/date-formatters';
import { useSearchFilter } from '@/hooks/useSearchFilter';


import { ClinicalDocumentTypeChip } from '@clinical-documents/components/ui/ClinicalDocumentChips';

import { ClinicalDocumentStatusChip } from '@clinical-documents/components/ui/ClinicalDocumentChips';
import { useClinicalDocuments } from '@clinical-documents/hooks/useClinicalDocuments';

function ActionsCell({ row, onUpdateStatus, onUpdateRecordStatus, onViewAttachmentsDocument, ...gridParams }) {
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
            <GridActionsCellItem
                showInMenu
                icon={<AutorenewIcon />}
                label='Actualizar estado del registro'
                onClick={() => onUpdateRecordStatus(row)}
            ></GridActionsCellItem>
        </GridActionsCell>
    );
}

export default function ClinicalDocumentsTable({ clinicalDocuments }) {
    const [searchText, setSearchText] = useState(''); // Searchbar text
    const [error, setError] = useState(null); // Non-form errors

    const filteredClinicalDocuments = useSearchFilter(clinicalDocuments, searchText, ['id', 'title']);

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
            setError(err.response.data.message);
        }
        event.target.value = '';
    };

    const columns = useMemo(() => {
        return [
            {
                field: 'title',
                headerName: 'Nombre',
                flex: 3,
            },
            {
                field: 'documentType',
                headerName: 'Tipo de documento',
                flex: 2,
                renderCell: (params) => {
                    const value = params.value;
                    return <ClinicalDocumentTypeChip value={value} />;
                },
            },
            {
                field: 'users',
                headerName: 'Usuarios involucrados',
                flex: 3,
                valueGetter: (value, row) => {
                    return row.users ? row.users.map((user) => user.fullName).join(', ') : '';
                },
            },
            {
                field: 'status',
                headerName: 'Estado',
                flex: 2,
                renderCell: (params) => {
                    const value = params.value;
                    return <ClinicalDocumentStatusChip value={value} />;
                },
            },
            {
                type: 'date',
                field: 'createdAt',
                headerName: 'Fecha de Creación',
                flex: 2,
                hide: true,
                valueFormatter: (value) => formatCreatedAt(value),
            },
            {
                field: 'actions',
                type: 'actions',
                flex: 3,
                renderCell: (params) => (
                    <ActionsCell {...params} onUpdateStatus={() => {}} onUpdateRecordStatus={() => {}} />
                ),
            },
        ];
    }, []);

    return (
        <>
            {/* {updateDiagnosisStateRow && (
                <UpdateDiagnosisStateForm
                    clinicalDocument={updateDiagnosisStateRow}
                    handleClose={() => setUpdateDiagnosisStateRow(null)}
                />
            )}
            {updateDiagnosisRecordStateRow && (
                <UpdateDiagnosisRecordStateForm
                    clinicalDocument={updateDiagnosisRecordStateRow}
                    handleClose={() => setUpdateDiagnosisRecordStateRow(null)}
                />
            )} */}
            <BasicTableLayout
                rows={filteredClinicalDocuments}
                columns={columns}
                searchValue={searchText}
                searchPlaceholder={'Busca por ID, nombre'}
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
                            Crear nuevo documento externo
                        </Button>
                        <Button component='label' variant='outlined' startIcon={<GroupAddIcon />}>
                            Importar documento PDF
                            <input type='file' hidden accept='application/json' onChange={handleImportDocument} />
                        </Button>
                    </>
                }
            />
        </>
    );
}
