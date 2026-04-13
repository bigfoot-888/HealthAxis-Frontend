export function translateEntityState(state) {
    switch (state) {
        case 'ACTIVE':
            return 'Activo';
        case 'INACTIVE':
            return 'Inactivo';
        default:
            return 'N.A.';
    }
}

export function translateDiagnosisState(state) {
    switch (state) {
        case 'ACTIVE':
            return 'Activo';
        case 'RESOLVED':
            return 'Resuelto';
        case 'CHRONIC':
            return 'Crónico';
        case 'RULED_OUT':
            return 'Descartado';
        default:
            return 'N.A.';
    }
}

export function translateTreatmentState(state) {
    switch (state) {
        case 'PLANNED':
            return 'Planificado';
        case 'ONGOING':
            return 'En curso';
        case 'GIVEN':
            return 'Dado';
        case 'COMPLETED':
            return 'Completado';
        case 'DISCONTINUED':
            return 'Descartado';
        default:
            return 'N.A.';
    }
}

export function translateDashboardComponentTitle(title) {
    switch (title) {
        case 'TOTAL_PATIENTS':
            return 'Pacientes totales';
        case 'ACTIVE_PATIENTS':
            return 'Pacientes activos';
        case 'PATIENTS_OVER_TIME':
            return 'Pacientes ingresados con el tiempo';
        case 'APPOINTMENTS_OVER_TIME':
            return 'Citas creadas con el tiempo';
        case 'DIAGNOSIS_SEVERITY_DISTRIBUTION':
            return 'Distribución de la severidad de los diagnósticos';
        case 'TREATMENT_STATE_DISTRIBUTION':
            return 'Distribución del estado de los tratamientos';
        default:
            return 'N.A.';
    }
}
