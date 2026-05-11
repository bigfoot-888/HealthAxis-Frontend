import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateAppointmentForm from '@/features/appointments/components/forms/CreateAppointmentForm';
import { MemoryRouter } from 'react-router';

const mockNavigate = jest.fn();
const mockShowSnackbar = jest.fn();
const mockCreateAppointment = jest.fn();
const mockInvalidate = jest.fn();

const renderForm = () => render(
    <MemoryRouter>
        <CreateAppointmentForm />
    </MemoryRouter>
);

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: () => mockNavigate,
    useLocation: () => ({
        state: { from: '/appointments' },
    }),
}));

jest.mock('@appointments/api/appointment.api', () => ({
    createAppointment: (...args) => mockCreateAppointment(...args),
}));

jest.mock('@tanstack/react-query', () => ({
    useQueryClient: () => ({}),
}));

jest.mock('@/app/SnackBarContext', () => ({
    useSnackbar: () => ({
        showSnackbar: mockShowSnackbar,
    }),
}));

jest.mock('@appointments/utils/appointment-query.utils', () => ({
    invalidateCreateAppointmentQueries: (...args) => mockInvalidate(...args),
}));

jest.mock('@/components/forms/autocompletes', () => ({
    PatientAutocomplete: ({ control }) => (
        <input data-testid='patient' onChange={(e) => (control._formValues.patient = e.target.value)} />
    ),
    UserAutocomplete: ({ control }) => (
        <input data-testid='user' onChange={(e) => (control._formValues.user = e.target.value)} />
    ),
}));

jest.mock('@/components/forms/pickers', () => ({
    RHFDateTimePicker: ({ control }) => (
        <input data-testid='date' onChange={(e) => (control._formValues.startTime = e.target.value)} />
    ),
}));

jest.mock('@/components/forms/inputs', () => ({
    BasicTextInput: ({ name, register }) => <input data-testid={name} {...register(name)} />,
    SelectInput: ({ name, control }) => (
        <select data-testid={name} onChange={(e) => (control._formValues[name] = e.target.value)}>
            <option value=''>--</option>
            <option value='IN_PERSON'>IN_PERSON</option>
        </select>
    ),
}));

jest.mock('@/components/forms', () => ({
    BasicFormLayout: ({ children }) => <div>{children}</div>,
}));

jest.mock('@/components/ui', () => ({
    ErrorAlert: ({ error }) => (error ? <div data-testid='error'>error</div> : null),
}));

describe('CreateAppointmentForm', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('submits form and navigates on success', async () => {
        mockCreateAppointment.mockResolvedValue();

        renderForm(<CreateAppointmentForm />);

        await userEvent.type(screen.getByTestId('patient'), '1');
        await userEvent.type(screen.getByTestId('user'), '2');
        await userEvent.type(screen.getByTestId('date'), '2025-01-01');
        await userEvent.type(screen.getByTestId('reason'), 'Consulta');

        await userEvent.selectOptions(screen.getByTestId('type'), 'IN_PERSON');

        await userEvent.click(screen.getByText('Aceptar'));

        await waitFor(() => {
            expect(mockCreateAppointment).toHaveBeenCalled();
            expect(mockNavigate).toHaveBeenCalledWith('/appointments');
            expect(mockShowSnackbar).toHaveBeenCalled();
        });
    });

    it('shows error when API fails', async () => {
        mockCreateAppointment.mockRejectedValue(new Error('fail'));

        renderForm(<CreateAppointmentForm />);

        await userEvent.type(screen.getByTestId('patient'), '1');
        await userEvent.type(screen.getByTestId('user'), '2');
        await userEvent.type(screen.getByTestId('date'), '2025-01-01');
        await userEvent.type(screen.getByTestId('reason'), 'Consulta');

        await userEvent.selectOptions(screen.getByTestId('type'), 'IN_PERSON');

        await userEvent.click(screen.getByText('Aceptar'));

        await waitFor(() => {
            expect(screen.getByTestId('error')).toBeInTheDocument();
        });
    });

    it('shows validation errors when submitting empty form', async () => {
        mockCreateAppointment.mockRejectedValue({
            response: { data: { errors: { reason: { message: 'El motivo es obligatorio' } } } },
        });

        renderForm();

        await userEvent.click(screen.getByText('Aceptar'));

        await waitFor(() => {
            expect(screen.getByTestId('error')).toBeInTheDocument();
        });
    });
});
