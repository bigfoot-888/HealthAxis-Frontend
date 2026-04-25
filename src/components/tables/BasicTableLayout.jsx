import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import SearchBar from '../ui/SearchBar';
import DrawerHeader from '../layout/drawer/DrawerHeader';
import { Alert } from '@mui/material';
import ContentLayout from '../layout/ContentLayout';
import { TableTopBar } from '.';

export default function BasicTableLayout({
    rows,
    columns,
    searchValue,
    onSearchChange,
    searchPlaceholder,
    onRowClick = () => {},
    actions,
    loading = false,
    tableSpecificVisibility = {},
    sorting = {
        sortModel: [{ field: 'createdAt', sort: 'desc' }],
    },
}) {
    const baseVisibility = {
        createdAt: false,
    };
    return (
        <>
            {onSearchChange && (
                <TableTopBar
                    left={<SearchBar value={searchValue} onChange={onSearchChange} placeholder={searchPlaceholder} />}
                    right={actions}
                />
            )}

            <Box sx={{ mt: 1, height: 600, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    disableRowSelectionOnClick
                    ignoreValueFormatterDuringExport
                    loading={loading}
                    columnVisibilityModel={{
                        ...baseVisibility,
                        ...tableSpecificVisibility,
                    }}
                    initialState={{
                        sorting,
                    }}
                    onRowClick={onRowClick}
                    sx={(theme) => ({
                        backgroundColor: theme.palette.surfaceContainerLowest,

                        '& .MuiDataGrid-columnHeaders': {
                            borderBottom: `1px solid ${theme.palette.outlineVariant}`,
                        },

                        '& .MuiDataGrid-columnHeader, & .MuiDataGrid-filler': {
                            backgroundColor: theme.palette.surfaceContainerHigh,
                        },

                        '& .MuiDataGrid-columnSeparator': {
                            color: theme.palette.outlineVariant,
                        },

                        '& .MuiDataGrid-columnHeaderTitle': {
                            fontWeight: 600,
                            color: theme.palette.onSurfaceVariant,
                        },

                        // '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': {
                        //   outline: 'none',
                        // },

                        '& .MuiDataGrid-row': {
                            cursor: 'pointer',
                        },
                    })}
                />
            </Box>
        </>
    );
}
