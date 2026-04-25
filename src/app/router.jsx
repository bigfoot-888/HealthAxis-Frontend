import { createBrowserRouter } from 'react-router';
import Layout from '../components/layout/Layout';

import UsersPage from './pages/user-pages/UsersPage';
import UserDetailPage from '@/app/pages/user-pages/UserDetailPage';

import LoginPage from './pages/auth-pages/LoginPage';
import NotFoundPage from './pages/error-pages/NotFoundPage';
import ProfilePage from './pages/user-pages/ProfilePage';
import CreateUserPage from './pages/user-pages/CreateUserPage';
import EditUserPage from './pages/user-pages/EditUserPage';
import PatientsPage from './pages/patient-pages/PatientsPage';
import CreatePatientPage from './pages/patient-pages/CreatePatientPage';
import EditPatientPage from './pages/patient-pages/EditPatientPage';
import AppointmentsPage from './pages/appointment-pages/AppointmentsPage';
import AgendasPage from './pages/agenda-pages/AgendasPage';
import CreateAppointmentPage from './pages/appointment-pages/CreateAppointmentPage';
import EditAppointmentPage from './pages/appointment-pages/EditAppointmentPage';
import ClinicalRecordsPage from './pages/clinical-record-pages/ClinicalRecordsPage';

import DiagnosesPage from './pages/diagnosis-pages/DiagnosesPage';
import CreateDiagnosisPage from './pages/diagnosis-pages/CreateDiagnosisPage';
import DiagnosisDetailPage from '@/app/pages/diagnosis-pages/DiagnosisDetailPage';

import CreateTreatmentPage from './pages/treatment-pages/CreateTreatmentPage';
import TreatmentsPage from './pages/treatment-pages/TreatmentsPage';
import TreatmentDetailPage from '@/app/pages/treatment-pages/TreatmentDetailPage';

import ClinicalDocumentsPage from './pages/clinical-document-pages/ClinicalDocumentsPage';
import CreateExternalClinicalDocumentForm from '@/app/pages/clinical-document-pages/CreateExternalClinicalDocumentPage';
import ClinicalDocumentViewPage from '@/app/pages/clinical-document-pages/ClinicalDocumentViewPage';
import PatientDetailPage from '@/app/pages/patient-pages/PatientDetailPage';
import PatientDetailProfilePage from '@/app/pages/patient-pages/PatientDetailProfilePage';
import PatientDetailAppointmentsPage from '@/app/pages/patient-pages/PatientDetailAppointmentsPage';
import PatientDetailDiagnosesPage from '@/app/pages/patient-pages/PatientDetailDiagnosesPage';
import PatientDetailTreatmentsPage from '@/app/pages/patient-pages/PatientDetailTreatmentsPage';
import PatientHistoryPage from '@/app/pages/patient-pages/PatientHistoryPage';

import AppointmentDetailPage from '@/app/pages/appointment-pages/AppointmentDetailPage';

import AgendaDetailWrapper from '@/app/pages/agenda-pages/AgendaDetailWrapper';
import AgendaDetailPage from '@/app/pages/agenda-pages/AgendaDetailPage';
import AgendaUsersPage from '@/app/pages/agenda-pages/AgendaUsersPage';

import PatientFlowPage from '@/app/pages/patient-pages/PatientFlowPage';

import DashboardPage from '@/app/pages/dashboard-pages/DashboardPage';

import { redirect } from 'react-router';

async function requireAuth() {
    const res = await fetch('/api/auth/me', { credentials: 'include' }); // backend checks session
    if (res.status === 401) {
        throw redirect('/login');
    }
    return res.json();
}

async function redirectIfAuthenticated() {
    const res = await fetch('/api/auth/me', {
        credentials: 'include',
    });

    if (res.ok) {
        throw redirect('/');
    }

    return null;
}

