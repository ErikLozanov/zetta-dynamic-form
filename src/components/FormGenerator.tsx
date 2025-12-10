import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, Box, Button, CircularProgress, Snackbar, Typography } from "@mui/material";
import type { FormField, FormGroup, FormSchema } from "../types/schema";
import { DynamicField } from "./DynamicField";
import { fetchLocationByZip } from "../services/api";

const AUTOSAVE_KEY = "zetta_form_progress"

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
        reset,
        formState: { errors },
    } = useForm();

    const [loading, setLoading] = useState(false);
    const [successOpen, setSuccessOpen] = useState(false);
    const [restoredFromSave, setRestoredFromSave] = useState(false);

    useEffect(() => {
        const subscription = watch((value) => {
            const handler = setTimeout(() => {
                localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(value));
            }, 500); 

            return () => clearTimeout(handler);
        });
        return () => subscription.unsubscribe();
    }, [watch]);

    useEffect(() => {
        const savedData = localStorage.getItem(AUTOSAVE_KEY);
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                if (Object.keys(parsed).length > 0) {
                    reset(parsed); 
                    setRestoredFromSave(true);
                }
            } catch (e) {
                console.error("Failed to parse auto-save data", e);
            }
        }
    }, [reset]);

    useEffect(() => {
        if (!schema.autoFill) return;

        const subscription = watch((formValues, { name }) => {
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

        setSuccessOpen(true);

        localStorage.removeItem(AUTOSAVE_KEY);
        reset({}); 
        setRestoredFromSave(false);

        alert(`Form Submitted! Check console for sctructured JSON output.`);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {restoredFromSave && (
                <Alert severity="info" sx={{ mb: 2 }} onClose={() => setRestoredFromSave(false)}>
                    We restored your progress from a previous session.
                </Alert>
            )}
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
