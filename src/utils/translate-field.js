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
