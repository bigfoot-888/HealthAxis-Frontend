import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/App.jsx';
import { queryClient } from './lib/react-query.js';

import dayjs from 'dayjs';
import 'dayjs/locale/es';
dayjs.locale('es');

import { AppProvider } from './app/Provider.jsx';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AppProvider queryClient={queryClient}>
            <App />
        </AppProvider>
    </StrictMode>,
);
