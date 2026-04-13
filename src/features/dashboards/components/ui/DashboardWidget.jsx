import { Card, CardHeader, CardContent } from '@mui/material';

export default function DashboardWidget({ component, formatTitle, renderContent}) {
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
                        color: 'text.secondary'
                    }
                }}
                sx={{ pb: 0 }} 
            />
            <CardContent 
                sx={{ 
                    flex: 1, 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    '&:last-child': { pb: 2 } 
                }}
            >
                {renderContent()}
            </CardContent>
        </Card>
    );
}