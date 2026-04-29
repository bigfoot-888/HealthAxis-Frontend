import { QueryClientProvider } from '@tanstack/react-query';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { SnackbarProvider } from '@/app/SnackBarContext';

export function AppProvider({ children, queryClient }) {
    return (
        <QueryClientProvider client={queryClient}>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='es'>
                <SnackbarProvider>{children}</SnackbarProvider>
            </LocalizationProvider>
        </QueryClientProvider>
    );
}
