import { useState, useEffect } from 'react';
import { Box, List, ListItemButton, ListItemText, Typography, CircularProgress, Divider, Stack } from '@mui/material';
import { getClinicalAttachment } from '@clinical-documents/api/clinical-document.api';
import { Link } from 'react-router';
import { pdfjs } from 'react-pdf';
import { useSnackbar } from '@/app/SnackBarContext';
import {
    CLINICAL_DOCUMENT_TYPE_CONFIG,
    CLINICAL_DOCUMENT_STATUS_CONFIG,
} from '@/shared/constants/clinical-document.constants';

// Use UNPKG CDN matching the installed pdfjs-dist version
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

import PdfViewer from '@/components/ui/PdfViewer';
import { SubtleChip } from '@/components/ui';
import { translate } from '@/utils/translation.utils';

const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Intl.DateTimeFormat('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(dateString));
};

export default function ClinicalAttachmentViewPage({ clinicalDocument }) {
    const { showSnackbar } = useSnackbar();
    const attachments = clinicalDocument?.clinicalAttachments || [];
    const users = clinicalDocument?.users || [];

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
            .catch((err) => {
                showSnackbar({ message: 'Error al cargar archivos', severity: 'error' });
                if (isMounted) setIsLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, [selectedAttachmentId]);

    return (
        <Box
            sx={{
                display: 'flex',
                height: '700px',
                border: 1,
                borderColor: 'outlineVariant',
                borderRadius: 2,
                overflow: 'hidden',
                bgcolor: 'surfaceContainerLowest',
            }}
        >
            <Box
                sx={{
                    width: '300px',
                    borderColor: 'outlineVariant',
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: 'surfaceContainerLow',
                }}
            >
                <Box sx={{ overflowY: 'auto', flex: 1 }}>
                    <Box sx={{ p: 2 }}>
                        <Typography
                            variant='overline'
                            sx={{ color: 'onSurfaceVariant', fontWeight: 700, display: 'block', mb: 1 }}
                        >
                            Detalles del Documento
                        </Typography>
                        <Stack spacing={1.5}>
                            <Box>
                                <Typography variant='subtitle2' sx={{ color: 'onSurface', fontWeight: 600 }}>
                                    {clinicalDocument.title || 'Documento sin título'}
                                </Typography>
                                <Typography variant='caption' sx={{ color: 'onSurfaceVariant' }}>
                                    {CLINICAL_DOCUMENT_TYPE_CONFIG[clinicalDocument.documentType].label || '—'}
                                </Typography>
                            </Box>

                            <Box display='flex' alignItems='center' gap={1}>
                                <SubtleChip label={CLINICAL_DOCUMENT_STATUS_CONFIG[clinicalDocument.status].label} />
                            </Box>
                        </Stack>
                    </Box>

                    <Divider sx={{ borderColor: 'outlineVariant', borderStyle: 'dashed' }} />

                    <Box sx={{ p: 2 }}>
                        <Typography
                            variant='overline'
                            sx={{ color: 'onSurfaceVariant', fontWeight: 700, display: 'block', mb: 1 }}
                        >
                            Participantes
                        </Typography>
                        {users.length > 0 ? (
                            <Stack spacing={1.5}>
                                {users.map((user) => (
                                    <Box
                                        key={user.id}
                                        component={Link}
                                        to={`/users/${user.uuid}`}
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            textDecoration: 'none',
                                            p: 1,
                                            mx: -1,
                                            borderRadius: 1,
                                            transition: 'background-color 0.2s ease',
                                            '&:hover': {
                                                bgcolor: 'surfaceContainerHighest',
                                                '& .user-name': {
                                                    color: 'primary.main',
                                                },
                                            },
                                        }}
                                    >
                                        <Typography variant='body2' sx={{ color: 'onSurface', fontWeight: 500 }}>
                                            {user.name} {user.surname}
                                        </Typography>
                                        <Typography variant='caption' sx={{ color: 'primary.main', fontWeight: 600 }}>
                                            {translate(user.ClinicalDocumentUser.role) || 'USUARIO'}
                                        </Typography>
                                    </Box>
                                ))}
                            </Stack>
                        ) : (
                            <Typography variant='body2' sx={{ color: 'onSurfaceVariant', fontStyle: 'italic' }}>
                                Sin participantes asignados
                            </Typography>
                        )}
                    </Box>

                    <Divider sx={{ borderColor: 'outlineVariant' }} />

                    <Box sx={{ p: 0 }}>
                        <Typography
                            variant='overline'
                            sx={{ color: 'onSurfaceVariant', fontWeight: 700, display: 'block', p: 2, pb: 1 }}
                        >
                            Archivos Adjuntos
                        </Typography>

                        {attachments.length === 0 ? (
                            <Typography
                                variant='body2'
                                sx={{ p: 2, pt: 0, color: 'onSurfaceVariant', fontStyle: 'italic' }}
                            >
                                No hay archivos disponibles.
                            </Typography>
                        ) : (
                            <List disablePadding>
                                {attachments.map((att) => (
                                    <ListItemButton
                                        key={att.id}
                                        selected={att.id === selectedAttachmentId}
                                        onClick={() => setSelectedAttachmentId(att.id)}
                                        sx={{
                                            borderLeft: '3px solid transparent',
                                            '&.Mui-selected': {
                                                bgcolor: 'primary.containerLowest',
                                                borderLeftColor: 'primary.main',
                                                '&:hover': {
                                                    bgcolor: 'primary.containerLowest',
                                                },
                                            },
                                        }}
                                    >
                                        <ListItemText
                                            primary={att.fileName}
                                            slotProps={{
                                                primary: {
                                                    variant: 'body2',
                                                    noWrap: true,
                                                    fontWeight: att.id === selectedAttachmentId ? 600 : 400,
                                                    color:
                                                        att.id === selectedAttachmentId ? 'primary.main' : 'onSurface',
                                                },
                                            }}
                                        />
                                    </ListItemButton>
                                ))}
                            </List>
                        )}
                    </Box>
                </Box>
            </Box>

            {/* PDF Viewer */}
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    bgcolor: 'surfaceContainerLowest',
                    position: 'relative',
                }}
            >
                {isLoading ? (
                    <CircularProgress color='primary' />
                ) : pdfUrl ? (
                    <PdfViewer pdfUrl={pdfUrl} />
                ) : (
                    <Typography sx={{ color: 'onSurfaceVariant' }}>
                        {attachments.length > 0
                            ? 'Selecciona un archivo para previsualizarlo'
                            : 'Documento sin contenido adjunto'}
                    </Typography>
                )}
            </Box>
        </Box>
    );
}
