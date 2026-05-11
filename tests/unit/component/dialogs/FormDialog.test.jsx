import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormDialog from '@/components/dialogs/FormDialog';

jest.mock('@/components/ui/index', () => ({
    ErrorAlert: ({ error }) => (error ? <div>Error: {error}</div> : null),
}));

describe('FormDialog', () => {
    const defaultProps = {
        open: true,
        handleClose: jest.fn(),
        handleSubmit: jest.fn((e) => e.preventDefault()),
        title: 'Test test',
        children: <div>text in test</div>,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('does not render when open is false', () => {
        render(<FormDialog {...defaultProps} open={false} />);

        expect(screen.queryByText('Test test')).not.toBeInTheDocument();
    });

    it('renders title and children when open is true', () => {
        render(<FormDialog {...defaultProps} />);

        expect(screen.getByText('Test test')).toBeInTheDocument();
        expect(screen.getByText('text in test')).toBeInTheDocument();
    });

    it('calls handleClose when clicking Cancelar', async () => {
        const user = userEvent.setup();

        render(<FormDialog {...defaultProps} />);

        const cancelButton = screen.getByText('Cancelar');

        await user.click(cancelButton);

        expect(defaultProps.handleClose).toHaveBeenCalled();
    });

    it('calls handleSubmit when submitting form', async () => {
        const user = userEvent.setup();

        render(<FormDialog {...defaultProps} />);

        const submitButton = screen.getByText('Aceptar');

        await user.click(submitButton);

        expect(defaultProps.handleSubmit).toHaveBeenCalled();
    });

    it('renders error alert when error exists', () => {
        render(<FormDialog {...defaultProps} error='Algo salió mal' />);

        expect(screen.getByText(/Error: Algo salió mal/i)).toBeInTheDocument();
    });
});
