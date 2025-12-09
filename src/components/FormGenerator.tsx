import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import type { FormField, FormGroup, FormSchema } from "../types/schema";
import { DynamicField } from "./DynamicField";
import { fetchLocationByZip } from "../services/api";

interface FormGeneratorProps {
    schema: FormSchema;
}

export const FormGenerator: React.FC<FormGeneratorProps> = ({ schema }) => {
    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        formState: { errors },
    } = useForm();
    const [loading, setLoading] = React.useState(false);

    useEffect(() => {
        if (!schema.autoFill) return;

        const subscription = watch((formValues, { name, type }) => {
            const rule = schema.autoFill?.find(
                (r) => r.triggerFieldId === name
            );

            if (rule && rule.method === "getByZip") {
                const value = formValues[name as string];

                if (value && value.length === 5) {
                    setLoading(true);

                    fetchLocationByZip(value)
                        .then((res) => {
                            if (res.success && res.data) {
                                Object.entries(rule.mapping).forEach(
                                    ([apiKey, formFieldId]) => {
                                        // @ts-ignore
                                        const dataToFill = res.data[apiKey];
                                        setValue(formFieldId, dataToFill, {
                                            shouldValidate: true,
                                            shouldDirty: true,
                                        });
                                    }
                                );
                            }
                        })
                        .catch(console.error)
                        .finally(() => setLoading(false));
                }
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, schema.autoFill, setValue]);

    const buildStructuredData = (
        fields: (FormField | FormGroup)[],
        flatData: Record<string, any>
    ) => {
        const result: Record<string, any> = {};

        fields.forEach((field) => {
            if (field.type === "group") {
                const group = field as FormGroup;
                result[group.id] = buildStructuredData(group.children, flatData);
            } else {
                if (flatData[field.id] !== undefined) {
                    result[field.id] = flatData[field.id];
                }
            }
        });

        return result;
    };

    const onSubmit = (data: any) => {
        const structuredPayload = buildStructuredData(schema.fields, data);

        console.log("Form Submitted (Raw) - ", data);
        console.log("Form Submitted (Structured) - ", structuredPayload);

        alert(`Form Submitted! Check console for sctructured JSON output.`);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Box display="flex" flexDirection="column" gap={3}>
                {schema.fields.map((field) => (
                    <DynamicField
                        key={field.id}
                        field={field}
                        register={register}
                        control={control}
                        errors={errors}
                    />
                ))}

                <Box display="flex" alignItems="center" gap={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={loading}
                    >
                        Submit
                    </Button>
                    {loading && <CircularProgress size={24} />}
                    {loading && (
                        <Typography variant="caption">
                            Fetching data...
                        </Typography>
                    )}
                </Box>
            </Box>
        </form>
    );
};
