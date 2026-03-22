import { Controller } from "react-hook-form";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { FormHelperText } from "@mui/material";

export default function RHFRadioInput({
  name,
  control,
  label,
  options = [],
  errors,
  rules,
  row = false,
}) {
  return (
    <FormControl error={!!errors[name]}>
      {label && <FormLabel>{label}</FormLabel>}
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => (
          <RadioGroup row={row} {...field}>
            {options.map((opt) => (
              <FormControlLabel
                key={opt.value}
                value={opt.value}
                control={<Radio />}
                label={opt.label}
                disabled={opt.disabled}
              />
            ))}
          </RadioGroup>

        )}
      />
      <FormHelperText>{errors[name]?.message || ' '}</FormHelperText>
    </FormControl>
  );
}