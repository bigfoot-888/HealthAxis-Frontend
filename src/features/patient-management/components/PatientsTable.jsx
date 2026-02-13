import * as React from 'react';
import {
    DataGrid,
    useGridApiRef,
    GridActionsCellItem,
    gridClasses,
    GridActionsCell,
    useGridApiContext,
} from '@mui/x-data-grid';

import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import RestoreIcon from '@mui/icons-material/Restore';
import SaveIcon from '@mui/icons-material/Save';
import { darken } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import DrawerHeader from '../../../components/layout/DrawerHeader';
import { Link, NavLink } from 'react-router';
import GroupAddIcon from '@mui/icons-material/GroupAdd';

import SearchIcon from '@mui/icons-material/Search';
import { usePatients } from '../hooks/usePatients';
import SearchBar from '../../../components/SearchBar';
import { importPatients, deactivatePatient } from '../api/patient-api';
import Alert from '@mui/material/Alert';
import AlertDialog from '../../../components/AlertDialog';

const BulkEditingContext = React.createContext(null);

function ActionsCell(props) {
    const context = React.useContext(BulkEditingContext);
    const apiRef = useGridApiContext();
    if (!context) {
        return null;
    }
    const { unsavedChangesRef, setHasUnsavedRows, requestDelete } = context;
    const { id, row } = props;

    return (
        <GridActionsCell {...props}>
            <GridActionsCellItem
                icon={<RestoreIcon />}
                label='Discard changes'
                disabled={
                    unsavedChangesRef.current.unsavedRows[id] === undefined
                }
                onClick={() => {
                    apiRef.current?.updateRows([
                        unsavedChangesRef.current.rowsBeforeChange[id],
                    ]);
                    delete unsavedChangesRef.current.rowsBeforeChange[id];
                    delete unsavedChangesRef.current.unsavedRows[id];
                    setHasUnsavedRows(
                        Object.keys(unsavedChangesRef.current.unsavedRows)
                            .length > 0,
                    );
                }}
            />
            <GridActionsCellItem
                icon={<DeleteIcon />}
                label='Delete'
                // onClick={() => {
                //     requestDelete(row) 
                // }}
                onClick={() => {
                    unsavedChangesRef.current.unsavedRows[id] = {
                        ...row,
                        _action: 'delete',
                    };
                    if (!unsavedChangesRef.current.rowsBeforeChange[id]) {
                        unsavedChangesRef.current.rowsBeforeChange[id] = row;
                    }
                    setHasUnsavedRows(true);
                    apiRef.current?.updateRows([row]); // to trigger row render
                }}
            />
            <GridActionsCellItem
                icon={<EditIcon />}
                label='Edit'
                component={Link}
                to={`/patients/edit/${row.uuid}`}
            ></GridActionsCellItem>
        </GridActionsCell>
    );
}

