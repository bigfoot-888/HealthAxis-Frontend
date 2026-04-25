import React from 'react';
import { Typography, Stack, Chip } from '@mui/material';
import { formatCreatedAt } from '@/utils/date-formatters';
import DashboardWidget from '@dashboards/components/ui/DashboardWidget';
import { List, ListItem, ListItemText } from '@mui/material';
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    BarChart,
    Bar,
    PieChart,
    Pie,
} from 'recharts';
import { APPOINTMENT_STATUS_CONFIG } from '@/shared/constants/appointment.constants';
import { SubtleChip } from '@/components/ui';

export default function DashboardComponentRenderer({ component }) {
    // Destructure the new payload structure
    const { vizType, config = {}, data, title } = component;

    function getStatusColor(status) {
        switch (status) {
            case 'SCHEDULED':
                return 'primary';
            case 'CHECKED_IN':
                return 'warning';
            case 'COMPLETED':
                return 'success';
            case 'CANCELLED':
                return 'error';
            default:
                return 'default';
        }
    }

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
                        <LineChart data={normalizeData(data)}>
                            <CartesianGrid strokeDasharray='3 3' stroke='var(--color-border-3)' />
                            <XAxis dataKey={config.xAxisKey || 'x'} />
                            <YAxis
                                label={
                                    config.yAxisLabel
                                        ? { value: config.yAxisLabel, angle: -90, position: 'insideLeft' }
                                        : undefined
                                }
                            />
                            <Tooltip formatter={(value) => [value, config.tooltipLabel || '']} />
                            <Line
                                type='monotone'
                                dataKey={config.yAxisKey || 'y'}
                                stroke={config.strokeColor || '#1976d2'}
                                strokeWidth={2}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                );

            case 'BAR_CHART':
                return (
                    <ResponsiveContainer width='100%' height='100%'>
                        <BarChart data={normalizeData(data)}>
                            <CartesianGrid strokeDasharray='3 3' stroke='var(--color-border-3)' vertical={false} />
                            <XAxis dataKey={config.xAxisKey || 'x'} />
                            <YAxis
                                label={
                                    config.yAxisLabel
                                        ? { value: config.yAxisLabel, angle: -90, position: 'insideLeft' }
                                        : undefined
                                }
                            />
                            <Tooltip formatter={(value) => [value, config.tooltipLabel || '']} />
                            <Bar
                                dataKey={config.yAxisKey || 'y'}
                                fill={config.fillColor || '#1976d2'}
                                radius={[4, 4, 0, 0]} // Optional: nicely rounded top corners for bars
                            />
                        </BarChart>
                    </ResponsiveContainer>
                );

            case 'PIE_CHART':
                return (
                    <ResponsiveContainer width='100%' height='100%'>
                        <PieChart>
                            <Pie
                                data={normalizeData(data)}
                                dataKey={config.valueKey || 'y'}
                                nameKey={config.nameKey || 'x'}
                                outerRadius={80}
                                fill={config.fillColor || '#1976d2'}
                                label
                            />
                            <Tooltip formatter={(value) => [value, config.tooltipLabel || '']} />
                        </PieChart>
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
                                                <SubtleChip label={APPOINTMENT_STATUS_CONFIG[item.status].label}/>
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
            // We no longer need the translation util because the DB now stores the custom title directly!
            formatTitle={() => title}
        />
    );
}

// =========================
// HELPERS
// =========================

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
