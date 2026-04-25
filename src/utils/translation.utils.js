
export const TRANSLATE = {
    PATIENT: "Paciente",
    PATIENTS: "Pacientes",
    USER: 'Usuario',
    USERS: 'Usuarios',
    DIAGNOSIS: 'Diagnóstico',
    DIAGNOSES: 'Diagnósticos',
    TREATMENT: 'Tratamiento',
    TREATMENTS: 'Tratamientos',
    CLINICAL_DOCUMENT: 'Documento clínico',
    CLINICAL_DOCUMENTS: 'Documentos clínicos',
    ROLE: 'Rol',
    ROLES: 'Roles',
    APPOINTMENT: 'Cita',
    APPOINTMENTS: 'Citas',
    OTHER: 'Otros',
    OTHERS: 'Otros',
    CREATED: 'Creado',
    CLINICAL_STATUS_CHANGED: 'Estado clínico cambiado',
    STATUS_CHANGED: 'Estado cambiado',
    ADMINISTRATIVE: 'Administrativo',
    CARDIOLOGIST: 'Cardiólogo',
}

export function translate(value) {
    if (!value || typeof value !== 'string') return value;
    const normalized = value.toUpperCase().trim();
    return TRANSLATE[normalized] ?? value;
}