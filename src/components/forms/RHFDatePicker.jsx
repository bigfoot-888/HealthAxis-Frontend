import * as React from 'react';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// https://stackoverflow.com/questions/79729538/how-to-properly-handle-onblur-with-mui-datepicker

export default function RHFDatePicker({
  value,
  onChange,
  onBlur,
  error,
  helperText,
  label,
  isTouched,
  name,
}) {
  const handleChange = (newValue) => {
    const nextValue = newValue ? dayjs(newValue) : null;
    onChange(nextValue);

    // If user already blurred once, re-validate immediately
    if (isTouched) {
      onBlur?.();
    }
  };

  const handleBlur = React.useCallback(
    (event) => {
      const currentTarget = event.currentTarget;

      requestAnimationFrame(() => {
        if (!currentTarget.contains(document.activeElement)) {
          onBlur?.();
        }
      });
    },
    [onBlur]
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        name={name}
        label={label}
        value={value ? dayjs(value) : null}
        onChange={handleChange}
        onClose={() => onBlur?.()}
        slotProps={{
          field: { onBlur: handleBlur },
          textField: {
            fullWidth: true,
            error,
            helperText: helperText || " ",
          },
        }}
      />
    </LocalizationProvider>
  );
}
