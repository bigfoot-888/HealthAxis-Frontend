import { useEffect, useState, useMemo } from 'react';
import { GridActionsCellItem, GridActionsCell } from '@mui/x-data-grid';

import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import RestoreIcon from '@mui/icons-material/Restore';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { Link } from 'react-router';
import GroupAddIcon from '@mui/icons-material/GroupAdd';

import { usePatients } from '../hooks/usePatients';
import { importPatients, deactivatePatient, reactivatePatient } from '../api/patient-api';
import AlertDialog from '../../../components/AlertDialog';
import BasicTableLayout from '../../../components/tables/BasicTableLayout';
import ContentLayout from '../../../components/layout/ContentLayout';

function ActionsCell({ row, onDelete, onReactivate }) {
    return (
        <GridActionsCell>
            {row.state === 'ACTIVE' && (
                <GridActionsCellItem icon={<DeleteIcon />} label='Delete' onClick={() => onDelete(row)} />
            )}
            {row.state === 'INACTIVE' && (
                <GridActionsCellItem icon={<RestoreIcon />} label='Restore' onClick={() => onReactivate(row)} />
            )}
            <GridActionsCellItem
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
    const [filteredPatients, setFilteredPatients] = useState(patients);

    // Filter patients whenever searchText or patients change
    useEffect(() => {
        const lowerSearch = searchText.toLowerCase();
        setFilteredPatients(
            patients.filter((patient) =>
                ['nhc', 'name', 'surname', 'dni'].some((field) => {
                    const value = patient[field]?.toString().toLowerCase() || '';
                    return value.includes(lowerSearch);
                }),
            ),
        );
    }, [searchText, patients]);

    const { refetch } = usePatients();
    const [pendingDeleteRow, setPendingDeleteRow] = useState(null);
    const [pendingReactivateRow, setPendingReactivateRow] = useState(null);

    // const [isSaving, setIsSaving] = useState(false);

    const handlePatientsFileSelect = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        try {
            const text = await file.text();
            const patients = JSON.parse(text);
            const res = await importPatients(patients);
            refetch();
        } catch (err) {
            setError(err.response.data.message);
        }
        event.target.value = '';
    };

    const handleCloseAlertDialog = (e) => {
        setPendingDeleteRow(null);
    };

    const handleConfirmAlertDialog = async (row) => {
        if (row) {
            await deactivatePatient(Number(row.id));
            refetch();
        }
        setPendingDeleteRow(null);
    };

    const handleCloseReactivateDialog = (e) => {
        setPendingReactivateRow(null);
    };

    const handleConfirmReactivateDialog = async (row) => {
        if (row) {
            await reactivatePatient(Number(row.id));
            refetch();
        }
        handleCloseReactivateDialog();
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
                    <ActionsCell {...params} onDelete={setPendingDeleteRow} onReactivate={setPendingReactivateRow} />
                ),
            },
        ];
    }, []);

    return (
        <>
            <AlertDialog
                open={!!pendingReactivateRow}
                handleClose={handleCloseReactivateDialog}
                handleConfirm={() => handleConfirmReactivateDialog(pendingReactivateRow)}
                title={`¿Reactivar la cuenta de ${!!pendingReactivateRow && pendingReactivateRow.name + ' ' + pendingReactivateRow.surname}?`}
                content='Esta acción es reversible. Al finalizar, el paciente será reactivado. '
            />
            <AlertDialog
                open={!!pendingDeleteRow}
                handleClose={handleCloseAlertDialog}
                handleConfirm={() => handleConfirmAlertDialog(pendingDeleteRow)}
                title={`¿Dar de baja a ${!!pendingDeleteRow && pendingDeleteRow.name + ' ' + pendingDeleteRow.surname}?`}
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
