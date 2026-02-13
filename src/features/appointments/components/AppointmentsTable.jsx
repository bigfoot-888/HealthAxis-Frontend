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
import { useUsers } from '../hooks/useUsers';
import { deactivateUser, reactivateUser } from '../api/user-api';
import SearchBar from '../../../components/SearchBar';
import { importUsers } from '../api/user-api';
import Alert from '@mui/material/Alert';
import AlertDialog from '../../../components/AlertDialog';

const BulkEditingContext = React.createContext(null);

function ActionsCell(props) {
    const context = React.useContext(BulkEditingContext);
    const apiRef = useGridApiContext();
    if (!context) {
        return null;
    }
    const { unsavedChangesRef, setHasUnsavedRows, requestDelete, requestReactivation } = context;
    const { id, row } = props;

    return (
        <GridActionsCell {...props}>
            {row.state === 'ACTIVE' && 
                (
            <GridActionsCellItem
                icon={<DeleteIcon />}
                label='Delete'
                onClick={() => {
                    requestDelete(row) 
                }}
            />
                )}
            {row.state === 'INACTIVE' && 
                (
            <GridActionsCellItem
                icon={<RestoreIcon />}
                label='Restore'
                onClick={() => {
                    requestReactivation(row) 
                }}
            />
                )}
            
            <GridActionsCellItem
                icon={<EditIcon />}
                label='Edit'
                component={Link}
                to={`/users/edit/${row.uuid}`}
            ></GridActionsCellItem>
        </GridActionsCell>
    );
}

export default function BulkEditing({ users }) {
    const [searchText, setSearchText] = React.useState('');
    const [error, setError] = React.useState(null);
    const [filteredUsers, setFilteredUsers] = React.useState(users);

    // Filter users whenever searchText or users change
    React.useEffect(() => {
        const lowerSearch = searchText.toLowerCase();

        setFilteredUsers(
            users.filter((user) =>
                ['id', 'name', 'surname', 'email'].some((field) => {
                    const value = user[field]?.toString().toLowerCase() || '';
                    return value.includes(lowerSearch);
                }),
            ),
        );
    }, [searchText, users]);

    const apiRef = useGridApiRef();
    const { refetch } = useUsers();
    const [pendingDeleteRow, setPendingDeleteRow] = React.useState(null);
    const [pendingReactivateRow, setPendingReactivateRow] = React.useState(null); 
    const [hasUnsavedRows, setHasUnsavedRows] = React.useState(false);
    const [isSaving, setIsSaving] = React.useState(false);
    const unsavedChangesRef = React.useRef({
        unsavedRows: {},
        rowsBeforeChange: {},
    });

    const handleUsersFileSelect = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        try {
            const text = await file.text();
            const users = JSON.parse(text);

            // // Optional validation
            // if (!Array.isArray(users))
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
            console.log(users)
            const res = await importUsers(users);
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
            const user = await deactivateUser(Number(row.id));
            handleCloseAlertDialog(); 
            refetch();
        }
    }

    const handleCloseReactivateDialog = (e) => {
        setPendingReactivateRow(null); 
    }
    const handleConfirmReactivateDialog = async (row) => {
        if (!row){
            handleCloseReactivateDialog(); 
            return; 
        }
        else {
            console.log("LLEGE")
            const user = await reactivateUser(Number(row.id)); 
            handleCloseReactivateDialog(); 
            refetch(); 
        }
    }

    const columns = React.useMemo(() => {
        return [
            { field: 'id', headerName: 'ID', flex: 1 },
            { field: 'name', headerName: 'Nombre', flex: 2 },
            { field: 'surname', headerName: 'Apellidos', flex: 2 },
            { field: 'email', headerName: 'Correo', flex: 3 },
            { field: 'phone', headerName: 'Teléfono', flex: 2 },
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
                    const user = await deactivateUser(Number(row.id));
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
            requestDelete: (row) => setPendingDeleteRow(row),
            requestReactivation: (row) => setPendingReactivateRow(row)
        }),
        [unsavedChangesRef],
    );

    return (
        <Stack sx={{ width: '100%' }}>
            <AlertDialog
                open={!!pendingReactivateRow}
                handleClose={handleCloseReactivateDialog}
                handleConfirm={()=>handleConfirmReactivateDialog(pendingReactivateRow)}
                title={`¿Reactivar la cuenta con nombre  
                    ${!!pendingReactivateRow && (pendingReactivateRow.name + " " + pendingReactivateRow.surname)}?`}
                content="Esta acción es reversible. Si el usuario tiene alguna dependencia activa en el sistema
                se cancelará el proceso. En caso contrario, el usuario será dado de baja. "
            />
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
                    {/* <Box>
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
                    </Box> */}
                    <Box sx={{ mr: 'auto' }}>
                        <SearchBar
                            onChange={(e) => setSearchText(e.target.value)}
                            value={searchText}
                            placeholder="Busca por ID, nombre, apellidos, correo"
                        />
                    </Box>
                    <Box>
                        <Button
                            component={Link}
                            variant='contained'
                            to='/users/new'
                            startIcon={<PersonAddAltIcon />}
                            loadingPosition='start'
                            sx={{ mr: 2 }}
                        >
                            Añadir usuario
                        </Button>
                        <Button
                            component='label'
                            variant='outlined'
                            startIcon={<GroupAddIcon />}
                        >
                            Importar usuarios
                            <input
                                type='file'
                                hidden
                                accept='application/json'
                                onChange={handleUsersFileSelect}
                            />
                        </Button>
                    </Box>
                </Box>
                <div style={{ height: 600 }}>
                    <BulkEditingContext.Provider
                        value={bulkEditingContextValue}
                    >
                        <DataGrid
                            rows={filteredUsers}
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
