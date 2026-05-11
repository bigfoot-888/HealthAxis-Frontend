export function handleApiError(err, setError, setFormError = null) {
    const message = err?.response?.data?.message || 'Error inesperado';
    const fields = err?.response?.data?.fields || err?.response?.data?.details?.fields;
    if (fields && setFormError) {
        if (Array.isArray(fields)) {
            fields.forEach((f) => {
                setFormError(f.field || f.path, {
                    type: 'server',
                    message: message,
                });
            });
        } else {
            Object.entries(fields).forEach(([field]) => {
                setFormError(field, {
                    type: 'server',
                    message: message,
                });
            });
        }
    } else {
        setError(message);
    }
}
