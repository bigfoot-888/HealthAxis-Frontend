import { useState, useEffect } from 'react';
import { Box, List, ListItemButton, ListItemText, Typography } from '@mui/material';
import { getClinicalAttachment } from '@clinical-documents/api/clinical-document-api';

import { pdfjs } from 'react-pdf';

// Use UNPKG CDN matching the installed pdfjs-dist version
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

import PdfViewer from '@/components/ui/PdfViewer';
import ContentLayout from '@/components/layout/ContentLayout';
export default function ClinicalAttachmentViewPage({ clinicalDocument }) {
    // attachments = [{ id, fileName, storageKey }, ...]
    const [selectedAttachmentId, setSelectedAttachmentId] = useState(
        clinicalDocument.clinicalAttachments?.[0]?.id || null,
    );
    const [pdfUrl, setPdfUrl] = useState(null);

    useEffect(() => {
        if (!selectedAttachmentId) return;

        getClinicalAttachment(selectedAttachmentId)
            .then((url) => setPdfUrl(url))
            .catch(console.error);
    }, [selectedAttachmentId]);

    return (
            <Box display='flex' height='100vh'>
                {/* Sidebar */}
                <Box width='250px' borderRight='1px solid #ddd' overflow='auto' bgcolor='#f7f7f7'>
                    <Typography variant='h6' p={2}>
                        Archivos
                    </Typography>
                    <List>
                        {clinicalDocument.clinicalAttachments.map((att) => (
                            <ListItemButton
                                key={att.id}
                                selected={att.id === selectedAttachmentId}
                                onClick={() => setSelectedAttachmentId(att.id)}
                            >
                                <ListItemText primary={att.fileName} />
                            </ListItemButton>
                        ))}
                    </List>
                </Box>

                {/* Main Content */}
                <Box flex={1} display='flex' justifyContent='center' alignItems='center'>
                    {pdfUrl ? <PdfViewer pdfUrl={pdfUrl} /> : <Typography>Loading attachment...</Typography>}
                </Box>
            </Box>
    );
}
