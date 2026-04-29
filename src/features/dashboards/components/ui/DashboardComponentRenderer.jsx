import React from 'react';
import { Typography, Stack, Chip } from '@mui/material';
import { formatCreatedAt } from '@/utils/date-formatters';
import DashboardWidget from '@dashboards/components/ui/DashboardWidget';
import { List, ListItem, ListItemText } from '@mui/material';
import { ResponsiveContainer } from 'recharts';
import { APPOINTMENT_STATUS_CONFIG } from '@/shared/constants/appointment.constants';
import { SubtleChip } from '@/components/ui';
import { useTheme } from '@mui/material/styles';
import CustomLineChart from '@dashboards/components/figures/CustomLineChart';
import CustomBarChart from '@dashboards/components/figures/CustomBarChart';
import CustomPieChart from '@dashboards/components/figures/CustomPieChart';

export default function DashboardComponentRenderer({ component, onDelete }) {
    const theme = useTheme();
    // Destructure the new payload structure
    const { vizType, config = {}, data, title } = component;

    const renderContent = () => {
        // Fallback if the query failed or returned no data
        if (!data) return <Typography color='text.secondary'>Sin datos</Typography>;

        switch (vizType) {
            case 'KPI':
                return (
                    <Typography variant='h4' sx={{ color: config.color || 'text.primary' }}>
                        {data.value}
                    </Typography>
                );

            case 'LINE_CHART':
                return (
                    <ResponsiveContainer width='100%' height='100%'>
                        <CustomLineChart data={normalizeData(data)} config={config} />
                    </ResponsiveContainer>
                );

            case 'BAR_CHART':
                return (
                    <ResponsiveContainer width='100%' height='100%'>
                        <CustomBarChart data={normalizeData(data)} config={config} />
                    </ResponsiveContainer>
                );

            case 'PIE_CHART':
                return (
                    <ResponsiveContainer width='100%' height='100%'>
                        <CustomPieChart data={normalizeData(data)} config={config} />
                    </ResponsiveContainer>
                );

            case 'LIST':
                return (
                    <List dense>
                        {!Array.isArray(data) || data.length === 0 ? (
                            <Typography color='text.secondary'>Sin datos</Typography>
                        ) : (
                            data.map((item, index) => (
                                <ListItem key={index} divider>
                                    <ListItemText
                                        primary={
                                            <Stack direction='row' spacing={1} alignItems='center'>
                                                <Typography variant='body2'>{item.patientId || 'Paciente'}</Typography>
                                                <SubtleChip label={APPOINTMENT_STATUS_CONFIG[item.status].label} />
                                            </Stack>
                                        }
                                        secondary={item.startTime ? formatCreatedAt(item.startTime) : ''}
                                    />
                                </ListItem>
                            ))
                        )}
                    </List>
                );

            default:
                return <Typography color='error'>Visualización no soportada: {vizType}</Typography>;
        }
    };

    return (
        <DashboardWidget
            component={component}
            renderContent={renderContent}
            formatTitle={() => title}
            onDelete={onDelete}
        />
    );
}

// Convert backend data into chart-friendly format
function normalizeData(data) {
    if (!Array.isArray(data)) return data;

    return data.map((d) => ({
        ...d,
        y: Number(d.y),
        x: isDate(d.x) ? formatCreatedAt(d.x) : d.x,
    }));
}

// Detect if value is a date
function isDate(value) {
    if (!value || typeof value !== 'string') return false;

    // A stricter check so random strings/numbers don't accidentally get formatted as dates
    const isISODate = /^\d{4}-\d{2}-\d{2}/.test(value);
    if (!isISODate) return false;

    return !isNaN(Date.parse(value));
}
