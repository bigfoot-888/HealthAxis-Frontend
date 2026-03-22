import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import {DrawerHeader} from '@/components/layout/drawer/index';
import {ErrorAlert} from '@/components/ui/index';

export default function ContentLayout({
    children,
    error=null,
    onErrorClose = ()=>{},
}) {
return (
        <Stack sx={{ width: '100%', height: '100%' }}>
            <DrawerHeader />
            <ErrorAlert error={error} onErrorClose={onErrorClose}/>

            <Box sx={{ 
                width: '95%', 
                marginX: 'auto', 
                flexGrow: 1, 
                display: 'flex', 
                flexDirection: 'column',
                pb: 3 
            }}>
                {children}
            </Box>
        </Stack>
    );
}
