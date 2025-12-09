import React from 'react';
import { useWatch, type Control, type UseFormRegister } from "react-hook-form";
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
  Paper
} from '@mui/material';
import type { FormField, FormGroup } from '../types/schema';

interface DynamicFieldProps {
  field: FormField | FormGroup;
  register: UseFormRegister<any>;
  control: Control<any>;
}

export const DynamicField: React.FC<DynamicFieldProps> = ({ field, register, control }) => {
  
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
            />
          ))}
        </Box>
      </Paper>
    );
  }

  const input = field as FormField;

  switch (input.type) {
    case 'text':
    case 'textarea':
      return (
        <TextField
          {...register(input.id)}
          label={input.label}
          placeholder={input.placeholder}
          multiline={input.type === 'textarea'}
          rows={input.type === 'textarea' ? 4 : 1}
          fullWidth
        />
      );

    case 'dropdown':
      return (
        <TextField
          select
          {...register(input.id)}
          label={input.label}
          fullWidth
          defaultValue=""
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
          control={<Checkbox {...register(input.id)} />}
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
                control={<Radio {...register(input.id)} />}
                label={opt.label}
              />
            ))}
          </RadioGroup>
        </FormControl>
      );

    default:
      return null;
  }
};