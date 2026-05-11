import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import RHFRadioInput from '@/components/forms/inputs/RHFRadioInput';

const renderWithForm = (ui) => {
    const Wrapper = ({ children }) => {
        const { control } = useForm({
            defaultValues: { test: '' },
        });
        return children(control);
    };

    return render(<Wrapper>{ui}</Wrapper>);
};

describe('RHFRadioInput', () => {
    const options = [
        { value: 'A', label: 'Opción A' },
        { value: 'B', label: 'Opción B' },
    ];

    it('renders label', () => {
        renderWithForm((control) => (
            <RHFRadioInput name='test' control={control} label='Tipo' options={options} errors={{}} />
        ));

        expect(screen.getByText('Tipo')).toBeInTheDocument();
    });

    it('renders all options', () => {
        renderWithForm((control) => <RHFRadioInput name='test' control={control} options={options} errors={{}} />);

        expect(screen.getByLabelText('Opción A')).toBeInTheDocument();
        expect(screen.getByLabelText('Opción B')).toBeInTheDocument();
    });

    it('allows selecting an option', async () => {
        const user = userEvent.setup();

        renderWithForm((control) => <RHFRadioInput name='test' control={control} options={options} errors={{}} />);

        const optionA = screen.getByLabelText('Opción A');

        await user.click(optionA);

        expect(optionA).toBeChecked();
    });

    it('shows error message when exists', () => {
        renderWithForm((control) => (
            <RHFRadioInput
                name='test'
                control={control}
                options={options}
                errors={{
                    test: { message: 'Campo obligatorio' },
                }}
            />
        ));

        expect(screen.getByText('Campo obligatorio')).toBeInTheDocument();
    });
});
