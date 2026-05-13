import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EditDiagnosisForm from '@diagnoses/components/forms/EditDiagnosisForm';
import { MemoryRouter } from 'react-router';

const mockNavigate = jest.fn();
const mockShowSnackbar = jest.fn();
const mockUpdateDiagnosis = jest.fn();
const mockInvalidate = jest.fn();

const renderForm = (diagnosis) =>
    render(
        <MemoryRouter>
            <EditDiagnosisForm diagnosis={diagnosis} />
        </MemoryRouter>,
    );

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: () => mockNavigate,
    useLocation: () => ({
        state: { from: '/clinical-records/diagnoses' },
    }),
}));

jest.mock('@diagnoses/api/diagnosis.api', () => ({
    updateDiagnosis: (...args) => mockUpdateDiagnosis(...args),
}));

jest.mock('@tanstack/react-query', () => ({
    useQueryClient: () => ({}),
}));

jest.mock('@/app/SnackBarContext', () => ({
    useSnackbar: () => ({
        showSnackbar: mockShowSnackbar,
    }),
}));

jest.mock('@diagnoses/utils/diagnosis-query.utils', () => ({
    invalidateEditDiagnosisQueries: (...args) => mockInvalidate(...args),
}));

jest.mock('@/components/forms/inputs', () => ({
    BasicTextInput: ({ name, register }) => <input data-testid={name} {...register(name)} />,
    SelectInput: ({ name, control }) => (
        <select data-testid={name} onChange={(e) => (control._formValues[name] = e.target.value)}>
            <option value=''>--</option>
            <option value='LOW'>LOW</option>
        </select>
    ),
}));

jest.mock('@/components/forms/autocompletes', () => ({
    AppointmentAutocomplete: ({ control }) => (
        <input data-testid='appointment' onChange={(e) => (control._formValues.appointment = e.target.value)} />
    ),
}));

jest.mock('@diagnoses/components/ui/DiagnosisProfessionals', () => ({
    DiagnosisProfessionalsField: ({ control }) => (
        <input data-testid='users' onChange={(e) => (control._formValues.users = [{ user: e.target.value }])} />
    ),
}));

jest.mock('@/components/forms', () => ({
    BasicFormLayout: ({ children }) => <div>{children}</div>,
}));

jest.mock('@/components/ui', () => ({
    ErrorAlert: ({ error }) => (error ? <div data-testid='error'>error</div> : null),
}));

const baseDiagnosis = {
    uuid: '1',
    name: 'Dolor',
    description: '',
    notes: '',
    severity: 'LOW',
    appointment: null,
    users: [
        {
            fullName: 'Super doc',
            assignment: { role: 'AUTHOR' },
        },
    ],
};

describe('EditDiagnosisForm', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('submits form and navigates on success', async () => {
        mockUpdateDiagnosis.mockResolvedValue();

        renderForm(baseDiagnosis);

        await userEvent.type(screen.getByTestId('name'), 'Piel irritada');
        await userEvent.selectOptions(screen.getByTestId('severity'), 'LOW');
        await userEvent.type(screen.getByTestId('users'), '1');

        await userEvent.click(screen.getByText('Guardar cambios'));

        await waitFor(() => {
            expect(mockUpdateDiagnosis).toHaveBeenCalled();
            expect(mockNavigate).toHaveBeenCalledWith('/clinical-records/diagnoses');
            expect(mockShowSnackbar).toHaveBeenCalled();
        });
    });

    it('shows error when API fails', async () => {
        mockUpdateDiagnosis.mockRejectedValue(new Error('error......'));

        renderForm(baseDiagnosis);

        await userEvent.type(screen.getByTestId('name'), 'Nuevo nombre');
        await userEvent.selectOptions(screen.getByTestId('severity'), 'LOW');
        await userEvent.type(screen.getByTestId('users'), '1');

        await userEvent.click(screen.getByText('Guardar cambios'));

        await waitFor(() => {
            expect(screen.getByTestId('error')).toBeInTheDocument();
        });
    });

    it('shows validation errors when submitting empty form', async () => {
        mockUpdateDiagnosis.mockRejectedValue({
            response: {
                data: {
                    errors: {
                        name: { message: 'El nombre es obligatorio' },
                    },
                },
            },
        });

        renderForm(baseDiagnosis);

        await userEvent.clear(screen.getByTestId('name'));

        await userEvent.click(screen.getByText('Guardar cambios'));

        await waitFor(() => {
            expect(screen.getByTestId('error')).toBeInTheDocument();
        });
    });
});
