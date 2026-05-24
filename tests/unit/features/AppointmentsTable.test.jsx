import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AppointmentsTable from '@appointments/components/views/AppointmentsTable';
import { act } from 'react';
import { waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../test.utils';

const originalError = console.error;
beforeAll(() => {
    console.error = (...args) => {
        if (args[0]?.includes?.('not wrapped in act')) return;
        originalError(...args);
    };
});

const mockShowSnackbar = jest.fn();
const mockNavigate = jest.fn();
const mockUpdateStatus = jest.fn();

jest.mock('@/app/SnackBarContext', () => ({
    useSnackbar: () => ({
        showSnackbar: mockShowSnackbar,
    }),
}));

jest.mock('@appointments/api/appointment.api', () => ({
    updateAppointmentStatus: (...args) => mockUpdateStatus(...args),
}));

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: () => mockNavigate,
}));

let capturedProps = null;

jest.mock('@/components/tables/BasicTableLayout', () => ({
    __esModule: true,
    default: (props) => {
        capturedProps = props;
        return <div data-testid='table' />;
    },
}));

jest.mock('@/components/dialogs/AlertDialog', () => ({
    __esModule: true,
    default: ({ handleConfirm }) => <button onClick={handleConfirm}>confirm</button>,
}));

const baseAppointment = {
    uuid: '1',
    status: 'SCHEDULED',
    startTime: new Date().toISOString(),
    reason: 'Consulta',
    user: { fullName: 'Doctor' },
    patient: { fullName: 'Paciente' },
};

describe('AppointmentsTable', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

it('calls updateAppointmentStatus with CHECKED_IN', async () => {
    mockUpdateStatus.mockResolvedValue();

    renderWithProviders(<AppointmentsTable appointments={[baseAppointment]} setError={jest.fn()} searchText='' />);

    act(() => {
        capturedProps.columns
            .find((c) => c.field === 'actions')
            .renderCell({ row: baseAppointment })
            .props.onCheckIn(baseAppointment);
    });

    await waitFor(() => {
        expect(screen.getByText('confirm')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText('confirm'));

    expect(mockUpdateStatus).toHaveBeenCalledWith('1', 'CHECKED_IN');
});

it('calls updateAppointmentStatus with COMPLETED', async () => {
    mockUpdateStatus.mockResolvedValue();

    const checkedInAppointment = {
        ...baseAppointment,
        status: 'CHECKED_IN',
    };

    renderWithProviders(<AppointmentsTable appointments={[checkedInAppointment]} setError={jest.fn()} searchText='' />);

    act(() => {
        capturedProps.columns
            .find((c) => c.field === 'actions')
            .renderCell({ row: checkedInAppointment })
            .props.onComplete(checkedInAppointment);
    });

    await waitFor(() => {
        expect(screen.getByText('confirm')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText('confirm'));

    expect(mockUpdateStatus).toHaveBeenCalledWith('1', 'COMPLETED');
});

    it('navigates on row click', () => {
        renderWithProviders(<AppointmentsTable appointments={[baseAppointment]} setError={jest.fn()} searchText='' />);

        capturedProps.onRowClick({
            row: baseAppointment,
        });

        expect(mockNavigate).toHaveBeenCalledWith('/appointments/1');
    });

    it('computes priority correctly', () => {
        const now = new Date();

        const data = [
            { ...baseAppointment, status: 'CHECKED_IN' }, // 0
            { ...baseAppointment, status: 'SCHEDULED' }, // 1
            { ...baseAppointment, status: 'OTHER', startTime: new Date(now.getTime() + 100000).toISOString() }, // 2
            { ...baseAppointment, status: 'OTHER', startTime: new Date(now.getTime() - 100000).toISOString() }, // 3
        ];

        renderWithProviders(<AppointmentsTable appointments={data} setError={jest.fn()} searchText='' />);

        const rows = capturedProps.rows;

        expect(rows[0].priority).toBe(0);
        expect(rows[1].priority).toBe(1);
        expect(rows[2].priority).toBe(2);
        expect(rows[3].priority).toBe(3);
    });
});

afterAll(() => {
    console.error = originalError;
});