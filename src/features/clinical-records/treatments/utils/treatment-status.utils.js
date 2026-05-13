export function isTreatmentOver(treatment) {
    return (
        treatment.clinicalStatus === 'COMPLETED' ||
        treatment.clinicalStatus.clinicalStatus === 'GIVEN' ||
        treatment.status !== 'VALID' ||
        treatment.clinicalStatus === 'DISCONTINUED'
    );
}

export function isCancelled(treatment) {
    return treatment.status !== 'VALID';
}

export function isFinished(treatment) {
    return treatment.clinicalStatus === "COMPLETED" || treatment.clinicalStatus === "GIVEN" || treatment.clinicalStatus === 'DISCONTINUED'; 
}