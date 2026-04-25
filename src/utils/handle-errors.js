export function handleApiError(err, setError, setFormError = null) {
    const message = err?.response?.data?.message || 'Error inesperado';
    const fields = err?.response?.data?.fields || err?.response?.data?.details?.fields;

    if (fields && setFormError) {
        fields.forEach((f) => {
            setFormError(f.field || f.path, {
                type: 'server',
                message: f.message || f.msg,
            });
        });
    } else {
        setError(message);
    }
}