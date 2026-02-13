
import AppTheme from '../lib/theme/AppTheme';
import CssBaseline from '@mui/material/CssBaseline';
import { RouterProvider } from 'react-router';
import { router } from './router';

export default function App() {
    return (
        <AppTheme>
            <CssBaseline />
            <RouterProvider router={router} />;
        </AppTheme>
    );
}


