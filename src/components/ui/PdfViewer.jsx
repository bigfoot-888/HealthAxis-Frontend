import { useState } from 'react';
import { Document, Page } from 'react-pdf';
import { Box } from '@mui/material';

export default function PdfViewer({ pdfUrl }) {
    const [numPages, setNumPages] = useState(null);

    const onLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    return (
        <Box
            flex={1}
            height='100%'
            width='100%'
            overflow='auto'
            display='flex'
            justifyContent='center'
            alignItems='flex-start'
            p={2}
        >
            <Document file={pdfUrl} onLoadSuccess={onLoadSuccess}>
                {Array.from(new Array(numPages), (el, index) => (
                    <Page
                        key={`page_${index + 1}`}
                        pageNumber={index + 1}
                        width={800}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                    />
                ))}
            </Document>
        </Box>
    );
}
