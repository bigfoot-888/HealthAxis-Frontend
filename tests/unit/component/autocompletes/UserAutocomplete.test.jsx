import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import UserAutocomplete from '@/components/forms/autocompletes/UserAutocomplete';
import { getUsers } from '@/shared/api/formDataApi';

jest.mock('@/shared/api/formDataApi', () => ({
    getUsers: jest.fn(),
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

describe('UserAutocomplete', () => {
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
        renderWithForm((control) => <UserAutocomplete name='user' control={control} />);
        expect(screen.getByLabelText(/Profesional/i)).toBeInTheDocument();
    });

    it('calls getUsers when typing (debounced)', async () => {
        getUsers.mockResolvedValue([]);
        renderWithForm((control) => <UserAutocomplete name='user' control={control} />);

        const input = screen.getByRole('combobox');

        await user.type(input, 'jo');

        jest.advanceTimersByTime(500);

        await waitFor(() => {
            expect(getUsers).toHaveBeenCalledWith(
                expect.objectContaining({
                    query: 'jo',
                }),
            );
        });
    });

    it('shows snackbar on error', async () => {
        getUsers.mockRejectedValue(new Error('fail'));
        renderWithForm((control) => <UserAutocomplete name='user' control={control} />);

        const input = screen.getByRole('combobox');
        await user.type(input, 'jo');

        jest.advanceTimersByTime(500);

        await waitFor(() => {
            expect(mockShowSnackbar).toHaveBeenCalled();
        });
    });

    it('shows options when getUsers returns results', async () => {
        getUsers.mockResolvedValue([{ id: 1, uuid: 'abc', name: 'Juan', surname: 'García' }]);
        renderWithForm((control) => <UserAutocomplete name='user' control={control} />);

        const input = screen.getByRole('combobox');
        await user.type(input, 'ju');

        jest.advanceTimersByTime(500);

        await waitFor(() => {
            expect(screen.getByText(/Juan García/i)).toBeInTheDocument();
        });
    });
});
