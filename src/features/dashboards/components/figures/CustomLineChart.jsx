import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
export default function CustomLineChart({ data, config}) {
    return (
        <LineChart data={data}>
            <CartesianGrid stroke='var(--template-palette-outlineVariant)' strokeDasharray='3 3' />

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
                    color: 'var(--template-palette-onSurface)',
                }}
            />

            <Line
                type='monotone'
                dataKey={config.yAxisKey || 'y'}
                stroke={config.strokeColor || 'var(--template-palette-primary-main)'}
                strokeWidth={2}
            />
        </LineChart>
    );
}