export const router = createBrowserRouter([
    {
        Component: Layout,
        // loader: requireAuth, // <- protect all child routes
        errorElement: <NotFoundPage />,
        // add error boundary as well?
        children: [
            {
                path: '/',
                Component: DashboardPage,
                handle: { title: 'Panel de Control' },
            },
            {
                path: '/users',
                Component: UsersPage,
                handle: { title: 'Usuarios' },
            },
            {
                path: '/users/:uuid',
                Component: UserDetailPage,
                handle: { title: 'Vista detallada de usuario' },
            },
            {
                path: '/users/new',
                Component: CreateUserPage,
                handle: { title: 'Añadir Usuario' },
            },
            {
                path: '/users/edit/:uuid',
                Component: EditUserPage,
                handle: { title: 'Editar Usuario' },
            },
            {
                path: '/profile',
                Component: ProfilePage,
                handle: { title: 'Perfil' },
            },
            {
                path: '/patients',
                Component: PatientsPage,
                handle: { title: 'Pacientes' },
            },
            {
                path: '/patients/:uuid',
                Component: PatientDetailPage,
                handle: { title: 'Vista detallada de paciente' },
                children: [
                    {
                        path: '',
                        Component: PatientDetailProfilePage,
                        handle: { title: 'Perfil del paciente' },
                    },
                    {
                        path: 'appointments',
                        Component: PatientDetailAppointmentsPage,
                        handle: { title: 'Citas del paciente' },
                    },
                    {
                        path: 'appointments/new',
                        Component: CreateAppointmentPage,
                        handle: { title: 'Crear cita' },
                    },
                    {
                        path: 'treatments',
                        Component: PatientDetailTreatmentsPage,
                        handle: { title: 'Tratamientos del paciente' },
                    },
                    {
                        path: 'treatments/new',
                        Component: CreateTreatmentPage,
                        handle: { title: 'Crear tratamiento' },
                    },
                    {
                        path: 'diagnoses',
                        Component: PatientDetailDiagnosesPage,
                        handle: { title: 'Diagnósticos del paciente' },
                    },
                    {
                        path: 'diagnoses/new',
                        Component: CreateDiagnosisPage,
                        handle: { title: 'Crear diagnóstico' },
                    },
                    {
                        path: 'flow',
                        Component: PatientFlowPage,
                        handle: { title: 'Flujo del paciente' },
                    },
                    {
                        path: 'history',
                        Component: PatientHistoryPage,
                        handle: { title: 'Historial del paciente' },
                    },
                ],
            },
            {
                path: '/patients/new',
                Component: CreatePatientPage,
                handle: { title: 'Añadir Paciente' },
            },
            {
                path: '/patients/edit/:uuid',
                Component: EditPatientPage,
                handle: { title: 'Editar Paciente' },
            },
            {
                path: '/agendas',
                Component: AgendasPage,
                handle: { title: 'Agendas' },
            },
            {
                path: '/agendas/:uuid',
                Component: AgendaDetailWrapper,
                handle: { title: 'Vista detallada de la agenda' },
                children: [
                    {
                        path: '',
                        Component: AgendaDetailPage,
                        handle: { title: 'Información de la agenda' },
                    },
                    {
                        path: 'users',
                        Component: AgendaUsersPage,
                        handle: { title: 'Usuarios de la agenda' },
                    },
                ],
            },
            {
                path: '/appointments',
                Component: AppointmentsPage,
                handle: { title: 'Citas' },
            },
            {
                path: '/appointments/:uuid',
                Component: AppointmentDetailPage,
                handle: { title: 'Vista detallada de la cita' },
            },
            {
                path: '/appointments/new',
                Component: CreateAppointmentPage,
                handle: { title: 'Crear Cita' },
            },
            {
                path: '/appointments/edit/:uuid',
                Component: EditAppointmentPage,
                handle: { title: 'Editar Cita' },
            },
            {
                path: '/clinical-records',
                Component: ClinicalRecordsPage,
                handle: { title: 'Registros clínicos' },
                children: [
                    {
                        path: 'clinical-documents',
                        Component: ClinicalDocumentsPage,
                        handle: { title: 'Documentos clínicos' },
                    },
                    {
                        path: 'clinical-documents/:uuid',
                        Component: ClinicalDocumentViewPage,
                        handle: { title: 'Ver documento clínico' },
                    },
                    {
                        path: 'clinical-documents/new-external',
                        Component: CreateExternalClinicalDocumentForm,
                        handle: { title: 'Crear documento clínico externo' },
                    },
                    {
                        path: 'treatments',
                        Component: TreatmentsPage,
                        handle: { title: 'Tratamientos' },
                    },
                    {
                        path: 'treatments/new',
                        Component: CreateTreatmentPage,
                        handle: { title: 'Crear tratamiento' },
                    },
                    {
                        path: 'treatments/:uuid',
                        Component: TreatmentDetailPage,
                        handle: { title: 'Vista detallada de tratamiento' },
                    },
                    {
                        path: 'diagnoses',
                        Component: DiagnosesPage,
                        handle: { title: 'Diagnósticos' },
                    },
                    {
                        path: 'diagnoses/new',
                        Component: CreateDiagnosisPage,
                        handle: { title: 'Crear diagnóstico' },
                    },
                    {
                        path: 'diagnoses/:uuid',
                        Component: DiagnosisDetailPage,
                        handle: { title: 'Vista detallada de diagnóstico' },
                    },
                ],
            },
        ],
    },
    {
        path: '/login',
        Component: LoginPage,
        loader: redirectIfAuthenticated,
    },
]);
