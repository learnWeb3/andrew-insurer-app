import {
  FormControl,
  FormHelperText,
  InputAdornment,
  TextField as MUITextField,
} from "@mui/material";
import { ReactNode, useEffect } from "react";

export interface TextFieldProps {
  label?: string;
  textarea?: boolean;
  helpertext?: string;
  value?: string;
  handleInput?: (value: any) => void;
  setErrors?: (errors: string[]) => void;
  errors?: string[];
  validate?: (value: any, options: { label: string }) => string[];
  readOnly?: boolean;
  id?: string;
  startComponent?: ReactNode | null;
  endComponent?: ReactNode | null;
}
export function TextField({
  label = "",
  helpertext = "",
  value = "",
  readOnly = false,
  id = "",
  handleInput = (value: string) => {
    console.log(value);
  },
  setErrors = (errors: string[]) => {},
  errors = [],
  validate = (value: any, options: { label: string }): string[] => {
    // console.log(value);
    return [];
  },
  textarea = false,
  startComponent = null,
  endComponent = null,
}: TextFieldProps) {
  useEffect(() => {
    setErrors(validate(value, { label }));
  }, [value]);

  return (
    <FormControl fullWidth={true}>
      {!textarea ? (
        <MUITextField
          label={label}
          error={errors?.length > 0}
          onInput={(event: any) => handleInput(event?.target?.value)}
          value={value}
          helperText={errors?.length ? errors.join(", ") : ""}
          InputProps={{
            readOnly,
            startAdornment: (
              <InputAdornment position="start">{startComponent}</InputAdornment>
            ),
            endAdornment: endComponent ? (
              <InputAdornment position="end">{endComponent}</InputAdornment>
            ) : null,
          }}
        />
      ) : (
        <MUITextField
          multiline
          rows={5}
          label={label}
          error={errors?.length > 0}
          onInput={(event: any) => handleInput(event?.target?.value)}
          value={value}
          helperText={errors?.length ? errors.join(", ") : ""}
          inputProps={{ readOnly }}
        />
      )}
      {helpertext ? <FormHelperText>Required</FormHelperText> : false}
    </FormControl>
  );
}
