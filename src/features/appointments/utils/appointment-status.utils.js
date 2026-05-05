export function isCompleted(appointment) {
    return appointment.status === 'COMPLETED';
}

export function isCheckedIn(appointment) {
    return appointment.status === 'CHECKED_IN';
}

export function isScheduled(appointment) {
    return appointment.status === 'SCHEDULED';
}

export function isCancelled(appointment) {
    return appointment.status === 'NO_SHOW' || appointment.status === 'CANCELLED';
}

export function isAppointmentOver(appointment) {
    return appointment.status === 'COMPLETED' || appointment.status === 'NO_SHOW' || appointment.status === 'CANCELLED';
}
