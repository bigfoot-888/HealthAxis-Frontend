import { useState, useMemo } from 'react';
import { Link } from 'react-router';

import { GridActionsCellItem, GridActionsCell } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import { Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import RestoreIcon from '@mui/icons-material/Restore';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { usePatients } from '@patients/hooks/usePatients';
import { importPatients, deactivatePatient, reactivatePatient } from '@patients/api/patient-api';

import { AlertDialog } from '@/components/dialogs/index';
import { BasicTableLayout } from '@/components/tables/index';
import { ContentLayout } from '@/components/layout/index';

import { useSearchFilter } from '@/hooks/useSearchFilter';
import { handleApiError } from '@/utils/handle-errors';

function ActionsCell({ row, onDelete, onReactivate, ...gridParams }) {
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
                to={`/patients/${row.uuid}/detail/profile`}
            ></GridActionsCellItem>
            {row.state === 'ACTIVE' && (
                <GridActionsCellItem icon={<DeleteIcon />} label='Delete' showInMenu onClick={() => onDelete(row)} />
            )}
            {row.state === 'INACTIVE' && (
                <GridActionsCellItem
                    icon={<RestoreIcon />}
                    label='Restore'
                    showInMenu
                    onClick={() => onReactivate(row)}
                />
            )}
            <GridActionsCellItem
                showInMenu
                icon={<EditIcon />}
                label='Edit'
                component={Link}
                to={`/patients/edit/${row.uuid}`}
            ></GridActionsCellItem>
        </GridActionsCell>
    );
}

export default function PatientsTable({ patients }) {
    const [searchText, setSearchText] = useState('');
    const [error, setError] = useState(null);

    const filteredPatients = useSearchFilter(patients, searchText, ['nhc', 'name', 'surname', 'dni']);

    const { refetch } = usePatients();
    const [agendaToDelete, setAgendaToDelete] = useState(null);
    const [agendaToReactivate, setAgendaToReactivate] = useState(null);

    const handlePatientsFileSelect = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        try {
            const text = await file.text();
            const patients = JSON.parse(text);
            await importPatients(patients);
            refetch();
        } catch (err) {
            handleApiError(err, setError, null);
        }
        event.target.value = '';
    };

    const handleCloseAlertDialog = (e) => {
        setAgendaToDelete(null);
    };

    const handleConfirmAlertDialog = async (row) => {
        try {
            if (row) {
                await deactivatePatient(Number(row.id));
                refetch();
            }
            setAgendaToDelete(null);
        } catch (err) {
            handleApiError(err, setError, null);
        }
    };

    const handleCloseReactivateDialog = (e) => {
        setAgendaToReactivate(null);
    };

    const handleConfirmReactivateDialog = async (row) => {
        try {
            if (row) {
                await reactivatePatient(Number(row.id));
                refetch();
            }
            handleCloseReactivateDialog();
        } catch (err) {
            handleApiError(err, setError, null);
        }
    };

    const columns = useMemo(() => {
        return [
            { field: 'nhc', headerName: 'NHC', flex: 2 },
            { field: 'name', headerName: 'Nombre', flex: 2 },
            { field: 'surname', headerName: 'Apellidos', flex: 2 },
            {
                field: 'date_of_birth',
                headerName: 'Fecha de Nacimiento',
                flex: 2,
                type: 'date',
                valueGetter: (value) => {
                    return new Date(value);
                },
            },
            { field: 'dni', headerName: 'DNI', flex: 2 },
            {
                field: 'state',
                headerName: 'Estado',
                flex: 1,
                valueFormatter: (value) => {
                    return value === 'ACTIVE' ? 'Activo' : 'Inactivo';
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
                    <ActionsCell {...params} onDelete={setAgendaToDelete} onReactivate={setAgendaToReactivate} />
                ),
            },
        ];
    }, []);

    return (
        <>
            <AlertDialog
                open={!!agendaToReactivate}
                handleClose={handleCloseReactivateDialog}
                handleConfirm={() => handleConfirmReactivateDialog(agendaToReactivate)}
                title={`¿Reactivar la cuenta de ${!!agendaToReactivate && agendaToReactivate.name + ' ' + agendaToReactivate.surname}?`}
                content='Esta acción es reversible. Al finalizar, el paciente será reactivado. '
            />
            <AlertDialog
                open={!!agendaToDelete}
                handleClose={handleCloseAlertDialog}
                handleConfirm={() => handleConfirmAlertDialog(agendaToDelete)}
                title={`¿Dar de baja a ${!!agendaToDelete && agendaToDelete.name + ' ' + agendaToDelete.surname}?`}
                content='Esta acción es reversible. Si el paciente tiene alguna dependencia activa en el sistema
                se cancelará el proceso. En caso contrario, el paciente será dado de baja. '
            />
            <ContentLayout error={error} onErrorClose={() => setError(null)}>
                <BasicTableLayout
                    rows={filteredPatients}
                    columns={columns}
                    searchValue={searchText}
                    onSearchChange={(e) => setSearchText(e.target.value)}
                    searchPlaceholder='Busca por ID, NHC, DNI, nombre, apellidos'
                    actions={
                        <>
                            <Button
                                component={Link}
                                variant='contained'
                                to='/patients/new'
                                startIcon={<PersonAddAltIcon />}
                                loadingPosition='start'
                                sx={{ mr: 2 }}
                            >
                                Añadir paciente
                            </Button>
                            <Button component='label' variant='outlined' startIcon={<GroupAddIcon />}>
                                Importar pacientes
                                <input
                                    type='file'
                                    hidden
                                    accept='application/json'
                                    onChange={handlePatientsFileSelect}
                                />
                            </Button>
                        </>
                    }
                />
            </ContentLayout>
        </>
    );
}
