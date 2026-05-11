import { axios } from '../../../../lib/axios';

// ===== CREATE =====

export async function createClinicalDocument(documentData) {
    const response = await axios.post('/clinical-documents', documentData);
    return response.data;
}

export async function createClinicalAttachment(file) {
    const response = await axios.post('/clinical-documents/attachments', file, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
}

// ===== UPDATE =====

export async function updateClinicalDocumentStatus(uuid, status) {
    const response = await axios.patch(`/clinical-documents/${uuid}/status`, { status });
    return response.data;
}

export async function updateClinicalAttachmentStatus(uuid, status) {
    const response = await axios.patch(`/clinical-documents/attachments/${uuid}/status`, { status });
    return response.data;
}

export async function updateClinicalDocument(uuid, documentData) {
    const response = await axios.put(`/clinical-documents/${uuid}`, documentData);
    return response.data;
}

// ===== READ =====

export async function getClinicalDocuments() {
    const response = await axios.get('/clinical-documents');
    return response.data;
}

export async function getClinicalDocument(uuid) {
    const response = await axios.get(`/clinical-documents/${uuid}`);
    return response.data;
}

export async function getFilteredClinicalDocuments(query, limit = 20) {
    console.log(query)
    const response = await axios.get('/clinical-documents/filtered', {
        params: { query, limit },
    });
    return response.data;
}

export async function getClinicalAttachment(uuid) {
    const response = await axios.get(`/clinical-documents/attachments/${uuid}/download`, { responseType: 'blob' });

    return URL.createObjectURL(response.data);
}
