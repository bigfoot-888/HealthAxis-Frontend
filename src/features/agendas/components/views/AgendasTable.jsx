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
import CreateAgendaPeriodForm from '@agendas/components/forms/CreatePeriodForm';
import EditAgendaForm from '@agendas/components/forms/EditAgendaForm';

import { useAgendas } from '@agendas/hooks/useAgendas';
import { deactivateAgenda, reactivateAgenda } from '@agendas/api/agenda-api';
import { useNavigate } from 'react-router';
import { AGENDA_COLUMNS } from '@agendas/config/agenda.columns';

function ActionsCell({ row, onDelete, onReactivate, onEdit, onCreatePeriod, ...gridParams }) {
    return (
        <GridActionsCell {...gridParams}>
            <GridActionsCellItem
                icon={<EditCalendarIcon />}
                disabled={row.status === 'INACTIVE'}
                label='Abrir periodo'
                onClick={() => onCreatePeriod(row)}
            />
            <GridActionsCellItem
                icon={<EditIcon />}
                disabled={row.status === 'INACTIVE'}
                label='Editar'
                onClick={() => onEdit(row)}
            ></GridActionsCellItem>
            {row.status === 'ACTIVE' && (
                <GridActionsCellItem icon={<DeleteIcon />} label='Dar de baja' onClick={() => onDelete(row)} />
            )}
            {row.status === 'INACTIVE' && (
                <GridActionsCellItem icon={<RestoreIcon />} label='Reactivar' onClick={() => onReactivate(row)} />
            )}
        </GridActionsCell>
    );
}

export default function AgendasTable({ agendas }) {
    const { refetch } = useAgendas();
    const [searchText, setSearchText] = useState('');
    const [error, setError] = useState(null);

    const [isCreateAgendaOpen, setIsCreateAgendaOpen] = useState(false);
    const [agendaToEdit, setAgendaToEdit] = useState(null);
    const [agendaForNewPeriod, setAgendaForNewPeriod] = useState(null);
    const [agendaToDelete, setAgendaToDelete] = useState(null);
    const [agendaToReactivate, setAgendaToReactivate] = useState(null);

    const navigate = useNavigate();

    const filteredAgendas = useSearchFilter(agendas, searchText, ['id', 'name']);

    const handleConfirmAlertDialog = async (row) => {
        try {
            if (row) {
                await deactivateAgenda(row.uuid);
                refetch();
                setAgendaToDelete(null);
            }
        } catch (err) {
            handleApiError(err, setError, null);
        }
    };

    const handleConfirmReactivateDialog = async (row) => {
        try {
            if (row) {
                await reactivateAgenda(row.uuid);
                refetch();
            }
            setAgendaToReactivate(null);
        } catch (err) {
            handleApiError(err, setError, null);
        }
    };

    // https://stackoverflow.com/questions/79546439/why-are-params-undefined-in-valuegetter-but-not-in-rendercell-when-using-mui-dat

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
                renderCell: (params) => (
                    <ActionsCell
                        {...params}
                        onDelete={setAgendaToDelete}
                        onReactivate={setAgendaToReactivate}
                        onEdit={setAgendaToEdit}
                        onCreatePeriod={setAgendaForNewPeriod}
                    />
                ),
            },
        ];
    }, []);

    return (
        <>
            <AlertDialog
                open={!!agendaToReactivate}
                handleClose={() => setAgendaToReactivate(null)}
                handleConfirm={() => handleConfirmReactivateDialog(agendaToReactivate)}
                title={`¿Reactivar la agenda de ${!!agendaToReactivate && agendaToReactivate.name}?`}
                content='Esta acción es reversible. Al finalizar, la agenda será reactivada. '
            />
            <AlertDialog
                open={!!agendaToDelete}
                handleClose={() => setAgendaToDelete(null)}
                handleConfirm={() => handleConfirmAlertDialog(agendaToDelete)}
                title={`¿Dar de baja a la agenda de ${!!agendaToDelete && agendaToDelete.name}?`}
                content='Esta acción es reversible. Si la agenda tiene alguna dependencia activa en el sistema
                se cancelará el proceso. En caso contrario, la agenda será dada de baja. '
            />
            {isCreateAgendaOpen && (
                <CreateAgendaForm
                    isCreateAgendaOpen={isCreateAgendaOpen}
                    handleClose={() => setIsCreateAgendaOpen(false)}
                />
            )}
            {agendaToEdit && (
                <EditAgendaForm
                    agenda={agendaToEdit}
                    handleClose={() => setAgendaToEdit(null)}
                    setError={setError}
                    refetch={refetch}
                />
            )}
            {agendaForNewPeriod && (
                <CreateAgendaPeriodForm
                    agenda={agendaForNewPeriod}
                    handleClose={() => setAgendaForNewPeriod(null)}
                    setError={setError}
                    refetch={refetch}
                />
            )}
            <ContentLayout error={error} onErrorClose={() => setError(null)}>
                <BasicTableLayout
                    rows={filteredAgendas}
                    columns={columns}
                    searchValue={searchText}
                    searchPlaceholder={'Busca por ID, nombre'}
                    onSearchChange={(e) => setSearchText(e.target.value)}
                    onRowClick={(params) => {
                        navigate(`/agendas/${params.row.uuid}`);
                    }}
                    actions={
                        <Button
                            variant='contained'
                            onClick={() => {
                                setIsCreateAgendaOpen(true);
                                console.log('hola');
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
