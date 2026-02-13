import * as React from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { colorSchemes, typography, shadows, shape } from './theme-primitives';
import { esES } from '@mui/x-data-grid/locales';

function AppTheme(props) {
    const { children, disableCustomTheme } = props;
    const theme = React.useMemo(() => {
        return disableCustomTheme
            ? {}
            : createTheme({
                  cssVariables: {
                      colorSchemeSelector: 'data-mui-color-scheme',
                      cssVarPrefix: 'template',
                  },
                  colorSchemes,
                  typography,
                  shadows,
                  shape,
                  components: {
                    MuiPaper: {
                    variants: [
                        {
                        props: { variant: 'surface-form' },
                        style: ({ theme }) => ({
                            backgroundColor: theme.palette.surfaceContainer,
                        }),
                        },
                        {
                        props: { variant: 'surface-form-outlined' },
                        style: ({ theme }) => ({
                            boxShadow: 'none',
                            border: `1px solid ${theme.palette.outlineVariant}`,
                            backgroundColor: theme.palette.surfaceContainerLow,
                        }),
                        },
                    ],
                    },
                  },
              },
              esES
            );
    }, [disableCustomTheme]);
    if (disableCustomTheme) {
        return <React.Fragment>{children}</React.Fragment>;
    }
    return (
        <ThemeProvider theme={theme} disableTransitionOnChange>
            {children}
        </ThemeProvider>
    );
}

AppTheme.propTypes = {
    children: PropTypes.node,
    disableCustomTheme: PropTypes.bool,
};

export default AppTheme;
