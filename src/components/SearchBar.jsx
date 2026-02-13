import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    border: `1px solid transparent`, // Reserve space for the border, to avoid displacing other elements on focus
    transition: theme.transitions.create(['box-shadow', 'border-color']),
    '&:focus-within': {
    boxShadow: theme.palette.baseShadow,
    border: `1px solid ${alpha(theme.palette.outline, 0.4)}`,
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));
// const Search = styled('div')(({ theme }) => ({
//   position: 'relative',
//   borderRadius: theme.shape.borderRadius,
//   backgroundColor: theme.palette.background.paper,

//   // subtle depth
//   boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
//   transition: theme.transitions.create(['box-shadow']),

//   '&:hover': {
//     boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
//   },

//   '&:focus-within': {
//     boxShadow: `
//       0 2px 8px rgba(0,0,0,0.12),
//       0 0 0 3px ${alpha(theme.palette.primary.main, 0.25)}
//     `,
//   },
// }));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        '&::placeholder': {
            transition: theme.transitions.create('opacity'),
        },
        '&:focus::placeholder': {
            opacity: 0,
        },
        [theme.breakpoints.up('sm')]: {
            width: '40ch',
            '&:focus': {
                width: '50ch',
            },
        },
    },
}));

export default function SearchBar({placeholder, onChange, value}) {
    return (
        <Search>
            <SearchIconWrapper>
                <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
                placeholder={placeholder}
                inputProps={{ 'aria-label': 'buscar' }}
                onChange={onChange}
                value={value}
            />
        </Search>
    );
}