export default function BulkEditing({ patients }) {
    const [searchText, setSearchText] = React.useState('');
    const [error, setError] = React.useState(null);
    const [filteredPatients, setFilteredPatients] = React.useState(patients);

    // Filter patients whenever searchText or patients change
    React.useEffect(() => {
        const lowerSearch = searchText.toLowerCase();

        setFilteredPatients(
            patients.filter((patient) =>
                ['id', 'nhc', 'name', 'surname', 'dni'].some((field) => {
                    const value = patient[field]?.toString().toLowerCase() || '';
                    return value.includes(lowerSearch);
                }),
            ),
        );
    }, [searchText, patients]);

    const apiRef = useGridApiRef();
    const { refetch } = usePatients();
    const [pendingDeleteRow, setPendingDeleteRow] = React.useState(null);
    const [hasUnsavedRows, setHasUnsavedRows] = React.useState(false);
    const [isSaving, setIsSaving] = React.useState(false);
    const unsavedChangesRef = React.useRef({
        unsavedRows: {},
        rowsBeforeChange: {},
    });

    const handlePatientsFileSelect = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        try {
            const text = await file.text();
            const patients = JSON.parse(text);

            // Optional validation
            // if (!Array.isArray(patients))
            //     throw new Error('File must contain an array');
            // users.forEach((user) => {
            //     if (
            //         !user.name ||
            //         !user.email ||
            //         !user.surname ||
            //         !user.password ||
            //         !user.phone
            //     )
            //         throw new Error('Invalid user format');
            // });
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
        console.log("hola")
        if (!row) {
            handleCloseAlertDialog(); 
            return; 
        }
        else {
            const patient = await deactivatePatient(Number(row.id));
            handleCloseAlertDialog(); 
            refetch();
        }
    }

    const columns = React.useMemo(() => {
        return [
            { field: 'id', headerName: 'ID', flex: 1 },
            { field: 'nhc', headerName: 'NHC', flex: 2 },
            { field: 'name', headerName: 'Nombre', flex: 2 },
            { field: 'surname', headerName: 'Apellidos', flex: 2 },
            { field: 'date_of_birth', headerName: 'Fecha de Nacimiento', flex: 2, type: 'date',
                valueGetter: (value) => {
                    return new Date(value); 
                }
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
                renderCell: (params) => <ActionsCell {...params} />,
            },
        ];
    }, []);

    const processRowUpdate = React.useCallback((newRow, oldRow) => {
        const rowId = newRow.id;

        unsavedChangesRef.current.unsavedRows[rowId] = newRow;
        if (!unsavedChangesRef.current.rowsBeforeChange[rowId]) {
            unsavedChangesRef.current.rowsBeforeChange[rowId] = oldRow;
        }
        setHasUnsavedRows(true);
        return newRow;
    }, []);

    const discardChanges = React.useCallback(() => {
        setHasUnsavedRows(false);
        Object.values(unsavedChangesRef.current.rowsBeforeChange).forEach(
            (row) => {
                apiRef.current?.updateRows([row]);
            },
        );
        unsavedChangesRef.current = {
            unsavedRows: {},
            rowsBeforeChange: {},
        };
    }, [apiRef]);

    const saveChanges = React.useCallback(async () => {
        try {
            // Persist updates in the database
            setIsSaving(true);

            // Get the rows to delete
            const rowsToDelete = Object.values(
                unsavedChangesRef.current.unsavedRows,
            ).filter((row) => row._action === 'delete');

            // Delete the rows
            if (rowsToDelete.length > 0) {
                rowsToDelete.forEach(async (row) => {
                    const patient = await deactivatePatient(Number(row.id));
                });
            }
            setIsSaving(false);
            refetch();

            // // Get the rows to delete
            // const rowsToDelete = Object.values(
            //     unsavedChangesRef.current.unsavedRows,
            // ).filter((row) => row._action === 'delete');

            // // Delete the rows
            // if (rowsToDelete.length > 0) {
            //     rowsToDelete.forEach((row) => {
            //         apiRef.current?.updateRows([row]);
            //     });
            // }

            // Reset unsaved changes ref
            setHasUnsavedRows(false);
            unsavedChangesRef.current = {
                unsavedRows: {},
                rowsBeforeChange: {},
            };
        } catch (error) {
            // If there's an error, reset instead of committing any changes
            setIsSaving(false);
        }
    }, [apiRef]);

    const getRowClassName = React.useCallback(({ id }) => {
        const unsavedRow = unsavedChangesRef.current.unsavedRows[id];
        if (unsavedRow) {
            if (unsavedRow._action === 'delete') {
                return 'row--removed';
            }
            return 'row--edited';
        }
        return '';
    }, []);

    const bulkEditingContextValue = React.useMemo(
        () => ({
            unsavedChangesRef,
            setHasUnsavedRows,
            requestDelete: (row) => setPendingDeleteRow(row)
        }),
        [unsavedChangesRef],
    );

    return (
        <Stack sx={{ width: '100%' }}>
            <AlertDialog
                open={!!pendingDeleteRow}
                handleClose={handleCloseAlertDialog}
                handleConfirm={()=>handleConfirmAlertDialog(pendingDeleteRow)}
                title={`¿Dar de baja a  
                    ${!!pendingDeleteRow && (pendingDeleteRow.name + " " + pendingDeleteRow.surname)}?`}
                content="Esta acción es reversible. Si el usuario tiene alguna dependencia activa en el sistema
                se cancelará el proceso. En caso contrario, el usuario será dado de baja. "
            />
            <DrawerHeader />
            {error && (
                <Alert
                    severity='error'
                    onClose={() => {
                        setError(null);
                    }}
                    sx={{ margin: 2 }}
                >
                    {error}
                </Alert>
            )}
            <Box sx={{ width: '95%', marginY: 'auto', marginX: 'auto' }}>
                <Box sx={{ marginBottom: 2, display: 'flex' }}>
                    <Box>
                        <Button
                            disabled={!hasUnsavedRows}
                            loading={isSaving}
                            onClick={saveChanges}
                            startIcon={<SaveIcon />}
                            loadingPosition='start'
                        >
                            Guardar cambios
                        </Button>
                        <Button
                            disabled={!hasUnsavedRows || isSaving}
                            onClick={discardChanges}
                            startIcon={<RestoreIcon />}
                        >
                            Descartar cambios
                        </Button>
                    </Box>
                    <Box sx={{ mr: 'auto' }}>
                        <SearchBar
                            onChange={(e) => setSearchText(e.target.value)}
                            value={searchText}
                            placeholder="Busca por ID, NHC, DNI, nombre, apellidos"
                        />
                    </Box>
                    <Box>
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
                        <Button
                            component='label'
                            variant='outlined'
                            startIcon={<GroupAddIcon />}
                        >
                            Importar pacientes
                            <input
                                type='file'
                                hidden
                                accept='application/json'
                                onChange={handlePatientsFileSelect}
                            />
                        </Button>
                    </Box>
                </Box>
                <div style={{ height: 600 }}>
                    <BulkEditingContext.Provider
                        value={bulkEditingContextValue}
                    >
                        <DataGrid
                            rows={filteredPatients}
                            columns={columns}
                            apiRef={apiRef}
                            disableRowSelectionOnClick
                            processRowUpdate={processRowUpdate}
                            ignoreValueFormatterDuringExport
                            initialState={{
                                sorting: {
                                    sortModel: [
                                        { field: 'createdAt', sort: 'desc' },
                                    ], // Initial order by creation date
                                },
                            }}
                            sx={{
                                [`& .${gridClasses.row}.row--removed`]: {
                                    backgroundColor: (theme) => {
                                        if (theme.palette.mode === 'light') {
                                            return 'rgba(255, 170, 170, 0.3)';
                                        }
                                        return darken(
                                            'rgba(255, 170, 170, 1)',
                                            0.7,
                                        );
                                    },
                                },
                                [`& .${gridClasses.row}.row--edited`]: {
                                    backgroundColor: (theme) => {
                                        if (theme.palette.mode === 'light') {
                                            return 'rgba(255, 254, 176, 0.3)';
                                        }
                                        return darken(
                                            'rgba(255, 254, 176, 1)',
                                            0.6,
                                        );
                                    },
                                },
                            }}
                            loading={isSaving}
                            getRowClassName={getRowClassName}
                        />
                    </BulkEditingContext.Provider>
                </div>
            </Box>
        </Stack>
    );
}
