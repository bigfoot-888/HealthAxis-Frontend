import { axios } from '../../../../lib/axios';

export async function createClinicalDocument(documentData) {
    try {
        const response = await axios.post('/clinical-documents/new', documentData);
        return response.data;
    } catch (err) {
        console.error('Error creating clinical document:', err);
        throw err;
    }
}

export async function createClinicalAttachment(file) {
    try {
        const response = await axios.post('/clinical-documents/attachments/new', file, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (err) {
        console.error('Error creating clinical attachment:', err);
        throw err;
    }
}

export async function updateClinicalDocumentState(uuid, state) {
    try {
        const response = await axios.patch(`/clinical-documents/${uuid}/update/state`, { state });
        return response.data;
    } catch (err) {
        console.error('Error updating clinical document state:', err);
        throw err;
    }
}

export async function updateClinicalAttachmentState(uuid, state) {
    try {
        const response = await axios.patch(`/clinical-documents/attachments/${uuid}/update/state`, { state });
        return response.data;
    } catch (err) {
        console.error('Error updating clinical attachment state:', err);
        throw err;
    }
}

export async function getClinicalDocuments() {
    try {
        const response = await axios.get('/clinical-documents');
        return response.data;
    } catch (err) {
        console.error('Error fetching clinical document data:', err);
        throw err;
    }
}

export async function getClinicalDocument(uuid) {
    try {
        const response = await axios.get(`/clinical-documents/${uuid}`);
        return response.data;
    } catch (err) {
        console.error('Error getting clinical document data:', err);
        throw err;
    }
}

export async function getClinicalAttachment(id) {
    try {
        const response = await axios.get(`/clinical-documents/attachments/${id}/download`, { responseType: 'blob' });
        return URL.createObjectURL(response.data);
    } catch (err) {
        console.error('Error getting clinical attachment data:', err);
        throw err;
    }
}
