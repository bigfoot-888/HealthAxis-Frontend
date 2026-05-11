import React from 'react';
import { Typography } from '@mui/material';
import { formatCreatedAt } from '@/utils/date-formatters';
import DashboardWidget from '@dashboards/components/ui/DashboardWidget';
import { ResponsiveContainer } from 'recharts';
import { APPOINTMENT_STATUS_CONFIG } from '@/shared/constants/appointment.constants';
import { useTheme } from '@mui/material/styles';
import CustomLineChart from '@dashboards/components/figures/CustomLineChart';
import CustomBarChart from '@dashboards/components/figures/CustomBarChart';
import CustomPieChart from '@dashboards/components/figures/CustomPieChart';

import { PATIENT_STATUS_CONFIG } from '@/shared/constants/patient.constants';
import { DIAGNOSIS_CLINICAL_STATUS_CONFIG, DIAGNOSIS_SEVERITY_CONFIG } from '@/shared/constants/diagnosis.constants';
import { TREATMENT_CLINICAL_STATUS_CONFIG } from '@/shared/constants/treatment.constants';
import CustomAppointmentsList from '@dashboards/components/figures/CustomAppointmentsList';

function getChartLabel(component, value) {
    const query = component.query;
    if (!query) return value;
    const { entity, groupBy } = query;
    if (entity === 'Appointment' && groupBy === 'status') 
        return APPOINTMENT_STATUS_CONFIG[value]?.label || value;
    if (entity === 'Patient' && groupBy === 'status') 
        return PATIENT_STATUS_CONFIG[value]?.label || value;
    if (entity === 'Diagnosis' && groupBy === 'clinicalStatus') 
        return DIAGNOSIS_CLINICAL_STATUS_CONFIG[value]?.label || value;
    if (entity === 'Diagnosis' && groupBy === 'severity') 
        return DIAGNOSIS_SEVERITY_CONFIG[value]?.label || value;
    if (entity === 'Treatment' && groupBy === 'clinicalStatus') 
        return TREATMENT_CLINICAL_STATUS_CONFIG[value]?.label || value;
    return value;
}

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
                        <CustomLineChart data={normalizeData(data, component)} config={config} />
                    </ResponsiveContainer>
                );

            case 'BAR_CHART':
                return (
                    <ResponsiveContainer width='100%' height='100%'>
                        <CustomBarChart data={normalizeData(data, component)} config={config} />
                    </ResponsiveContainer>
                );

            case 'PIE_CHART':
                return (
                    <ResponsiveContainer width='100%' height='100%'>
                        <CustomPieChart data={normalizeData(data, component)} config={config} />
                    </ResponsiveContainer>
                );

            case 'LIST':
                return (
                    <CustomAppointmentsList data={data}/>
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
function normalizeData(data, component) {
    if (!Array.isArray(data)) return data;
    return data.map((d) => ({
        ...d,
        y: Number(d.y),
        x: isDate(d.x) ? formatCreatedAt(d.x) : getChartLabel(component, d.x),
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
