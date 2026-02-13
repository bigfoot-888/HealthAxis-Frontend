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
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import {
    useState,
    createContext,
    useContext,
    useEffect,
    useRef,
    useMemo,
    useCallback,
} from 'react';
import SearchBar from '../../../components/SearchBar';
import Alert from '@mui/material/Alert';
import AlertDialog from '../../../components/AlertDialog';
import { useAgendas } from '../hooks/useAgendas';
import { deactivateAgenda, reactivateAgenda } from '../api/agenda-api';
import FormDialog from '../../../components/FormDialog';
import CreateAgendaForm from './CreateAgendaForm';

const BulkEditingContext = createContext(null);

function ActionsCell(props) {
    const context = useContext(BulkEditingContext);
    const apiRef = useGridApiContext();
    if (!context) {
        return null;
    }
    const {
        unsavedChangesRef,
        setHasUnsavedRows,
        requestDelete,
        requestReactivation,
    } = context;
    const { id, row } = props;

    return (
        <GridActionsCell {...props}>
            {row.state === 'ACTIVE' && (
                <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label='Delete'
                    onClick={() => {
                        requestDelete(row);
                    }}
                />
            )}
            {row.state === 'INACTIVE' && (
                <GridActionsCellItem
                    icon={<RestoreIcon />}
                    label='Restore'
                    onClick={() => {
                        requestReactivation(row);
                    }}
                />
            )}

            <GridActionsCellItem
                icon={<EditIcon />}
                label='Edit'
                component={Link}
                to={`/agendas/edit/${row.uuid}`}
            ></GridActionsCellItem>
        </GridActionsCell>
    );
}

export default function BulkEditing({ agendas }) {
    const [searchText, setSearchText] = useState('');
    const [error, setError] = useState(null);
    const [filteredAgendas, setFilteredAgendas] = useState(agendas);
    const [openCreateForm, setOpenCreateForm] = useState(false);

    // Filter agendas whenever searchText or agendas change
    useEffect(() => {
        const lowerSearch = searchText.toLowerCase();
        setFilteredAgendas(
            agendas.filter((agenda) =>
                ['id', 'name', 'surname', 'email'].some((field) => {
                    const value = agenda[field]?.toString().toLowerCase() || '';
                    return value.includes(lowerSearch);
                }),
            ),
        );
    }, [searchText, agendas]);

    const apiRef = useGridApiRef();
    const { refetch } = useAgendas();
    const [pendingDeleteRow, setPendingDeleteRow] = useState(null);
    const [pendingReactivateRow, setPendingReactivateRow] = useState(null);
    const [hasUnsavedRows, setHasUnsavedRows] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const unsavedChangesRef = useRef({
        unsavedRows: {},
        rowsBeforeChange: {},
    });

    const handleCloseAlertDialog = (e) => {
        setPendingDeleteRow(null);
    };

    const handleConfirmAlertDialog = async (row) => {
        if (!row) {
            handleCloseAlertDialog();
            return;
        } else {
            const agenda = await deactivateAgenda(Number(row.id));
            handleCloseAlertDialog();
            refetch();
        }
    };

    const handleCloseReactivateDialog = (e) => {
        setPendingReactivateRow(null);
    };

    const handleConfirmReactivateDialog = async (row) => {
        if (!row) {
            handleCloseReactivateDialog();
            return;
        } else {
            const agenda = await reactivateAgenda(Number(row.id));
            handleCloseReactivateDialog();
            refetch();
        }
    };

    const handleSubmitCreateFormDialog = (e) => {
        setOpenCreateForm(false); 
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
                valueGetter: (value, row) => new Date(row.activePeriod?.opening_date)
            },
            {
                field: 'closing_date',
                headerName: 'Cierre Programado',
                type: 'date',
                flex: 2,
                valueGetter: (value, row) => new Date(row.activePeriod?.closing_date)
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
                renderCell: (params) => <ActionsCell {...params} />,
            },
        ];
    }, []);

    const processRowUpdate = useCallback((newRow, oldRow) => {
        const rowId = newRow.id;

        unsavedChangesRef.current.unsavedRows[rowId] = newRow;
        if (!unsavedChangesRef.current.rowsBeforeChange[rowId]) {
            unsavedChangesRef.current.rowsBeforeChange[rowId] = oldRow;
        }
        setHasUnsavedRows(true);
        return newRow;
    }, []);

    const getRowClassName = useCallback(({ id }) => {
        const unsavedRow = unsavedChangesRef.current.unsavedRows[id];
        if (unsavedRow) {
            if (unsavedRow._action === 'delete') {
                return 'row--removed';
            }
            return 'row--edited';
        }
        return '';
    }, []);

    const bulkEditingContextValue = useMemo(
        () => ({
            unsavedChangesRef,
            setHasUnsavedRows,
            requestDelete: (row) => setPendingDeleteRow(row),
            requestReactivation: (row) => setPendingReactivateRow(row),
        }),
        [unsavedChangesRef],
    );

    return (
        <Stack sx={{ width: '100%' }}>
            <AlertDialog
                open={!!pendingReactivateRow}
                handleClose={handleCloseReactivateDialog}
                handleConfirm={() =>
                    handleConfirmReactivateDialog(pendingReactivateRow)
                }
                title={`¿Reactivar la agenda con nombre  
                    ${!!pendingReactivateRow && pendingReactivateRow.name}?`}
                content='Esta acción es reversible. Si la agenda tiene alguna dependencia activa en el sistema
                se cancelará el proceso. En caso contrario, la agenda será reactivada. '
            />
            <AlertDialog
                open={!!pendingDeleteRow}
                handleClose={handleCloseAlertDialog}
                handleConfirm={() => handleConfirmAlertDialog(pendingDeleteRow)}
                title={`¿Dar de baja a la agenda con nombre
                    ${!!pendingDeleteRow && pendingDeleteRow.name}?`}
                content='Esta acción es reversible. Si la agenda tiene alguna dependencia activa en el sistema
                se cancelará el proceso. En caso contrario, la agenda será dada de baja. '
            />
            <CreateAgendaForm
                openCreateForm={openCreateForm}
                handleClose={()=>setOpenCreateForm(false)}
                handleSubmit={handleSubmitCreateFormDialog}
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
                    <Box sx={{ mr: 'auto' }}>
                        <SearchBar
                            onChange={(e) => setSearchText(e.target.value)}
                            value={searchText}
                            placeholder='Busca por ID, nombre, apellidos, correo'
                        />
                    </Box>
                    <Box>
                        <Button
                            variant='contained'
                            onClick={()=>setOpenCreateForm(true)}
                            startIcon={<PersonAddAltIcon />}
                            loadingPosition='start'
                            sx={{ mr: 2 }}
                        >
                            Añadir agenda
                        </Button>
                    </Box>
                </Box>
                <div style={{ height: 600 }}>
                    <BulkEditingContext.Provider
                        value={bulkEditingContextValue}
                    >
                        <DataGrid
                            rows={filteredAgendas}
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
