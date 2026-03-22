export function handleApiError(err, setError, setFormError = null) {
    const message = err?.response?.data?.message || 'Error inesperado';
    const details = err?.response?.data?.details;
    
    if (details?.fields && setFormError) {
        details.fields.forEach((f) => {
            setFormError(f.path, { type: 'server', message: f.msg });
        });
    } else {
        setError(message); 
    }
}
