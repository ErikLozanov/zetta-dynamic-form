import { Container, CssBaseline, AppBar, Toolbar, Typography, Box, Paper } from '@mui/material';

function App() {
  return (
    <>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            Zetta Dynamic Form Builder
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={4}>
          
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>
              Form Configuration (JSON)
            </Typography>
            <Box sx={{ height: '500px', bgcolor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              JSON Editor Placeholder
            </Box>
          </Paper>

          <Paper elevation={3} sx={{ p: 2 }}>
             <Typography variant="h5" gutterBottom>
              Live Form
            </Typography>
            <Box sx={{ p: 2, border: '1px dashed grey', minHeight: '500px' }}>
              Form Output Placeholder
            </Box>
          </Paper>

        </Box>
      </Container>
    </>
  );
}

export default App;