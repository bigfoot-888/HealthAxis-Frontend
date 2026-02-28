import { GridActionsCellItem, GridActionsCell } from '@mui/x-data-grid';
import { useState, useEffect, useMemo } from 'react';
import Button from '@mui/material/Button';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import RestoreIcon from '@mui/icons-material/Restore';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';

import { useAgendas } from '../hooks/useAgendas';
import { deactivateAgenda, reactivateAgenda } from '../api/agenda-api';
import AlertDialog from '../../../components/AlertDialog';
import CreateAgendaForm from './CreateAgendaForm';
import CreateAgendaPeriodForm from './CreatePeriodForm';
import EditAgendaForm from './EditAgendaForm';
import BasicTableLayout from '../../../components/tables/BasicTableLayout';
import ContentLayout from '../../../components/layout/ContentLayout';

function ActionsCell({ row, onDelete, onReactivate, onEdit, onCreatePeriod }) {
    return (
        <GridActionsCell>
            <GridActionsCellItem
                icon={<EditCalendarIcon />}
                disabled={row.state === 'INACTIVE'}
                label='Create period'
                onClick={() => onCreatePeriod(row)}
            />
            <GridActionsCellItem
                icon={<EditIcon />}
                disabled={row.state === 'INACTIVE'}
                label='Edit'
                onClick={() => onEdit(row)}
            ></GridActionsCellItem>
            {row.state === 'ACTIVE' && (
                <GridActionsCellItem icon={<DeleteIcon />} label='Delete' onClick={() => onDelete(row)} />
            )}
            {row.state === 'INACTIVE' && (
                <GridActionsCellItem icon={<RestoreIcon />} label='Restore' onClick={() => onReactivate(row)} />
            )}
        </GridActionsCell>
    );
}

export default function AgendasTable({ agendas }) {
    const [searchText, setSearchText] = useState(''); // Searchbar text
    const [error, setError] = useState(null); // Non-form errors
    const [filteredAgendas, setFilteredAgendas] = useState(agendas);
    const [openCreateForm, setOpenCreateForm] = useState(false);
    const [openEditForm, setOpenEditForm] = useState(null);
    const [openCreatePeriodForm, setOpenCreatePeriodForm] = useState(null);

    // Filter agendas whenever searchText or agendas change
    useEffect(() => {
        const lowerSearch = searchText.toLowerCase();
        setFilteredAgendas(
            agendas.filter((agenda) =>
                ['id', 'name'].some((field) => {
                    const value = agenda[field]?.toString().toLowerCase() || '';
                    return value.includes(lowerSearch);
                }),
            ),
        );
    }, [searchText, agendas]);

    const { refetch } = useAgendas();
    const [pendingDeleteRow, setPendingDeleteRow] = useState(null);
    const [pendingReactivateRow, setPendingReactivateRow] = useState(null);
    // const [isSaving, setIsSaving] = useState(false);

    const handleConfirmAlertDialog = async (row) => {
        if (row) {
            await deactivateAgenda(Number(row.id));
            refetch();
        }
        setPendingDeleteRow(null);
    };

    const handleConfirmReactivateDialog = async (row) => {
        if (row) {
            await reactivateAgenda(Number(row.id));
            refetch();
        }
        setPendingReactivateRow(null);
    };

    // https://stackoverflow.com/questions/79546439/why-are-params-undefined-in-valuegetter-but-not-in-rendercell-when-using-mui-dat

    const columns = useMemo(() => {
        return [
            { field: 'id', headerName: 'ID', flex: 1 },
            {
                field: 'state',
                headerName: 'Estado',
                flex: 1,
                valueFormatter: (value) => {
                    return value === 'ACTIVE' ? 'Activa' : 'Inactiva';
                },
            },
            { field: 'name', headerName: 'Nombre', flex: 2 },
            {
                field: 'opening_date',
                headerName: 'Apertura Programada',
                type: 'date',
                flex: 2,
                valueGetter: (value, row) => new Date(row.activePeriod?.opening_date),
            },
            {
                field: 'closing_date',
                headerName: 'Cierre Programado',
                type: 'date',
                flex: 2,
                valueGetter: (value, row) => new Date(row.activePeriod?.closing_date),
            },
            {
                field: 'agenda_state',
                headerName: 'Estado del Periodo Actual',
                flex: 2,
                valueGetter: (value, row) => row.activePeriod?.agenda_state,
                valueFormatter: (value) => {
                    if (value === 'OPEN') return 'Abierta';
                    else if (value === 'CLOSED') return 'Cerrada';
                    else return 'Cancelada';
                },
            },
            {
                type: 'date',
                field: 'createdAt',
                headerName: 'Fecha de Creación',
                flex: 2,
                valueFormatter: (value) => {
                    const date = new Date(value);
                    const now = new Date();
                    const isToday =
                        date.getDate() === now.getDate() &&
                        date.getMonth() === now.getMonth() &&
                        date.getFullYear() === now.getFullYear();

                    return isToday
                        ? date.toLocaleTimeString('es-ES', {
                              hour: '2-digit',
                              minute: '2-digit',
                          })
                        : date.toLocaleDateString('es-ES');
                },
            },
            {
                field: 'actions',
                type: 'actions',
                flex: 2,
                renderCell: (params) => (
                    <ActionsCell
                        {...params}
                        onDelete={setPendingDeleteRow}
                        onReactivate={setPendingReactivateRow}
                        onEdit={setOpenEditForm}
                        onCreatePeriod={setOpenCreatePeriodForm}
                    />
                ),
            },
        ];
    }, []);

    return (
        <>
            <AlertDialog
                open={!!pendingReactivateRow}
                handleClose={() => setPendingReactivateRow(null)}
                handleConfirm={() => handleConfirmReactivateDialog(pendingReactivateRow)}
                title={`¿Reactivar la agenda de ${!!pendingReactivateRow && pendingReactivateRow.name}?`}
                content='Esta acción es reversible. Al finalizar, la agenda será reactivada. '
            />
            <AlertDialog
                open={!!pendingDeleteRow}
                handleClose={() => setPendingDeleteRow(null)}
                handleConfirm={() => handleConfirmAlertDialog(pendingDeleteRow)}
                title={`¿Dar de baja a la agenda de ${!!pendingDeleteRow && pendingDeleteRow.name}?`}
                content='Esta acción es reversible. Si la agenda tiene alguna dependencia activa en el sistema
                se cancelará el proceso. En caso contrario, la agenda será dada de baja. '
            />
            {openCreateForm && (
                <CreateAgendaForm openCreateForm={openCreateForm} handleClose={() => setOpenCreateForm(false)} />
            )}
            {openEditForm && <EditAgendaForm agenda={openEditForm} handleClose={() => setOpenEditForm(null)} />}
            {openCreatePeriodForm && (
                <CreateAgendaPeriodForm
                    agenda={openCreatePeriodForm}
                    handleClose={() => setOpenCreatePeriodForm(null)}
                />
            )}
            <ContentLayout error={error} onErrorClose={() => setError(null)}>
                <BasicTableLayout
                    rows={filteredAgendas}
                    columns={columns}
                    searchValue={searchText}
                    searchPlaceholder={'Busca por ID, nombre'}
                    onSearchChange={(e) => setSearchText(e.target.value)}
                    actions={
                        <Button
                            variant='contained'
                            onClick={() => {
                                setOpenCreateForm(true);
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
