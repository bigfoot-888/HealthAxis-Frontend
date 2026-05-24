import { useState, useMemo } from 'react';

import { GridActionsCellItem, GridActionsCell } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import RestoreIcon from '@mui/icons-material/Restore';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';

import { AlertDialog } from '@/components/dialogs/index';
import { BasicTableLayout } from '@/components/tables/index';
import { ContentLayout } from '@/components/layout/index';

import { handleApiError } from '@/utils/handle-errors';
import { useSearchFilter } from '@/hooks/useSearchFilter';

import CreateAgendaForm from '@agendas/components/forms/CreateAgendaForm';
import CreateAgendaPeriodForm from '@/features/agendas/components/forms/CreateAgendaPeriodForm';
import EditAgendaForm from '@agendas/components/forms/EditAgendaForm';

import AutorenewIcon from '@mui/icons-material/Autorenew';
import { useAgendas } from '@agendas/hooks/useAgendas';
import { deactivateAgenda, reactivateAgenda } from '@/features/agendas/api/agenda.api';
import { useNavigate } from 'react-router';
import { AGENDA_COLUMNS } from '@agendas/config/agenda.columns';
import UpdateAgendaPeriodStatusForm from '@agendas/components/forms/UpdateAgendaPeriodStatusForm';
import { invalidateEditAgendaQueries } from '@agendas/utils/agenda-query.utils';
import { useQueryClient } from '@tanstack/react-query';

function ActionsCell({ row, onDelete, onReactivate, onEdit, onCreatePeriod, onUpdatePeriodStatus, ...gridParams }) {
    return (
        <GridActionsCell {...gridParams}>
            <GridActionsCellItem
                showInMenu
                icon={<EditCalendarIcon />}
                disabled={row.status === 'INACTIVE'}
                label='Abrir periodo'
                onClick={() => onCreatePeriod(row)}
            />
            <GridActionsCellItem
                showInMenu
                icon={<EditIcon />}
                disabled={row.status === 'INACTIVE'}
                label='Editar'
                onClick={() => onEdit(row)}
            ></GridActionsCellItem>
            {row.status === 'ACTIVE' && (
                <GridActionsCellItem
                    showInMenu
                    icon={<AutorenewIcon />}
                    label='Actualizar estado del periodo'
                    onClick={() => onUpdatePeriodStatus(row)}
                />
            )}
            {row.status === 'ACTIVE' && (
                <GridActionsCellItem
                    showInMenu
                    icon={<DeleteIcon />}
                    label='Dar de baja'
                    onClick={() => onDelete(row)}
                />
            )}
            {row.status === 'INACTIVE' && (
                <GridActionsCellItem
                    showInMenu
                    icon={<RestoreIcon />}
                    label='Reactivar'
                    onClick={() => onReactivate(row)}
                />
            )}
        </GridActionsCell>
    );
}

