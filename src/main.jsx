import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/App.jsx';
import { queryClient } from './lib/react-query.js';
import { QueryClientProvider } from '@tanstack/react-query';

import dayjs from 'dayjs';
import 'dayjs/locale/es';
dayjs.locale('es');

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='es'>
                <App />
            </LocalizationProvider>
        </QueryClientProvider>
    </StrictMode>,
);
