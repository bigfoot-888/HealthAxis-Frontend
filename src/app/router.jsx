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
                path: '/users/edit/:id',
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
                path: '/patients/new',
                Component: CreatePatientPage,
                handle: { title: 'Añadir Paciente' },
            },
            {
                path: '/patients/edit/:id',
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
                path: '/appointments/edit/:id',
                Component: EditAppointmentPage,
                handle: { title: 'Editar Cita' },
            }
        ],
    },
    {
        path: '/login',
        Component: LoginPage,
    },
]);
