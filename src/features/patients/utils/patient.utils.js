export function calculateAge(dob) {
    if (!dob) return '';
    const diffMs = Date.now() - new Date(dob).getTime();
    const ageDt = new Date(diffMs);
    return Math.abs(ageDt.getUTCFullYear() - 1970);
}
export function translateSex(sex) {
    const map = { MALE: 'Hombre', FEMALE: 'Mujer', OTHER: 'Otro' };
    return map[sex] || sex;
}

