import { screen } from '@testing-library/react';
import { renderWithProviders } from './test.utils';
import React from 'react';

function TestComponent() {
    return <div>Hello test</div>;
}

test('renders correctly', () => {
    renderWithProviders(<TestComponent />);
    expect(screen.getByText('Hello test')).toBeInTheDocument();
});
