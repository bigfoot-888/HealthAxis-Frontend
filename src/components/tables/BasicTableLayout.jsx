import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import SearchBar from '../SearchBar';
import DrawerHeader from '../layout/DrawerHeader';
import { Alert } from '@mui/material';
import ContentLayout from '../layout/ContentLayout';

export default function BasicTableLayout({
    rows,
    columns,
    searchValue,
    onSearchChange,
    searchPlaceholder,
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

            <div style={{ height: 600 }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    disableRowSelectionOnClick
                    ignoreValueFormatterDuringExport
                    loading={loading}
                    columnVisibilityModel={{
                        createdAt: false,
                    }}
                    initialState={{
                        sorting: {
                            sortModel: [{ field: 'createdAt', sort: 'desc' }],
                        },
                    }}
                />
            </div>
        </>
    );
}
