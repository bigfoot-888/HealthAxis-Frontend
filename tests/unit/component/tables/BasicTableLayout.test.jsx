import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BasicTableLayout from '@/components/tables/BasicTableLayout';

jest.mock('@mui/x-data-grid', () => ({
    DataGrid: ({ rows, columns, onRowClick }) => (
        <div>
            <div>DataGrid</div>
            {rows.map((row) => (
                <div key={row.id} data-testid='row' onClick={() => onRowClick({ row })}>
                    {row.name}
                </div>
            ))}
        </div>
    ),
}));

jest.mock('@/components/ui/SearchBar', () => (props) => (
    <input data-testid='search' value={props.value} onChange={props.onChange} placeholder={props.placeholder} />
));

jest.mock('@/components/tables', () => ({
    TableTopBar: ({ left, right }) => (
        <div>
            <div data-testid='left'>{left}</div>
            <div data-testid='right'>{right}</div>
        </div>
    ),
}));

describe('BasicTableLayout', () => {
    const rows = [
        { id: 1, name: 'Juan' },
        { id: 2, name: 'Pedro' },
    ];

    const columns = [{ field: 'name', headerName: 'Name' }];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders DataGrid with rows', () => {
        render(<BasicTableLayout rows={rows} columns={columns} />);

        expect(screen.getByText('DataGrid')).toBeInTheDocument();
        expect(screen.getByText('Juan')).toBeInTheDocument();
        expect(screen.getByText('Pedro')).toBeInTheDocument();
    });

    it('renders SearchBar when onSearchChange is provided', () => {
        render(
            <BasicTableLayout
                rows={rows}
                columns={columns}
                searchValue=''
                onSearchChange={jest.fn()}
                searchPlaceholder='Buscar...'
            />,
        );

        expect(screen.getByTestId('search')).toBeInTheDocument();
    });

    it('does not render SearchBar when onSearchChange is not provided', () => {
        render(<BasicTableLayout rows={rows} columns={columns} />);

        expect(screen.queryByTestId('search')).not.toBeInTheDocument();
    });

    it('calls onRowClick when row is clicked', async () => {
        const user = userEvent.setup();
        const handleRowClick = jest.fn();

        render(<BasicTableLayout rows={rows} columns={columns} onRowClick={handleRowClick} />);

        const row = screen.getAllByTestId('row')[0];

        await user.click(row);

        expect(handleRowClick).toHaveBeenCalled();
    });

    it('passes search value and handles change', async () => {
        const user = userEvent.setup();
        const handleChange = jest.fn();

        render(
            <BasicTableLayout
                rows={rows}
                columns={columns}
                searchValue='test'
                onSearchChange={handleChange}
                searchPlaceholder='Buscar...'
            />,
        );

        const input = screen.getByTestId('search');

        expect(input).toHaveValue('test');

        await user.type(input, 'a');

        expect(handleChange).toHaveBeenCalled();
    });
});
