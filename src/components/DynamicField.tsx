import React from 'react';
import { useWatch, type Control, type FieldErrors, type UseFormRegister } from "react-hook-form";
import { 
  TextField, 
  MenuItem, 
  FormControlLabel, 
  Checkbox, 
  Radio, 
  RadioGroup, 
  FormControl, 
  FormLabel, 
  Box,
  Typography,
  Paper,
  FormHelperText
} from '@mui/material';
import type { FormField, FormGroup, ValidationRule } from '../types/schema';

interface DynamicFieldProps {
  field: FormField | FormGroup;
  register: UseFormRegister<any>;
  control: Control<any>;
  errors: FieldErrors<any>;
}

export const DynamicField: React.FC<DynamicFieldProps> = ({ field, register, control, errors }) => {
  
  const shouldShow = () => {
    if (!field.visibleWhen || field.visibleWhen.length === 0) return true;

    return field.visibleWhen.every((dep) => {

      const watchedValue = useWatch({
        control,
        name: dep.fieldId,
      });
      return watchedValue === dep.equals;
    });
  };

  if (!shouldShow()) return null;

  if (field.type === 'group') {
    const group = field as FormGroup;
    return (
      <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: '#fafafa' }}>
        <Typography variant="h6" gutterBottom>{group.title}</Typography>
        <Box display="flex" flexDirection="column" gap={2}>
          {group.children.map((child) => (
            <DynamicField 
              key={child.id} 
              field={child} 
              register={register} 
              control={control}
              errors={errors}
            />
          ))}
        </Box>
      </Paper>
    );
  }

  const input = field as FormField;
  const fieldError = errors[input.id]?.message as string | undefined;

  const getValidationRules = (rules?: ValidationRule[]) => {
    if (!rules) return {};
    
    const rhfRules: any = {};
    
    rules.forEach(rule => {
      switch (rule.type) {
        case 'required':
          rhfRules.required = rule.message;
          break;
        case 'minLength':
          rhfRules.minLength = { value: rule.value as number, message: rule.message };
          break;
        case 'maxLength':
          rhfRules.maxLength = { value: rule.value as number, message: rule.message };
          break;
        case 'pattern':
          rhfRules.pattern = { 
            value: new RegExp(rule.value as string), 
            message: rule.message 
          };
          break;
      }
    });
    return rhfRules;
  };

  const validationProps = getValidationRules(input.validation);

  switch (input.type) {
    case 'text':
    case 'textarea':
      return (
        <TextField
          {...register(input.id, validationProps)}
          label={input.label}
          placeholder={input.placeholder}
          multiline={input.type === 'textarea'}
          rows={input.type === 'textarea' ? 4 : 1}
          fullWidth
          error={!!fieldError}
          helperText={fieldError}
        />
      );

    case 'dropdown':
      return (
        <TextField
          select
          {...register(input.id, validationProps)}
          label={input.label}
          fullWidth
          defaultValue=""
          error={!!fieldError}
          helperText={fieldError}
        >
          {input.options?.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </TextField>
      );

    case 'checkbox':
      return (
        <FormControlLabel
          control={<Checkbox {...register(input.id, validationProps)} />}
          label={input.label}
        />
      );

    case 'radio':
      return (
        <FormControl>
          <FormLabel>{input.label}</FormLabel>
          <RadioGroup row>
            {input.options?.map((opt) => (
              <FormControlLabel
                key={opt.value}
                value={opt.value}
                control={<Radio {...register(input.id, validationProps)} />}
                label={opt.label}
              />
            ))}
          </RadioGroup>
          {fieldError && <FormHelperText>{fieldError}</FormHelperText>}
        </FormControl>
      );

    default:
      return null;
  }
};