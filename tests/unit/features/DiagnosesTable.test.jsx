import { render } from '@testing-library/react';
import DiagnosesTable from '@diagnoses/components/views/DiagnosesTable';
import { act } from 'react';

const originalError = console.error;
beforeAll(() => {
    console.error = (...args) => {
        if (args[0]?.includes?.('not wrapped in act')) return;
        originalError(...args);
    };
});

const mockNavigate = jest.fn();

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: () => mockNavigate,
}));

jest.mock('@/hooks/useSearchFilter', () => ({
    useSearchFilter: (data) => data,
}));

let capturedProps = null;

jest.mock('@/components/tables/index', () => ({
    BasicTableLayout: (props) => {
        capturedProps = props;
        return <div data-testid='table' />;
    },
}));

jest.mock('@diagnoses/components/forms/UpdateDiagnosisClinicalStatusForm', () => ({
    __esModule: true,
    default: () => <div data-testid='clinical-form' />,
}));

jest.mock('@diagnoses/components/forms/UpdateDiagnosisStatusForm', () => ({
    __esModule: true,
    default: () => <div data-testid='status-form' />,
}));

const baseDiagnosis = {
    uuid: '1',
    name: 'Dolor',
    clinicalStatus: 'ACTIVE',
    status: 'INVALID',
    patient: { fullName: 'John Pork' },
    users: [{ fullName: 'Doctor Doc' }],
    diagnosedAt: new Date().toISOString(),
};

describe('DiagnosesTable', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('navigates on row click', () => {
        render(<DiagnosesTable diagnoses={[baseDiagnosis]} />);

        capturedProps.onRowClick({
            row: baseDiagnosis,
        });

        expect(mockNavigate).toHaveBeenCalledWith('/clinical-records/diagnoses/1');
    });

    it('opens clinical status form when clicking action', () => {
        render(<DiagnosesTable diagnoses={[baseDiagnosis]} />);

        act(() => {
            capturedProps.columns
                .find((c) => c.field === 'actions')
                .renderCell({ row: baseDiagnosis })
                .props.onUpdateClinicalStatus(baseDiagnosis);
        });

        expect(document.querySelector('[data-testid="clinical-form"]')).toBeInTheDocument();
    });

    it('opens record status form when clicking action', () => {
        render(<DiagnosesTable diagnoses={[baseDiagnosis]} />);

        act(() => {
            capturedProps.columns
                .find((c) => c.field === 'actions')
                .renderCell({ row: baseDiagnosis })
                .props.onUpdateStatus(baseDiagnosis);
        });

        expect(document.querySelector('[data-testid="status-form"]')).toBeInTheDocument();
    });

    it('passes search props to table', () => {
        render(<DiagnosesTable diagnoses={[baseDiagnosis]} />);

        expect(capturedProps.searchValue).toBe('');
        expect(typeof capturedProps.onSearchChange).toBe('function');
    });
});

afterAll(() => {
    console.error = originalError;
});
