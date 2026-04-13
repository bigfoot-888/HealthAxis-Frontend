import * as React from 'react';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Controller } from 'react-hook-form';

export default function RHFDatePicker({ name, control, rules, label }) {
    return (
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field, fieldState }) => {
                const { onChange, onBlur, value } = field;
                const { error, isTouched } = fieldState;

                const handleChange = (newValue) => {
                    const nextValue = newValue ? dayjs(newValue) : null;
                    onChange(nextValue);
                    // revalidate if already touched
                    if (isTouched) {
                        onBlur();
                    }
                };

                const handleBlur = React.useCallback(
                    (event) => {
                        const currentTarget = event.currentTarget;
                        requestAnimationFrame(() => {
                            if (!currentTarget.contains(document.activeElement)) {
                                onBlur();
                            }
                        });
                    },
                    [onBlur],
                );

                return (
                    <DatePicker
                        label={label}
                        value={value ? dayjs(value) : null}
                        onChange={handleChange}
                        onClose={onBlur}
                        slotProps={{
                            field: {
                                onBlur: handleBlur,
                            },
                            textField: {
                                name: name,
                                fullWidth: true,
                                error: !!error,
                                helperText: error?.message || ' ',
                            },
                        }}
                    />
                );
            }}
        />
    );
}
