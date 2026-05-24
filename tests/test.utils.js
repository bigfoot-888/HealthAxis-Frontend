import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material/styles';
import React from 'react';
import AppTheme from '@/lib/theme/AppTheme';

export function renderWithProviders(ui) {
    const queryClient = new QueryClient();

    return render(
        <QueryClientProvider client={queryClient}>
            <AppTheme>
                <BrowserRouter>{ui}</BrowserRouter>
            </AppTheme>
        </QueryClientProvider>,
    );
}