export default function AgendasTable({ agendas }) {
    const [searchText, setSearchText] = useState('');
    const [error, setError] = useState(null);
    const queryClient = useQueryClient(); 

    const [isCreateAgendaOpen, setIsCreateAgendaOpen] = useState(false);
    const [agendaToEdit, setAgendaToEdit] = useState(null);
    const [agendaForNewPeriod, setAgendaForNewPeriod] = useState(null);
    const [agendaToDelete, setAgendaToDelete] = useState(null);
    const [agendaToReactivate, setAgendaToReactivate] = useState(null);
    const [agendaToUpdatePeriodStatus, setAgendaToUpdatePeriodStatus] = useState(null);

    const navigate = useNavigate();

    const filteredAgendas = useSearchFilter(agendas, searchText, ['id', 'name']);

    const handleConfirmAlertDialog = async row => {
        try {
            await deactivateAgenda(row.uuid);
            invalidateEditAgendaQueries(queryClient, row); 
            setAgendaToDelete(null);
        } catch (err) {
            handleApiError(err, setError, null);
        }
    };

    const handleConfirmReactivateDialog = async row => {
        try {
            await reactivateAgenda(row.uuid);
            invalidateEditAgendaQueries(queryClient, row); 
            setAgendaToReactivate(null);
        } catch (err) {
            handleApiError(err, setError, null);
        }
    };

    const columns = useMemo(() => {
        return [
            AGENDA_COLUMNS.id,
            AGENDA_COLUMNS.status,
            AGENDA_COLUMNS.name,
            AGENDA_COLUMNS.openingDate,
            AGENDA_COLUMNS.closingDate,
            AGENDA_COLUMNS.activePeriodStatus,
            AGENDA_COLUMNS.createdAt,
            {
                field: 'actions',
                type: 'actions',
                flex: 2,
                renderCell: params => (
                    <ActionsCell
                        {...params}
                        onDelete={setAgendaToDelete}
                        onReactivate={setAgendaToReactivate}
                        onEdit={setAgendaToEdit}
                        onCreatePeriod={setAgendaForNewPeriod}
                        onUpdatePeriodStatus={setAgendaToUpdatePeriodStatus}
                    />
                ),
            },
        ];
    }, []);

    return (
        <>
            {!!agendaToReactivate && (
                <AlertDialog
                    open={!!agendaToReactivate}
                    handleClose={() => {
                        setError(null);
                        setAgendaToDelete(null);
                    }}
                    handleConfirm={() => handleConfirmReactivateDialog(agendaToReactivate)}
                    title={`¿Reactivar la agenda de ${!!agendaToReactivate && agendaToReactivate.name}?`}
                    content='Al finalizar, la agenda será reactivada.'
                    error={error}
                    onErrorClose={() => setError(null)}
                />
            )}
            {!!agendaToDelete && (
                <AlertDialog
                    open={!!agendaToDelete}
                    handleClose={() => {
                        setError(null);
                        setAgendaToDelete(null);
                    }}
                    handleConfirm={() => handleConfirmAlertDialog(agendaToDelete)}
                    title={`¿Dar de baja a la agenda de ${!!agendaToDelete && agendaToDelete.name}?`}
                    content='Al finalizar, la agenda será dada de baja.'
                    error={error}
                    onErrorClose={() => setError(null)}
                />
            )}
            {isCreateAgendaOpen && (
                <CreateAgendaForm
                    isCreateAgendaOpen={isCreateAgendaOpen}
                    handleClose={() => {
                        setError(null);
                        setIsCreateAgendaOpen(false);
                    }}
                />
            )}
            {agendaToEdit && (
                <EditAgendaForm
                    agenda={agendaToEdit}
                    handleClose={() => {
                        setError(null);
                        setAgendaToEdit(null);
                    }}
                />
            )}
            {agendaForNewPeriod && (
                <CreateAgendaPeriodForm
                    agenda={agendaForNewPeriod}
                    handleClose={() => {
                        setError(null);
                        setAgendaForNewPeriod(null);
                    }}
                />
            )}
            {agendaToUpdatePeriodStatus && (
                <UpdateAgendaPeriodStatusForm
                    agenda={agendaToUpdatePeriodStatus}
                    handleClose={() => {
                        setError(null);
                        setAgendaToUpdatePeriodStatus(null);
                    }}
                />
            )}
            <ContentLayout>
                <BasicTableLayout
                    rows={filteredAgendas}
                    columns={columns}
                    searchValue={searchText}
                    searchPlaceholder={'Busca por ID, nombre'}
                    onSearchChange={e => setSearchText(e.target.value)}
                    onRowClick={params => {
                        navigate(`/agendas/${params.row.uuid}`);
                    }}
                    actions={
                        <Button
                            variant='contained'
                            onClick={() => {
                                setIsCreateAgendaOpen(true);
                            }}
                            startIcon={<PersonAddAltIcon />}
                            loadingPosition='start'
                            sx={{ mr: 2 }}
                        >
                            Añadir agenda
                        </Button>
                    }
                />
            </ContentLayout>
        </>
    );
}
