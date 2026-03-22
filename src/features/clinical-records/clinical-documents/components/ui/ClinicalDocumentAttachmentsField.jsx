import { useFieldArray, useWatch } from 'react-hook-form';
import { Button, Box, Grid, Typography } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';

export function ClinicalDocumentAttachmentsField({ control, setValue }) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'attachments',
    });

    // Watch the attachments array to get updated values
    const watchedAttachments = useWatch({
        control,
        name: 'attachments',
        defaultValue: []
    });

    const handleAddAttachment = () => {
        append({ file: null });
    };

    const handleFileSelect = (index, file) => {
        setValue(`attachments.${index}.file`, file);
    };

    return (
        <Box>
            {fields.map((field, index) => (
                <Grid container spacing={2} key={field.id} sx={{ mb: 2 }}>
                    <Grid size={10}>
                        <Button component="label" variant="outlined">
                            Seleccionar archivo
                            <input
                                type="file"
                                hidden
                                accept="application/pdf"
                                onChange={(e) =>
                                    handleFileSelect(index, e.target.files[0])
                                }
                            />
                        </Button>

                        {watchedAttachments[index]?.file?.name && (
                            <Typography variant="body2" sx={{ mt: 1 }}>
                                {watchedAttachments[index].file.name}
                            </Typography>
                        )}
                    </Grid>
                    <Grid
                        size={2}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            pb: 2
                        }}
                    >
                        <IconButton color='error' onClick={() => remove(index)} size='small'>
                            <DeleteIcon />
                        </IconButton>
                    </Grid>
                </Grid>
            ))}

            <Button startIcon={<AddIcon />} onClick={handleAddAttachment} variant='outlined' sx={{mb: 2}}>
                Añadir archivo
            </Button>
        </Box>
    );
}