import React from 'react';
import {
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    BarChart,
    Bar,
} from 'recharts';

export default function CustomBarChart({ data, config }) {
    return (
        <BarChart data={data}>
            <CartesianGrid stroke='var(--template-palette-outlineVariant)' strokeDasharray='3 3' vertical={false} />

            <XAxis dataKey={config.xAxisKey || 'x'} stroke='var(--template-palette-onSurfaceVariant)' />

            <YAxis
                stroke='var(--template-palette-onSurfaceVariant)'
                label={config.yAxisLabel ? { value: config.yAxisLabel, angle: -90, position: 'insideLeft' } : undefined}
            />

            <Tooltip
                formatter={(value) => [value, config.tooltipLabel || '']}
                contentStyle={{
                    backgroundColor: 'var(--template-palette-surfaceContainerHigh)',
                    border: '1px solid var(--template-palette-outlineVariant)',
                    borderRadius: 8,
                }}
                labelStyle={{
                    color: 'var(--template-palette-onSurface)',
                }}
            />

            <Bar
                dataKey={config.yAxisKey || 'y'}
                fill={config.fillColor || 'var(--template-palette-primary-main)'}
                radius={[4, 4, 0, 0]}
            />
        </BarChart>
    );
}
