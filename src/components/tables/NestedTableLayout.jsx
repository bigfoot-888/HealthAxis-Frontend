import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import SearchBar from '../ui/SearchBar';

export default function NestedTableLayout({
    rows,
    columns,
    searchValue,
    onSearchChange,
    searchPlaceholder,
    onRowClick = () => {},
    actions,
    loading = false,
}) {
    return (
        <>
            <Box sx={{ marginBottom: 2, display: 'flex' }}>
                <Box sx={{ mr: 'auto' }}>
                    <SearchBar value={searchValue} onChange={onSearchChange} placeholder={searchPlaceholder} />
                </Box>
                <Box>{actions}</Box>
            </Box>

            <Box
                sx={(theme) => ({
                    backgroundColor: theme.palette.surfaceContainerLow,
                    borderRadius: 2,
                    padding: 1,
                    width: '100%',
                    height: 450,
                })}
            >
                <DataGrid
                    rows={rows}
                    columns={columns}
                    disableRowSelectionOnClick
                    hideFooterSelectedRowCount
                    ignoreValueFormatterDuringExport
                    columnVisibilityModel={{
                        createdAt: false,
                    }}
                    loading={loading}
                    initialState={{
                        sorting: {
                            sortModel: [{ field: 'createdAt', sort: 'desc' }],
                        },
                    }}
                    onRowClick={onRowClick}
                    sx={(theme) => ({
                        backgroundColor: theme.palette.surfaceContainerLowest,
                        border: `1px solid ${theme.palette.outlineVariant}`,

                        '& .MuiDataGrid-columnHeaders': {
                            borderBottom: `1px solid ${theme.palette.outlineVariant}`,
                        },

                        '& .MuiDataGrid-columnHeader, & .MuiDataGrid-filler': {
                            backgroundColor: theme.palette.surfaceContainer,
                            borderBottom: `1px solid ${theme.palette.outlineVariant}`,
                        },

                        '& .MuiDataGrid-columnHeaderTitle': {
                            fontWeight: 600,
                            color: theme.palette.onSurfaceVariant,
                        },

                        '& .MuiDataGrid-row:hover': {
                            backgroundColor: theme.palette.surfaceContainerLow,
                        },

                        '& .MuiDataGrid-row': {
                        cursor: 'pointer',
                        },
                    })}
                />
            </Box>
        </>
    );
}
