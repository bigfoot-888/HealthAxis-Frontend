import { createBrowserRouter } from 'react-router';
import Layout from '../components/layout/Layout';
import UsersPage from './pages/user-pages/UsersPage';
import LoginPage from './pages/auth-pages/LoginPage';
import NotFoundPage from './pages/error-pages/NotFoundPage';
import ProfilePage from './pages/user-pages/ProfilePage';
import CreateUserPage from './pages/user-pages/CreateUserPage';
import UpdateUserPage from './pages/user-pages/UpdateUserPage';
import PatientsPage from './pages/patient-pages/PatientsPage';
import CreatePatientPage from './pages/patient-pages/CreatePatientPage';
import UpdatePatientPage from './pages/patient-pages/UpdatePatientPage';
import AppointmentsPage from './pages/appointment-pages/AppointmentsPage';
import AgendasPage from './pages/agenda-pages/AgendasPage';
import CreateAppointmentPage from './pages/appointment-pages/CreateAppointmentPage';
import EditAppointmentPage from './pages/appointment-pages/EditAppointmentPage'
import ClinicalRecordsPage from './pages/clinical-record-pages/ClinicalRecordsPage'
import DiagnosesPage from './pages/diagnosis-pages/DiagnosesPage'
import CreateDiagnosisPage from './pages/diagnosis-pages/CreateDiagnosisPage'
import CreateTreatmentPage from './pages/treatment-pages/CreateTreatmentPage'
import TreatmentsPage from './pages/treatment-pages/TreatmentsPage'
import ClinicalDocumentsPage from './pages/clinical-document-pages/ClinicalDocumentsPage';
import CreateExternalClinicalDocumentForm from '@/app/pages/clinical-document-pages/CreateExternalClinicalDocumentPage'
import ViewClinicalAttachmentsDocumentManagement from '@/features/clinical-records/clinical-documents/components/wrappers/ViewClinicalAttachmentsDocumentManagement';

import PatientDetailPage from '@/app/pages/patient-pages/PatientDetailPage'
import PatientDetailProfilePage from '@/app/pages/patient-pages/PatientDetailProfilePage';

import PatientFlowPage from '@/app/pages/patient-pages/PatientFlowPage';

import { redirect } from 'react-router';

async function requireAuth() {
    const res = await fetch('/api/auth/check', { credentials: 'include' }); // backend checks session
    if (res.status === 401) {
        throw redirect('/login');
    }
    return true;
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
                Component: UsersPage,
                handle: { title: 'Panel de Control' },
            },
            {
                path: '/users',
                Component: UsersPage,
                handle: { title: 'Usuarios' },
            },
            {
                path: '/users/new',
                Component: CreateUserPage,
                handle: { title: 'Añadir Usuario' },
            },
            {
                path: '/users/edit/:uuid',
                Component: UpdateUserPage,
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
                path: '/patients/:uuid/detail',
                Component: PatientDetailPage,
                handle: { title: 'Vista detallada de paciente' },
                children: [
                    {
                        path: 'profile',
                        Component: PatientDetailProfilePage,
                        handle: {title: 'Documentos clínicos'}
                    },
                    {
                        path: 'clinical-documents/:uuid',
                        Component: ViewClinicalAttachmentsDocumentManagement,
                        handle: {title: 'Ver documento clínico'}
                    },
                    {
                        path: 'clinical-documents/new-external',
                        Component: CreateExternalClinicalDocumentForm,
                        handle: {title: 'Crear documento clínico externo'}
                    },
                    {
                        path: 'treatments',
                        Component: TreatmentsPage,
                        handle: {title: 'Tratamientos'}
                    },
                    {
                        path: 'treatments/new',
                        Component: CreateTreatmentPage,
                        handle: {title: 'Crear tratamiento'}
                    },
                    {
                        path: 'diagnoses',
                        Component: DiagnosesPage,
                        handle: {title: 'Diagnósticos'}
                    },
                    {
                        path: 'diagnoses/new',
                        Component: CreateDiagnosisPage,
                        handle: {title: 'Crear diagnóstico'}
                    },
                ]
            },
            {
                path: '/patients/:uuid/flow',
                Component: PatientFlowPage,
                handle: {title: "Flujo del paciente"}
            },
            {
                path: '/patients/new',
                Component: CreatePatientPage,
                handle: { title: 'Añadir Paciente' },
            },
            {
                path: '/patients/edit/:uuid',
                Component: UpdatePatientPage,
                handle: { title: 'Editar Paciente' },
            },
            {
                path: '/agendas',
                Component: AgendasPage,
                handle: { title: 'Agendas' },
            },
            {
                path: '/appointments',
                Component: AppointmentsPage,
                handle: { title: 'Citas' },
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
                handle: {title: 'Registros clínicos'},
                children: [
                    {
                        path: 'clinical-documents',
                        Component: ClinicalDocumentsPage,
                        handle: {title: 'Documentos clínicos'}
                    },
                    {
                        path: 'clinical-documents/:uuid',
                        Component: ViewClinicalAttachmentsDocumentManagement,
                        handle: {title: 'Ver documento clínico'}
                    },
                    {
                        path: 'clinical-documents/new-external',
                        Component: CreateExternalClinicalDocumentForm,
                        handle: {title: 'Crear documento clínico externo'}
                    },
                    {
                        path: 'treatments',
                        Component: TreatmentsPage,
                        handle: {title: 'Tratamientos'}
                    },
                    {
                        path: 'treatments/new',
                        Component: CreateTreatmentPage,
                        handle: {title: 'Crear tratamiento'}
                    },
                    {
                        path: 'diagnoses',
                        Component: DiagnosesPage,
                        handle: {title: 'Diagnósticos'}
                    },
                    {
                        path: 'diagnoses/new',
                        Component: CreateDiagnosisPage,
                        handle: {title: 'Crear diagnóstico'}
                    },
                ]
            },
        ],
    },
    {
        path: '/login',
        Component: LoginPage,
    },
]);
