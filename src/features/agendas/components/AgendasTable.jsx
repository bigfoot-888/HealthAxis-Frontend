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

import CreateAgendaForm from '@agendas/components/CreateAgendaForm';
import CreateAgendaPeriodForm from '@agendas/components/CreatePeriodForm';
import EditAgendaForm from '@agendas/components/EditAgendaForm';

import { useAgendas } from '@agendas/hooks/useAgendas';
import { deactivateAgenda, reactivateAgenda } from '@agendas/api/agenda-api';
import { formatCreatedAt } from '@/utils/date-formatters';

import { AgendaStatusChip } from '@agendas/components/ui/AgendaChips';
import { AgendaPeriodStatusChip } from '@agendas/components/ui/AgendaChips';
import { useNavigate } from 'react-router';

function ActionsCell({ row, onDelete, onReactivate, onEdit, onCreatePeriod, ...gridParams }) {
    return (
        <GridActionsCell {...gridParams}>
            <GridActionsCellItem
                icon={<EditCalendarIcon />}
                disabled={row.status === 'INACTIVE'}
                label='Create period'
                onClick={() => onCreatePeriod(row)}
            />
            <GridActionsCellItem
                icon={<EditIcon />}
                disabled={row.status === 'INACTIVE'}
                label='Edit'
                onClick={() => onEdit(row)}
            ></GridActionsCellItem>
            {row.status === 'ACTIVE' && (
                <GridActionsCellItem icon={<DeleteIcon />} label='Delete' onClick={() => onDelete(row)} />
            )}
            {row.status === 'INACTIVE' && (
                <GridActionsCellItem icon={<RestoreIcon />} label='Restore' onClick={() => onReactivate(row)} />
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

    const filteredAgendas = useSearchFilter(agendas, searchText, ["id", "name"])
    
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
            { field: 'id', headerName: 'ID', flex: 1 },
            {
                field: 'status',
                headerName: 'Estado Agenda',
                flex: 2,
                renderCell: (params) => {
                    const value = params.value;
                    return <AgendaStatusChip value={value} />;
                },
            },
            { field: 'name', headerName: 'Nombre', flex: 2 },
            {
                field: 'openingDate',
                headerName: 'Apertura',
                type: 'date',
                flex: 2,
                valueGetter: (value, row) => new Date(row.activePeriod?.openingDate),
            },
            {
                field: 'closingDate',
                headerName: 'Cierre',
                type: 'date',
                flex: 2,
                valueGetter: (value, row) => new Date(row.activePeriod?.closingDate),
            },
            {
                field: 'status',
                headerName: 'Estado del periodo',
                flex: 2,
                valueGetter: (value, row) => row.activePeriod?.agendaStatus,
                renderCell: (params) => {
                    const value = params.value;
                    return <AgendaPeriodStatusChip value={value} />;
                },
            },
            {
                type: 'date',
                field: 'createdAt',
                headerName: 'Fecha de Creación',
                flex: 2,
                valueFormatter: (value) => formatCreatedAt(value),
            },
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
                <CreateAgendaForm isCreateAgendaOpen={isCreateAgendaOpen} handleClose={() => setIsCreateAgendaOpen(false)} />
            )}
            {agendaToEdit && <EditAgendaForm agenda={agendaToEdit} handleClose={() => setAgendaToEdit(null)} setError={setError}/>}
            {agendaForNewPeriod && (
                <CreateAgendaPeriodForm
                    agenda={agendaForNewPeriod}
                    handleClose={() => setAgendaForNewPeriod(null)}
                    setError={setError}
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
