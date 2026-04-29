import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router';

import { GridActionsCellItem, GridActionsCell } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import RestoreIcon from '@mui/icons-material/Restore';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import GroupAddIcon from '@mui/icons-material/GroupAdd';

import { usePatients } from '@patients/hooks/usePatients';
import { importPatients, deactivatePatient, reactivatePatient } from '@patients/api/patient.api';
import { PatientStatusChip } from '@patients/components/ui/PatientChips';

import { AlertDialog } from '@/components/dialogs/index';
import { BasicTableLayout, NestedTableLayout } from '@/components/tables/index';
import { ContentLayout } from '@/components/layout/index';

import { useSearchFilter } from '@/hooks/useSearchFilter';
import { handleApiError } from '@/utils/handle-errors';
import { formatCreatedAt } from '@/utils/date-formatters';
import { useSnackbar } from '@/app/SnackBarContext';

function ActionsCell({ row, onDelete, onReactivate, ...gridParams }) {
    return (
        <GridActionsCell {...gridParams}>
            {row.status === 'ACTIVE' && (
                <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label='Dar de baja al paciente'
                    showInMenu
                    onClick={(e) => {
                        e.stopPropagation()
                        onDelete(row);
                    }}
                />
            )}
            {row.status === 'INACTIVE' && (
                <GridActionsCellItem
                    icon={<RestoreIcon />}
                    label='Reactivar paciente'
                    showInMenu
                    onClick={(e) => {
                        e.stopPropagation()
                        onReactivate(row);
                    }}
                />
            )}
            <GridActionsCellItem
                showInMenu
                icon={<EditIcon />}
                label='Editar paciente'
                component={Link}
                to={`/patients/edit/${row.uuid}`}
            ></GridActionsCellItem>
        </GridActionsCell>
    );
}

export default function PatientsTable({ patients }) {
    const [searchText, setSearchText] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate(); 
    const filteredPatients = useSearchFilter(patients, searchText, ['nhc', 'name', 'surname', 'dni']);

    const { refetch } = usePatients();
    const [patientToDelete, setPatientToDelete] = useState(null);
    const [patientToReactivate, setPatientToReactivate] = useState(null);
    const { showSnackbar } = useSnackbar();

    const handlePatientsFileSelect = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        try {
            const text = await file.text();
            const patients = JSON.parse(text);
            await importPatients(patients);
            refetch();
            showSnackbar({ message: 'Pacientes creados correctamente' });
        } catch (err) {
            handleApiError(err, setError, null);
        }
        event.target.value = '';
    };

    const handleCloseAlertDialog = (e) => {
        setError(null); 
        setPatientToDelete(null);
    };

    const handleConfirmAlertDialog = async (row) => {
        try {
            if (row) {
                await deactivatePatient(row.uuid);
                refetch();
            }
            setPatientToDelete(null);
            showSnackbar({ message: 'Paciente dado de baja correctamente' });
        } catch (err) {
            handleApiError(err, setError, null);
        }
    };

    const handleCloseReactivateDialog = (e) => {
        setError(null); 
        setPatientToReactivate(null);
    };

    const handleConfirmReactivateDialog = async (row) => {
        try {
            if (row) {
                await reactivatePatient(row.uuid);
                refetch();
            }
            handleCloseReactivateDialog();
            showSnackbar({ message: 'Paciente reactivado correctamente' });
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
                field: 'dateOfBirth',
                headerName: 'Fecha de Nacimiento',
                flex: 2,
                type: 'date',
                valueGetter: (value) => {
                    return new Date(value);
                },
            },
            { field: 'dni', headerName: 'DNI', flex: 2 },
            {
                field: 'status',
                headerName: 'Estado',
                flex: 2,
                renderCell: (params) => {
                    const value = params.value;
                    return <PatientStatusChip value={value} />;
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
                    <ActionsCell {...params} onDelete={setPatientToDelete} onReactivate={setPatientToReactivate} />
                ),
            },
        ];
    }, []);

    return (
        <>
            <AlertDialog
                open={!!patientToReactivate}
                handleClose={handleCloseReactivateDialog}
                handleConfirm={() => handleConfirmReactivateDialog(patientToReactivate)}
                title={`¿Reactivar la cuenta de ${!!patientToReactivate && patientToReactivate.name + ' ' + patientToReactivate.surname}?`}
                content='Esta acción es reversible. Al finalizar, el paciente será reactivado. '
                error={error}
                onErrorClose={()=>setError(null)}
            />
            <AlertDialog
                open={!!patientToDelete}
                handleClose={handleCloseAlertDialog}
                handleConfirm={() => handleConfirmAlertDialog(patientToDelete)}
                title={`¿Dar de baja a ${!!patientToDelete && patientToDelete.name + ' ' + patientToDelete.surname}?`}
                content='Esta acción es reversible. Si el paciente tiene alguna dependencia activa en el sistema
                se cancelará el proceso. En caso contrario, el paciente será dado de baja. '
                error={error}
                onErrorClose={()=>setError(null)}
            />
            <ContentLayout error={!patientToDelete && !patientToReactivate ? error : null} onErrorClose={() => setError(null)}>
                <BasicTableLayout
                    rows={filteredPatients}
                    columns={columns}
                    searchValue={searchText}
                    onSearchChange={(e) => setSearchText(e.target.value)}
                    searchPlaceholder='Busca por ID, NHC, DNI, nombre, apellidos'
                    onRowClick={(params) => {
                        navigate(`/patients/${params.row.uuid}`);
                    }}
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
