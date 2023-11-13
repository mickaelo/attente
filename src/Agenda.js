import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Select from '@mui/material/Select';
import axios from 'axios';
import moment from 'moment';

import MenuItem from '@mui/material/MenuItem';
import { ViewState, EditingState, IntegratedEditing, GroupingState, IntegratedGrouping } from '@devexpress/dx-react-scheduler';
import {
    Scheduler,
    Appointments,
    AppointmentForm,
    AppointmentTooltip,
    WeekView,
    EditRecurrenceMenu,
    AllDayPanel,
    ConfirmationDialog,
    GroupingPanel,
    DayView,
    DragDropProvider,
    Resources,
    Toolbar,
    ViewSwitcher,
    MonthView
} from '@devexpress/dx-react-scheduler-material-ui';
import {
    teal, indigo,
} from '@mui/material/colors';

const locations = [
    { text: 'Accueil', id: 1 },
    { text: 'Orthoptiste', id: 2 },
    { text: 'Médecin', id: 3 },

];

const dragDisableIds = new Set([3, 8, 10, 12]);

const allowDrag = ({ id }) => !dragDisableIds.has(id);

const languageLocalization = {
    // Customize day names
    dayOfWeekMessages: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
    // Customize month names
    monthNames: [
        'Janvier',
        'Février',
        'Mars',
        'Avril',
        'Mai',
        'Juin',
        'Juillet',
        'Août',
        'Septembre',
        'Octobre',
        'Novembre',
        'Décembre',
    ],
};

const MyAgenda = () => {
    const [data, setData] = useState([]);
    console.log(data)
    const [currentDate, setCurrentDate] = useState(new Date());
    const [addedAppointment, setAddedAppointment] = useState({});
    const [appointmentChanges, setAppointmentChanges] = useState({});
    const [editingAppointment, setEditingAppointment] = useState(undefined);
    const [mainResourceName, setMainResourceName] = useState('ownerId');
    const [patients, setPatients] = useState([]);
    const [resources, setResources] = useState([
      
    ]);

    useEffect(() => {
        getPatients()
    }, [])

    const getPatients = () => {

        axios.get(`http://localhost:3002/users`)
            .then(user => {
                setResources([...resources, {
                    fieldName: 'userId',
                    title: 'Patient',
                    instances: user.data.map((p, i) => ({ id: p.id, text: p.firstName }))
                },
                {
                    fieldName: 'ownerId',
                    title: 'Médecin',
                    instances: user.data.map((p, i) => ({ id: p.id, text: p.firstName }))
                }])
                axios.get(`http://localhost:3002/consultations`)
                    .then(res => {
                        setData([...res.data.map((d) => ({
                            id: d.id,
                            title: user.data?.find((p) => p.id === d.user_id)?.firstName,
                            userId: d.user_id,
                            roomId: 2,
                            ownerId: d.owner_id,
                            startDate: new Date(d.date),
                            endDate: new Date(d.date).setHours(new Date(d.date).getHours() + 1)
                        }))])
                    })
            })
    }

    const [grouping] = useState([
        // {
        //     resourceName: 'roomId',
        // },
        {
            resourceName: 'ownerId',
        }]);


    const changeMainResource = (newMainResourceName) => {
        setMainResourceName(newMainResourceName);
    };

    const changeAddedAppointment = (newAddedAppointment) => {
        setAddedAppointment(newAddedAppointment);
    };

    const changeAppointmentChanges = (newAppointmentChanges) => {
        setAppointmentChanges(newAppointmentChanges);
    };

    const changeEditingAppointment = (newEditingAppointment) => {
        setEditingAppointment(newEditingAppointment);
    };

    const commitChanges = ({ added, changed, deleted }) => {
        let newData = [...data];

        if (added) {
            const startingAddedId = newData.length > 0 ? newData[newData.length - 1]?.id + 1 : 0;
            newData = [...newData, { id: startingAddedId, ...added }];
            const newConsultation = {
                prescription: "a",
                antecedents: "a",
                allergies: "a",
                name: "a",
                diagnosis: "a",
                status: "a",
                date: added.startDate,
                user_id: added.userId,
                owner_id: added.ownerId
                // measurements: {
                //   refraction: measurementsValues.refraction,
                //   acuitySC: measurementsValues.acuitySC,
                //   acuityAC: measurementsValues.acuityAC,
                //   pio: measurementsValues.pio,
                // },
                // exams: {
                //   laf: examsValues.laf,
                //   external: examsValues.external,
                // },
                // Ajoutez d'autres champs selon vos besoins
            };
            axios.post(`http://localhost:3002/consultations`, newConsultation)
                .then(() => getPatients())

        }

        if (changed) {
            newData = newData.map(appointment => (
                changed[appointment.id] ? { ...appointment, ...changed[appointment.id] } : appointment));

            axios.put(`http://localhost:3002/consultations/${Object.keys(changed)[0]}`, {
                ...changed[Object.keys(changed)[0]], owner_id: changed[Object.keys(changed)[0]].ownerId, user_id: changed[Object.keys(changed)[0]].userId, date: changed[Object.keys(changed)[0]].startDate
            })
                .then(() => getPatients())
        }

        if (deleted !== undefined) {
            axios.delete(`http://localhost:3002/consultations/${deleted}`)
                .then(() => getPatients())
            newData = newData.filter(appointment => appointment.id !== deleted);
        }

        setData(newData);
    };

    if (resources.length === 0) {
        return null
    }

    return (
        <React.Fragment>
            <Paper>
                <Scheduler
                    data={data}
                    height={660}
                    locale={languageLocalization}
                >
                    <ViewState
                        currentDate={currentDate}
                        defaultCurrentViewName="Month"
                    />
                    <EditingState
                        onCommitChanges={commitChanges}
                        addedAppointment={addedAppointment}
                        onAddedAppointmentChange={changeAddedAppointment}
                        appointmentChanges={appointmentChanges}
                        onAppointmentChangesChange={changeAppointmentChanges}
                        editingAppointment={editingAppointment}
                        onEditingAppointmentChange={changeEditingAppointment}
                    />
                    <GroupingState
                        grouping={grouping}
                    />
                    <DayView />
                    <WeekView

                    />
                    <MonthView

                    />
                    <EditRecurrenceMenu />
                    <Appointments />
                    <Resources
                        data={resources}
                        mainResourceName="ownerId"
                    />
                    <Toolbar />
                    <ViewSwitcher />
                    <IntegratedGrouping />
                    <IntegratedEditing />
                    <ConfirmationDialog />
                    <AppointmentTooltip
                        showOpenButton
                        showDeleteButton
                    />
                    <AppointmentForm />
                    <GroupingPanel />
                    <DragDropProvider
                        allowDrag={allowDrag}
                    />
                </Scheduler>
            </Paper>
        </React.Fragment>
    );
};

export default MyAgenda;
