import { render, screen } from '@testing-library/react';
import BasicTextInput from '@/components/forms/inputs/BasicTextInput';
import React from 'react';

describe('BasicTextInput', () => {
    const mockRegister = jest.fn(() => ({
        onChange: jest.fn(),
        onBlur: jest.fn(),
        ref: jest.fn(),
    }));

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly with label and placeholder', () => {
        render(
            <BasicTextInput
                label='Nombre'
                name='name'
                register={mockRegister}
                errors={{}}
                placeholder='Introduce nombre'
            />,
        );
        expect(screen.getByLabelText('Nombre')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Introduce nombre')).toBeInTheDocument();
    });

    it('calls register with name and rules', () => {
        const rules = { required: 'Campo obligatorio' };
        render(<BasicTextInput label='Nombre' name='name' register={mockRegister} rules={rules} errors={{}} />);
        expect(mockRegister).toHaveBeenCalledWith('name', rules);
    });

    it('shows error message when error exists', () => {
        render(
            <BasicTextInput
                label='Nombre'
                name='name'
                register={mockRegister}
                errors={{
                    name: { message: 'Error de validación' },
                }}
            />,
        );

        expect(screen.getByText('Error de validación')).toBeInTheDocument();
    });
});
