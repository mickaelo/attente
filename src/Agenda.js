import * as React from 'react';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Select from '@mui/material/Select';
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
    ViewSwitcher
} from '@devexpress/dx-react-scheduler-material-ui';
import {
    teal, indigo,
} from '@mui/material/colors';

const appointments = [{
    id: 0,
    title: 'Watercolor Landscape',
    members: [1, 2],
    roomId: 1,
    startDate: new Date(2017, 4, 28, 9, 30),
    endDate: new Date(2017, 4, 28, 12, 0),
}, {
    id: 1,
    title: 'Oil Painting for Beginners',
    members: [1],
    roomId: 2,
    startDate: new Date(2017, 4, 28, 12, 30),
    endDate: new Date(2017, 4, 28, 14, 30),
}, {
    id: 2,
    title: 'Testing',
    members: [1, 2],
    roomId: 1,
    startDate: new Date(2017, 4, 29, 12, 30),
    endDate: new Date(2017, 4, 29, 14, 30),
}, {
    id: 3,
    title: 'Final exams',
    members: [1, 2],
    roomId: 2,
    startDate: new Date(2017, 4, 29, 9, 30),
    endDate: new Date(2017, 4, 29, 12, 0),
}];
const PREFIX = 'Demo';
const locations = [
    { text: 'Accueil', id: 1 },
    { text: 'Orthoptiste', id: 2 },
    { text: 'Médecin', id: 3 },

];
const owners = [{
    text: 'Léa Trouvé',
    id: 1,
    color: indigo,
}, {
    text: 'Collègue de Léa',
    id: 2,
    color: teal,
}];

const classes = {
    container: `${PREFIX}-container`,
    text: `${PREFIX}-text`,
};

const StyledDiv = styled('div')(({ theme }) => ({
    [`&.${classes.container}`]: {
        display: 'flex',
        marginBottom: theme.spacing(2),
        justifyContent: 'flex-end',
    },
    [`& .${classes.text}`]: {
        ...theme.typography.h6,
        marginRight: theme.spacing(2),
    },
}));

const ResourceSwitcher = (
    ({
        mainResourceName, onChange, resources,
    }) => (
        <StyledDiv className={classes.container}>
            <div className={classes.text}>
                Main resource name:
            </div>
            <Select
                variant="standard"
                value={mainResourceName}
                onChange={e => onChange(e.target.value)}
            >
                {resources.map(resource => (
                    <MenuItem key={resource.fieldName} value={resource.fieldName}>
                        {resource.title}
                    </MenuItem>
                ))}
            </Select>
        </StyledDiv>
    )
);

const recurrenceAppointments = [{
    title: 'Website Re-Design Plan',
    startDate: new Date(2018, 5, 25, 9, 15),
    endDate: new Date(2018, 5, 25, 11, 30),
    id: 100,
    rRule: 'FREQ=DAILY;COUNT=3',
    exDate: '20180628T063500Z,20180626T061500Z',
}, {
    title: 'Book Flights to San Fran for Sales Trip',
    startDate: new Date(2018, 5, 25, 12, 11),
    endDate: new Date(2018, 5, 25, 13, 0),
    id: 101,
    rRule: 'FREQ=DAILY;COUNT=4',
    exDate: '20180627T091100Z',
    allDay: true,
}, {
    title: 'Install New Router in Dev Room',
    startDate: new Date(2018, 5, 25, 13, 30),
    endDate: new Date(2018, 5, 25, 14, 35),
    id: 102,
    rRule: 'FREQ=DAILY;COUNT=5',
}, {
    title: 'Approve Personal Computer Upgrade Plan',
    startDate: new Date(2018, 5, 26, 10, 0),
    endDate: new Date(2018, 5, 26, 11, 0),
    id: 3,
    location: 'Room 2',
}, {
    title: 'Final Budget Review',
    startDate: new Date(2018, 5, 27, 11, 45),
    endDate: new Date(2018, 5, 27, 13, 20),
    id: 4,
    location: 'Room 2',
}, {
    title: 'New Brochures',
    startDate: new Date(2018, 5, 26, 14, 40),
    endDate: new Date(2018, 5, 26, 15, 45),
    id: 5,
    location: 'Room 2',
}, {
    title: 'Install New Database',
    startDate: new Date(2018, 5, 28, 9, 45),
    endDate: new Date(2018, 5, 28, 11, 15),
    id: 6,
    location: 'Room 1',
}, {
    title: 'Approve New Online Marketing Strategy',
    startDate: new Date(2018, 5, 29, 11, 45),
    endDate: new Date(2018, 5, 29, 13, 5),
    id: 7,
    location: 'Room 3',
}, {
    title: 'Create Icons for Website',
    startDate: new Date(2018, 5, 29, 10, 0),
    endDate: new Date(2018, 5, 29, 11, 30),
    id: 12,
    location: 'Room 2',
}];

