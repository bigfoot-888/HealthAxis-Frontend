import { Card, CardHeader, CardContent, IconButton, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function DashboardWidget({ component, formatTitle, renderContent, onDelete }) {
    const isDeletable = component.source === 'USER';
    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            }}
        >
            <CardHeader
                title={formatTitle(component.type)}
                slotProps={{
                    title: {
                        variant: 'subtitle1',
                        fontWeight: 600,
                        color: 'text.secondary',
                    },
                }}
                sx={{ pb: 0 }}
                action={
                    isDeletable && (
                        <Tooltip title='Eliminar componente'>
                            <IconButton size='small' onClick={() => onDelete(component)} sx={{mt: 0.5}}>
                                <DeleteIcon fontSize='small' />
                            </IconButton>
                        </Tooltip>
                    )
                }
            />

            <CardContent
                sx={{
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    '&:last-child': { pb: 2 },
                }}
            >
                {renderContent()}
            </CardContent>
        </Card>
    );
}
