import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

export default function BasicHorizontalStepper({ steps, onComplete }) {
    const [activeStep, setActiveStep] = React.useState(0);
    const [skipped, setSkipped] = React.useState(new Set());

    const isStepOptional = (stepIndex) => steps[stepIndex]?.isOptional;
    const isStepSkipped = (stepIndex) => skipped.has(stepIndex);

    const handleNext = async () => {
        const step = steps[activeStep];

        // Run validation if exists
        if (step?.isValid) {
            const valid = await step.isValid();
            if (!valid) return;
        }

        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }

        if (activeStep === steps.length - 1) {
            onComplete();
        } else {
            setActiveStep((prev) => prev + 1);
            setSkipped(newSkipped);
        }
    };

    const handleBack = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);

    const handleSkip = () => {
        if (!isStepOptional(activeStep)) {
            throw new Error("You can't skip a step that isn't optional.");
        }
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped((prevSkipped) => {
            const newSkipped = new Set(prevSkipped.values());
            newSkipped.add(activeStep);
            return newSkipped;
        });
    };

    const handleReset = () => setActiveStep(0);

    return (
        <Paper
            elevation={0}
            sx={{
                width: '100%',
                // Force the container to have a max height so it can scroll internally.
                // You can adjust '80vh' (80% of screen height) to whatever fits your layout.
                height: '80vh',
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                overflow: 'hidden', // Keeps the inner scrolling contained within the rounded borders
                backgroundColor: 'background.paper',
            }}
        >
            {/* 1. STICKY HEADER (Dots/Labels) */}
            <Box
                sx={{
                    p: { xs: 2, md: 3 },
                    borderBottom: 1,
                    borderColor: 'divider',
                    flexShrink: 0, // Prevents this section from shrinking
                    zIndex: 1,
                }}
            >
                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((step, index) => {
                        const stepProps = {};
                        const labelProps = {};
                        if (step.isOptional) {
                            labelProps.optional = (
                                <Typography variant='caption' align='center' display='block'>
                                    Optional
                                </Typography>
                            );
                        }
                        if (isStepSkipped(index)) {
                            stepProps.completed = false;
                        }
                        return (
                            <Step key={step.label} {...stepProps}>
                                <StepLabel {...labelProps}>{step.label}</StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>
            </Box>

            {/* 2. SCROLLABLE CONTENT AREA */}
            <Box
                sx={{
                    flexGrow: 1,
                    overflowY: 'auto', // This tells the middle section to scroll if content is too long
                    p: { xs: 3, md: 4 },
                    minHeight: '300px',
                }}
            >
                {activeStep === steps.length ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant='h6' gutterBottom>
                            All steps completed!
                        </Typography>
                        <Typography variant='body2' color='text.secondary' sx={{ mb: 4 }}>
                            Your information has been successfully submitted.
                        </Typography>
                    </Box>
                ) : (
                    steps[activeStep].content
                )}
            </Box>

            {/* 3. STICKY FOOTER (Navigation Buttons) */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    p: { xs: 2, md: 3 },
                    borderTop: 1,
                    borderColor: 'divider',
                    flexShrink: 0, // Prevents buttons from getting squished
                    zIndex: 1,
                }}
            >
                {activeStep === steps.length ? (
                    // Render just the reset button if completed
                    <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
                        <Button variant='outlined' onClick={handleReset}>
                            Start Over
                        </Button>
                    </Box>
                ) : (
                    <React.Fragment>
                        <Button color='inherit' disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
                            Atrás
                        </Button>

                        <Box sx={{ flex: '1 1 auto' }} />

                        {isStepOptional(activeStep) && (
                            <Button color='inherit' onClick={handleSkip} sx={{ mr: 1 }}>
                                Skip
                            </Button>
                        )}

                        <Button
                            onClick={handleNext}
                            variant='contained'
                            disableElevation
                        >
                            {activeStep === steps.length - 1 ? 'Completar cita' : 'Siguiente'}
                        </Button>
                    </React.Fragment>
                )}
            </Box>
        </Paper>
    );
}
