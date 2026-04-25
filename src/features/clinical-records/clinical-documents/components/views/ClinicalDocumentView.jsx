import { useState, useEffect } from 'react';
import { Box, List, ListItemButton, ListItemText, Typography, CircularProgress, Divider } from '@mui/material';
import { getClinicalAttachment } from '@clinical-documents/api/clinical-document.api';

import { pdfjs } from 'react-pdf';

// Use UNPKG CDN matching the installed pdfjs-dist version
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

import PdfViewer from '@/components/ui/PdfViewer';

export default function ClinicalAttachmentViewPage({ clinicalDocument }) {
    const attachments = clinicalDocument?.clinicalAttachments || [];

    const [selectedAttachmentId, setSelectedAttachmentId] = useState(attachments[0]?.id || null);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!selectedAttachmentId) return;

        let isMounted = true;
        setIsLoading(true);

        getClinicalAttachment(selectedAttachmentId)
            .then((url) => {
                if (isMounted) {
                    setPdfUrl(url);
                    setIsLoading(false);
                }
            })
            .catch((error) => {
                console.error('Error fetching clinical attachment:', error);
                if (isMounted) setIsLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, [selectedAttachmentId]);

    if (attachments.length === 0) {
        return <Typography sx={{ p: 3, color: 'onSurfaceVariant' }}>No hay archivos adjuntos disponibles.</Typography>;
    }

    return (
        <Box
            sx={{
                display: 'flex',
                height: '600px',
                border: 1,
                borderColor: 'outlineVariant',
                borderRadius: 1,
                overflow: 'hidden',
            }}
        >
            {/* Document content navigator */}
            <Box
                sx={{
                    width: '250px',
                    borderRight: 1,
                    borderColor: 'outlineVariant',
                    overflowY: 'auto',
                    bgcolor: 'surfaceContainerLow',
                }}
            >
                <Typography variant='h6' sx={{ p: 2, color: 'onSurface' }}>
                    Archivos
                </Typography>
                <Divider sx={{ borderColor: 'outlineVariant' }} />
                <List disablePadding>
                    {attachments.map((att) => (
                        <ListItemButton
                            key={att.id}
                            selected={att.id === selectedAttachmentId}
                            onClick={() => setSelectedAttachmentId(att.id)}
                            sx={{
                                '&.Mui-selected': {
                                    bgcolor: 'primary.container',
                                    color: 'primary.onContainer',
                                    '&:hover': {
                                        bgcolor: 'primary.container',
                                        opacity: 0.9,
                                    },
                                },
                            }}
                        >
                            <ListItemText
                                primary={att.fileName}
                                primaryTypographyProps={{
                                    variant: 'body2',
                                    noWrap: true,
                                    color: att.id === selectedAttachmentId ? 'primary.onContainer' : 'onSurface',
                                }}
                            />
                        </ListItemButton>
                    ))}
                </List>
            </Box>

            {/* PDF Viewer */}
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    bgcolor: 'surfaceContainerLowest',
                }}
            >
                {isLoading ? (
                    <CircularProgress color='primary' />
                ) : pdfUrl ? (
                    <PdfViewer pdfUrl={pdfUrl} />
                ) : (
                    <Typography sx={{ color: 'onSurfaceVariant' }}>
                        Selecciona un archivo para previsualizarlo
                    </Typography>
                )}
            </Box>
        </Box>
    );
}
