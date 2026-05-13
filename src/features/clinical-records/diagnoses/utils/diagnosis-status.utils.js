export function isDiagnosisOver(diagnosis) {
    return (
        diagnosis.clinicalStatus === 'RESOLVED' || diagnosis.clinicalStatus === 'RULED_OUT'
    );
}

export function isDiagnosisValid(diagnosis){
    return diagnosis.status === 'VALID';
}

export function mapDiagnosisConfigToItems(config) {
    return Object.fromEntries(
        Object.entries(config).map(([key, value]) => [key, value.label])
    );
}

