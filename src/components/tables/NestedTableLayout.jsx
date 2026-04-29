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
                        backgroundColor: 'var(--template-palette-surfaceContainerLowest)',
                        border: `1px solid ${'var(--template-palette-outlineVariant)'}`,

                        '& .MuiDataGrid-columnHeaders': {
                            borderBottom: `1px solid ${'var(--template-palette-outlineVariant)'}`,
                        },

                        '& .MuiDataGrid-columnHeader, & .MuiDataGrid-filler': {
                            backgroundColor: 'var(--template-palette-surfaceContainer)',
                            borderBottom: `1px solid ${'var(--template-palette-outlineVariant)'}`,
                        },

                        '& .MuiDataGrid-columnHeaderTitle': {
                            fontWeight: 600,
                            color: 'var(--template-palette-onSurfaceVariant)',
                        },

                        '& .MuiDataGrid-row:hover': {
                            backgroundColor: 'var(--template-palette-surfaceContainerLow)',
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
