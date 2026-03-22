import List from '@mui/material/List';

import DashboardIcon from '@mui/icons-material/Dashboard';
import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import PersonIcon from '@mui/icons-material/Person';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import EventNoteIcon from '@mui/icons-material/EventNote';
import CustomListItem from './CustomListItem';

export default function DrawerMainOptions({open}) {
    return (
        <List>
            <CustomListItem text='Panel de Control' link='/' open={open}>
                <DashboardIcon />
            </CustomListItem>

            <CustomListItem text='Usuarios' link='/users' open={open}>
                <ManageAccountsIcon />
            </CustomListItem>

            <CustomListItem text='Citas' link='/appointments' open={open}>
                <CalendarMonthIcon />
            </CustomListItem>

            <CustomListItem text='Agendas' link='/agendas' open={open}>
                <EventNoteIcon />
            </CustomListItem>

            <CustomListItem text='Pacientes' link='/patients' open={open}>
                <PersonIcon />
            </CustomListItem>

            <CustomListItem text='Registros clínicos' link='/clinical-records/clinical-documents' open={open}>
                <TextSnippetIcon />
            </CustomListItem>
            
            <CustomListItem text='Flujos de Paciente' link='/patient-flows' open={open}>
                <TransferWithinAStationIcon />
            </CustomListItem>
        </List>
    );
}
