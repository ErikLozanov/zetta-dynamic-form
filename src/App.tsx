import {
    Container,
    AppBar,
    Toolbar,
    Typography,
    Box,
    Paper,
    TextField,
} from "@mui/material";
import type { FormSchema } from "./types/schema";
import { useState } from "react";
import { FormGenerator } from "./components/FormGenerator";

const INITIAL_DATA: FormSchema = {
    formTitle: "Project Requirements",
    fields: [],
};

const SCHEMA_KEY = "zetta_schema_cache";

function App() {
    const [jsonInput, setJsonInput] = useState(() => {
        const saved = localStorage.getItem(SCHEMA_KEY);
        return saved || JSON.stringify(INITIAL_DATA, null, 2);
    });
    const [parsedSchema, setParsedSchema] = useState<FormSchema | null>(() => {
        const saved = localStorage.getItem(SCHEMA_KEY);
        try {
            return saved ? JSON.parse(saved) : INITIAL_DATA;
        } catch {
            return INITIAL_DATA;
        }
    });
    const [jsonError, setJsonError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setJsonInput(value);

        localStorage.setItem(SCHEMA_KEY, value);
        try {
            const parsed = JSON.parse(value);
            setParsedSchema(parsed);
            setJsonError(null);
            console.log("Schema updated - ", parsed);
        } catch (err) {
            setJsonError("Invalid JSON format");
        }
    };

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6">Zetta Form Builder</Typography>
                </Toolbar>
            </AppBar>

            <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
                <Box
                    display="grid"
                    gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
                    gap={4}
                >
                    {/* Left side*/}
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            JSON Configuration
                        </Typography>
                        <TextField
                            multiline
                            rows={20}
                            fullWidth
                            value={jsonInput}
                            onChange={handleInputChange}
                            error={!!jsonError}
                            helperText={jsonError}
                            sx={{ fontFamily: "monospace" }}
                        />
                    </Paper>

                    {/* Right side*/}
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Form Preview
                        </Typography>
                        <Box
                            sx={{
                                p: 3,
                                border: "1px dashed #ccc",
                                borderRadius: 1,
                            }}
                        >
                            {parsedSchema ? (
                                <FormGenerator schema={parsedSchema} />
                            ) : (
                                <Typography color="error">
                                    Fix JSON to see form
                                </Typography>
                            )}
                        </Box>
                    </Paper>
                </Box>
            </Container>
        </>
    );
}

export default App;