const dragDisableIds = new Set([3, 8, 10, 12]);

const allowDrag = ({ id }) => !dragDisableIds.has(id);
const appointmentComponent = (props) => {
    if (allowDrag(props.data)) {
        return <Appointments.Appointment {...props} />;
    } return <Appointments.Appointment {...props} style={{ ...props.style, cursor: 'not-allowed' }} />;
};
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
export default class MyAgenda extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            data: appointments,
            currentDate: '2018-06-27',

            addedAppointment: {},
            appointmentChanges: {},
            editingAppointment: undefined,
            mainResourceName: 'members',
            grouping: [
                // {
                //     resourceName: 'roomId',
                // },
                {
                    resourceName: 'members',
                }],
            resources: [{
                fieldName: 'members',
                title: 'Members',
                instances: owners,
                allowMultiple: true,
            }, {
                fieldName: 'roomId',
                title: 'Location',
                instances: locations,
            }],
        };

        this.commitChanges = this.commitChanges.bind(this);
        this.changeAddedAppointment = this.changeAddedAppointment.bind(this);
        this.changeAppointmentChanges = this.changeAppointmentChanges.bind(this);
        this.changeEditingAppointment = this.changeEditingAppointment.bind(this);
        this.changeMainResource = this.changeMainResource.bind(this);
    }


    changeMainResource(mainResourceName) {
        this.setState({ mainResourceName });
    }

    changeAddedAppointment(addedAppointment) {
        this.setState({ addedAppointment });
    }

    changeAppointmentChanges(appointmentChanges) {
        this.setState({ appointmentChanges });
    }

    changeEditingAppointment(editingAppointment) {
        this.setState({ editingAppointment });
    }

    commitChanges({ added, changed, deleted }) {
        this.setState((state) => {
            let { data } = state;
            if (added) {
                const startingAddedId = data.length > 0 ? data?.[data.length - 1]?.id + 1 : 0;
                data = [...data, { id: startingAddedId, ...added }];
            }
            if (changed) {
                data = data.map(appointment => (
                    changed[appointment.id] ? { ...appointment, ...changed[appointment.id] } : appointment));
            }
            if (deleted !== undefined) {
                data = data.filter(appointment => appointment.id !== deleted);
            }
            return { data };
        });
    }
    render() {
        const {
            currentDate, data, addedAppointment, appointmentChanges, editingAppointment, resources, mainResourceName, grouping
        } = this.state;

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
                            defaultCurrentViewName="Week"
                        />
                        <EditingState
                            onCommitChanges={this.commitChanges}
                            addedAppointment={addedAppointment}
                            onAddedAppointmentChange={this.changeAddedAppointment}
                            appointmentChanges={appointmentChanges}
                            onAppointmentChangesChange={this.changeAppointmentChanges}
                            editingAppointment={editingAppointment}
                            onEditingAppointmentChange={this.changeEditingAppointment}
                        />
                        <GroupingState
                            grouping={grouping}
                        />

                        <DayView

                        />
                        <WeekView
                            startDayHour={9}
                            endDayHour={17}
                        />
                        <EditRecurrenceMenu />
                        <Appointments />
                        <Resources
                            data={resources}
                            mainResourceName="members"
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
    }
}
