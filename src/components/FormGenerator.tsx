import React from 'react';
import { useForm } from 'react-hook-form';
import { Box, Button } from '@mui/material';
import type { FormSchema } from '../types/schema';
import { DynamicField } from './DynamicField';

interface FormGeneratorProps {
  schema: FormSchema;
}

export const FormGenerator: React.FC<FormGeneratorProps> = ({ schema }) => {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    console.log("Form Submitted - ", data);
    alert("Form Submitted! Check console for JSON output.");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box display="flex" flexDirection="column" gap={3}>
        {schema.fields.map((field) => (
          <DynamicField key={field.id} field={field} register={register} />
        ))}
        
        <Button variant="contained" color="primary" type="submit" size="large">
          Submit
        </Button>
      </Box>
    </form>
  );
};