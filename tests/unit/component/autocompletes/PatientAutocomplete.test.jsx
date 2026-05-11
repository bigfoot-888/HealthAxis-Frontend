import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import PatientAutocomplete from '@/components/forms/autocompletes/PatientAutocomplete';
import { getPatients } from '@/shared/api/formDataApi';

jest.mock('@/shared/api/formDataApi', () => ({
    getPatients: jest.fn(),
}));

const mockShowSnackbar = jest.fn();
jest.mock('@/app/SnackBarContext', () => ({
    useSnackbar: () => ({
        showSnackbar: mockShowSnackbar,
    }),
}));

const renderWithForm = (ui) => {
    const Wrapper = ({ children }) => {
        const { control } = useForm();
        return children(control);
    };
    return render(<Wrapper>{ui}</Wrapper>);
};

describe('PatientAutocomplete', () => {
    let user;

    beforeEach(() => {
        jest.useFakeTimers();
        user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('renders input with label', () => {
        renderWithForm((control) => (
            <PatientAutocomplete control={control} errors={{}} />
        ));

        expect(screen.getByLabelText(/Paciente/i)).toBeInTheDocument();
    });

    it('calls getPatients when typing (debounced)', async () => {
        getPatients.mockResolvedValue([]);

        renderWithForm((control) => (
            <PatientAutocomplete control={control} errors={{}} />
        ));

        const input = screen.getByRole('combobox');

        await user.type(input, 'jo');

        jest.advanceTimersByTime(500);

        await waitFor(() => {
            expect(getPatients).toHaveBeenCalledWith(
                expect.objectContaining({
                    query: 'jo',
                }),
            );
        });
    });

    it('shows snackbar on error', async () => {
        getPatients.mockRejectedValue(new Error('fail'));

        renderWithForm((control) => (
            <PatientAutocomplete control={control} errors={{}} />
        ));

        const input = screen.getByRole('combobox');

        await user.type(input, 'jo');

        jest.advanceTimersByTime(500);

        await waitFor(() => {
            expect(mockShowSnackbar).toHaveBeenCalled();
        });
    });

    it('shows options when getPatients returns results', async () => {
        getPatients.mockResolvedValue([
            { id: 1, name: 'Juan', surname: 'García', nhc: '12345' },
        ]);

        renderWithForm((control) => (
            <PatientAutocomplete control={control} errors={{}} />
        ));

        const input = screen.getByRole('combobox');

        await user.type(input, 'ju');

        jest.advanceTimersByTime(500);

        await waitFor(() => {
            expect(screen.getByText(/Juan García — 12345/i)).toBeInTheDocument();
        });
    });
});