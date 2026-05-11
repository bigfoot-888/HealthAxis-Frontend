import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AlertDialog from '@/components/dialogs/AlertDialog';

const originalError = console.error;
beforeAll(() => {
    console.error = (...args) => {
        if (args[0]?.includes?.('not wrapped in act')) return;
        originalError(...args);
    };
});

jest.mock('@/components/ui/index', () => ({
    ErrorAlert: ({ error }) => (error ? <div>Error: {error}</div> : null),
}));

describe('AlertDialog', () => {
    const defaultProps = {
        open: true,
        handleClose: jest.fn(),
        handleConfirm: jest.fn(),
        title: 'Confirmación',
        content: '¿Estás seguro......?',
        error: null,
        onErrorClose: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders title and content', () => {
        render(<AlertDialog {...defaultProps} />);

        expect(screen.getByText('Confirmación')).toBeInTheDocument();
        expect(screen.getByText('¿Estás seguro......?')).toBeInTheDocument();
    });

    it('calls handleClose when clicking Cancelar', async () => {
        const user = userEvent.setup();

        render(<AlertDialog {...defaultProps} />);

        await user.click(screen.getByText('Cancelar'));

        expect(defaultProps.handleClose).toHaveBeenCalled();
    });

    it('calls handleConfirm when clicking Aceptar', async () => {
        const user = userEvent.setup();

        render(<AlertDialog {...defaultProps} />);

        await user.click(screen.getByText('Aceptar'));

        expect(defaultProps.handleConfirm).toHaveBeenCalled();
    });

    it('renders error when provided', () => {
        render(<AlertDialog {...defaultProps} error='Error grave' />);

        expect(screen.getByText(/Error: Error grave/i)).toBeInTheDocument();
    });

    it('does not render error when not provided', () => {
        render(<AlertDialog {...defaultProps} error={null} />);

        expect(screen.queryByText(/Error:/i)).not.toBeInTheDocument();
    });
});

afterAll(() => {
    console.error = originalError;
});