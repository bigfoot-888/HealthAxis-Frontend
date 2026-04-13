import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router';

function AppBreadcrumbs({ items = [], sx = {} }) {
    return (
        <Breadcrumbs sx={{ mb: 2, color: 'text.secondary', ...sx }}>
            {items.map((item, index) => {
                const isLast = index === items.length - 1;

                if (isLast || !item.to) {
                    return (
                        <Typography key={index} color='text.primary'>
                            {item.label}
                        </Typography>
                    );
                }

                return (
                    <Link key={index} component={RouterLink} to={item.to} underline='hover' color='inherit'>
                        {item.label}
                    </Link>
                );
            })}
        </Breadcrumbs>
    );
}

export default AppBreadcrumbs; 
