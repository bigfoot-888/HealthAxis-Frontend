import React from 'react';
import { Tooltip, PieChart, Pie } from 'recharts';

export default function CustomPieChart({ data, config }) {
    return (
        <PieChart>
            <Pie
                data={data}
                dataKey={config.valueKey || 'y'}
                nameKey={config.nameKey || 'x'}
                outerRadius={80}
                fill={config.fillColor || 'var(--template-palette-primary-main)'}
                label
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
        </PieChart>
    );
}
