import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router';
import { GridActionsCellItem, GridActionsCell } from '@mui/x-data-grid';

import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import RestoreIcon from '@mui/icons-material/Restore';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';

import { useUsers } from '@users/hooks/useUsers';
import { deactivateUser, reactivateUser, importUsers } from '@users/api/user.api';

import { AlertDialog } from '@/components/dialogs/index';
import { BasicTableLayout } from '@/components/tables/index';
import { ContentLayout } from '@/components/layout/index';
import { useSearchFilter } from '@/hooks/useSearchFilter';
import { handleApiError } from '@/utils/handle-errors';
import { useSnackbar } from '@/app/SnackBarContext';
import { USER_COLUMNS } from '@users/config/user.columns';

function ActionsCell({ row, onDelete, onReactivate, ...gridParams }) {
    return (
        <GridActionsCell {...gridParams}>
            {row.status === 'ACTIVE' && (
                <GridActionsCellItem icon={<DeleteIcon />} showInMenu label='Dar de baja' onClick={() => onDelete(row)} />
            )}
            {row.status === 'INACTIVE' && (
                <GridActionsCellItem
                    icon={<RestoreIcon />}
                    showInMenu
                    label='Reactivar'
                    onClick={() => onReactivate(row)}
                />
            )}

            <GridActionsCellItem
                icon={<EditIcon />}
                showInMenu
                label='Editar'
                component={Link}
                to={`/users/edit/${row.uuid}`}
                state={{ from: `/users` }}
            ></GridActionsCellItem>
        </GridActionsCell>
    );
}

export default function UsersTable({ users }) {
    const [searchText, setSearchText] = useState('');
    const [error, setError] = useState(null);
    const { showSnackbar } = useSnackbar();

    const filteredUsers = useSearchFilter(users, searchText, ['id', 'name', 'surname', 'email']);

    const navigate = useNavigate();
    const { refetch } = useUsers();
    const [userToDelete, setUserToDelete] = useState(null);
    const [userToReactivate, setUserToReactivate] = useState(null);

    const handleUsersFileSelect = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        try {
            const text = await file.text();
            const users = JSON.parse(text);
            await importUsers(users);
            refetch();
            showSnackbar({ message: 'Usuarios creados correctamente' });
        } catch (err) {
            handleApiError(err, setError, null);
        }
        event.target.value = '';
    };

    const handleCloseAlertDialog = (e) => {
        setError(null);
        setUserToDelete(null);
    };

    const handleConfirmAlertDialog = async (row) => {
        try {
            if (row) {
                await deactivateUser(row.uuid);
                refetch();
            }
            handleCloseAlertDialog();
            showSnackbar({ message: 'Usuario dado de baja correctamente' });
        } catch (err) {
            handleApiError(err, setError, null);
        }
    };

    const handleCloseReactivateDialog = (e) => {
        setError(null);
        setUserToReactivate(null);
    };

    const handleConfirmReactivateDialog = async (row) => {
        try {
            if (row) {
                await reactivateUser(row.uuid);
                refetch();
            }
            handleCloseReactivateDialog();
            showSnackbar({ message: 'Usuario reactivado correctamente' });
        } catch (err) {
            handleApiError(err, setError, null);
        }
    };

    const columns = useMemo(() => {
        return [
            USER_COLUMNS.id,
            USER_COLUMNS.roles,
            USER_COLUMNS.name,
            USER_COLUMNS.surname,
            USER_COLUMNS.email,
            USER_COLUMNS.phone,
            USER_COLUMNS.status,
            USER_COLUMNS.createdAt,
            {
                field: 'actions',
                type: 'actions',
                flex: 2,
                renderCell: (params) => (
                    <ActionsCell {...params} onDelete={setUserToDelete} onReactivate={setUserToReactivate} />
                ),
            },
        ];
    }, []);

    return (
        <>
            <AlertDialog
                open={!!userToReactivate}
                handleClose={handleCloseReactivateDialog}
                handleConfirm={() => handleConfirmReactivateDialog(userToReactivate)}
                title={`¿Reactivar la cuenta de ${!!userToReactivate && userToReactivate.name + ' ' + userToReactivate.surname}?`}
                content='Esta acción es reversible. Al finalizar, el usuario será reactivado. '
                error={error}
                onErrorClose={() => setError(null)}
            />
            <AlertDialog
                open={!!userToDelete}
                handleClose={handleCloseAlertDialog}
                handleConfirm={() => handleConfirmAlertDialog(userToDelete)}
                title={`¿Dar de baja a ${!!userToDelete && userToDelete.name + ' ' + userToDelete.surname}?`}
                content='Esta acción es reversible. Si el usuario tiene alguna dependencia activa en el sistema
                se cancelará el proceso. En caso contrario, el usuario será dado de baja. '
                error={error}
                onErrorClose={() => setError(null)}
            />
            <ContentLayout
                error={!userToDelete && !userToReactivate ? error : null}
                onErrorClose={() => setError(null)}
            >
                <BasicTableLayout
                    rows={filteredUsers}
                    columns={columns}
                    searchValue={searchText}
                    onSearchChange={(e) => setSearchText(e.target.value)}
                    searchPlaceholder='Busca por ID, nombre, apellidos, correo'
                    onRowClick={(params) => {
                        navigate(`/users/${params.row.uuid}`);
                    }}
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
                        </>
                    }
                />
            </ContentLayout>
        </>
    );
}
