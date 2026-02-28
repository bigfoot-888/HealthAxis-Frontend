import { useState, useEffect, useMemo } from 'react';
import { GridActionsCellItem, GridActionsCell } from '@mui/x-data-grid';
import { Link } from 'react-router';
import Button from '@mui/material/Button';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import RestoreIcon from '@mui/icons-material/Restore';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import GroupAddIcon from '@mui/icons-material/GroupAdd';

import { useUsers } from '../hooks/useUsers';
import { deactivateUser, reactivateUser, importUsers } from '../api/user-api';
import AlertDialog from '../../../components/AlertDialog';
import BasicTableLayout from '../../../components/tables/BasicTableLayout';
import { Chip } from '@mui/material';
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
                to={`/users/edit/${row.uuid}`}
            ></GridActionsCellItem>
        </GridActionsCell>
    );
}

export default function BulkEditing({ users }) {
    const [searchText, setSearchText] = useState('');
    const [error, setError] = useState(null);
    const [filteredUsers, setFilteredUsers] = useState(users);

    // Filter users whenever searchText or users change
    useEffect(() => {
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

    const { refetch } = useUsers();
    const [pendingDeleteRow, setPendingDeleteRow] = useState(null);
    const [pendingReactivateRow, setPendingReactivateRow] = useState(null);
    // const [isSaving, setIsSaving] = useState(false);

    const handleUsersFileSelect = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        try {
            const text = await file.text();
            const users = JSON.parse(text);
            await importUsers(users);
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
            const user = await deactivateUser(Number(row.id));
            refetch();
        }
        handleCloseAlertDialog();
    };

    const handleCloseReactivateDialog = (e) => {
        setPendingReactivateRow(null);
    };

    const handleConfirmReactivateDialog = async (row) => {
        if (row) {
            await reactivateUser(Number(row.id));
            refetch();
        }
        handleCloseReactivateDialog();
    };

    const columns = useMemo(() => {
        return [
            {
                field: 'id',
                headerName: 'ID',
                flex: 1,
            },
            {
                field: 'roles',
                headerName: 'Cargos',
                flex: 3,
                valueGetter: (value, row) => {
                    return row.roles ? row.roles.map((role) => role.name).join(', ') : '';
                },
            },
            {
                field: 'name',
                headerName: 'Nombre',
                flex: 2,
            },
            {
                field: 'surname',
                headerName: 'Apellidos',
                flex: 2,
            },
            {
                field: 'email',
                headerName: 'Correo',
                flex: 3,
            },
            {
                field: 'phone',
                headerName: 'Teléfono',
                flex: 2,
            },
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
                flex: 3,
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
                content='Esta acción es reversible. Al finalizar, el usuario será reactivado. '
            />
            <AlertDialog
                open={!!pendingDeleteRow}
                handleClose={handleCloseAlertDialog}
                handleConfirm={() => handleConfirmAlertDialog(pendingDeleteRow)}
                title={`¿Dar de baja a ${!!pendingDeleteRow && pendingDeleteRow.name + ' ' + pendingDeleteRow.surname}?`}
                content='Esta acción es reversible. Si el usuario tiene alguna dependencia activa en el sistema
                se cancelará el proceso. En caso contrario, el usuario será dado de baja. '
            />
            <ContentLayout error={error} onErrorClose={() => setError(null)}>
                <BasicTableLayout
                    rows={filteredUsers}
                    columns={columns}
                    searchValue={searchText}
                    onSearchChange={(e) => setSearchText(e.target.value)}
                    searchPlaceholder='Busca por ID, nombre, apellidos, correo'
                    actions={
                        <>
                            <Button
                                component={Link}
                                variant='contained'
                                to='/users/new'
                                startIcon={<PersonAddAltIcon />}
                                loadingPosition='start'
                                sx={{
                                    mr: 2,
                                }}
                            >
                                Añadir usuario
                            </Button>
                            <Button component='label' variant='outlined' startIcon={<GroupAddIcon />}>
                                Importar usuarios
                                <input type='file' hidden accept='application/json' onChange={handleUsersFileSelect} />
                            </Button>
                        </>
                    }
                />
            </ContentLayout>
        </>
    );
}
