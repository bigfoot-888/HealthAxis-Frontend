import { Card } from "@mui/material";
export default function PrimaryInfoCard({ children }) {
    return (
        <Card
            elevation={0}
            sx={{
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'outlineVariant',
                bgcolor: 'surfaceContainerLowest',
                position: 'relative',

                '&::before, &::after': {
                    content: '""',
                    position: 'absolute',
                    width: 24,
                    height: 24,
                    pointerEvents: 'none',
                },

                '&::before': {
                    top: -1,
                    left: -1,
                    borderTop: '3px solid var(--template-palette-primary-main)',
                    borderLeft: '3px solid var(--template-palette-primary-main)',
                    borderTopLeftRadius: '16px',
                },

                '&::after': {
                    bottom: -1,
                    right: -1,
                    borderBottom: '3px solid var(--template-palette-primary-main)',
                    borderRight: '3px solid var(--template-palette-primary-main)',
                    borderBottomRightRadius: '16px',
                },
            }}
        >
            {children}
        </Card>
    );
}
