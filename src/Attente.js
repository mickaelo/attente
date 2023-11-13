import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Tabs, Table, Button, Popconfirm, message, Tag } from 'antd';
import { useNavigate } from "react-router-dom";
import backgroundImg from './background.jpeg'; // Remplace avec le chemin de ton image de fond
import AppointmentCalendar from './Calendar';
import MyAgenda from './Agenda';
const { TabPane } = Tabs;

const backgroundStyle = {
    backgroundImage: `url(${backgroundImg})`,
    backgroundSize: 'cover',
    minHeight: '100vh',
    padding: '20px',
    color: 'white',
};
const generateRandomStatus = () => {
    const statuses = ['Accueil', 'Orthoptiste', 'Médecin'];
    const randomIndex = Math.floor(Math.random() * statuses.length);
    return statuses[randomIndex];
};

const generateRandomName = () => {
    const names = ['John Doe', 'Jane Doe', 'Alice', 'Bob', 'Charlie', 'David', 'Eva', 'Frank', 'Grace', 'Henry'];
    const randomIndex = Math.floor(Math.random() * names.length);
    return names[randomIndex];
};

const ontLeMemeJour = (date1, date2) => {
    console.log(date1)
    console.log(date2)
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
}


const generatePatientList = (count) => {
    const patients = [];
    for (let i = 1; i <= count; i++) {
        const patient = {
            id: i,
            name: generateRandomName(),
            status: generateRandomStatus(),
        };
        patients.push(patient);
    }
    return patients;
};

const QueueManager = () => {
    const [queue, setQueue] = useState([]);
    const [patients, setPatients] = useState([]);
    const [tab, setTab] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        getPatients()
    }, [tab]); // Utilise une dépendance vide pour n'effectuer l'effet qu'une seule fois à la création du composant

    const getPatients = () => {
        axios.get(`http://localhost:3002/consultations`)
            .then(res => {
                setQueue(res.data.filter((d) => ontLeMemeJour(new Date(d.date), new Date())))
            })
    }

    const removeFromQueue = (userId) => {
        // Ici, tu devrais envoyer une requête HTTP vers ton backend pour retirer l'utilisateur de la file d'attente
        // Assure-toi d'adapter cela en fonction de ton architecture

        // Exemple de suppression d'un utilisateur de la file d'attente côté client
        const updatedQueue = queue.filter((user) => user.userId !== userId);
        setQueue(updatedQueue);

        // Exemple d'affichage d'un message de confirmation
        message.success('Utilisateur retiré de la file d\'attente avec succès.');
    };

    const columns = [
        {
            title: 'Heure',
            dataIndex: '',
            key: 'hour',
            render: (item) => {
                console.log(item)
                return moment(item.date).format("hh:mm")
            },
            sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix()
        },
        {
            title: 'Prénom',
            dataIndex: '',
            key: 'firstName',
            render: (item) => {
                console.log(item)
                return item.user?.firstName
            },
        },
        {
            title: 'Nom',
            key: 'lastName',
            render: (item) => {
                console.log(item)
                return item.user?.lastName
            },
        },
        {
            title: 'Statut',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'Accueil' ? 'orange' : status === 'Médecin' ? 'green' : 'blue'}>
                    {status}
                </Tag>
            ),
        },
        // {
        //     title: 'Action',
        //     key: 'action',
        //     render: (text, record) => (
        //         <Popconfirm
        //             title="Retirer de la file d'attente?"
        //             onConfirm={() => removeFromQueue(record.userId)}
        //             okText="Oui"
        //             cancelText="Non"
        //         >
        //             <Button type="danger">Retirer</Button>
        //         </Popconfirm>
        //     ),
        // },
        {
            title: '',
            key: '',
            render: (text, record) => (
                <Button onClick={() => navigate("/consultation/" + record.id)}>Consulter</Button>
            ),
        },
    ];

    return (
        <div style={backgroundStyle}>
            <Tabs onChange={setTab} defaultActiveKey="1" tabPosition="left" style={{ height: '100vh' }}>
                <TabPane tab="Consultations du jour" key="1">
                    {/* Contenu de la file d'attente */}
                    <Table columns={columns} dataSource={queue} />
                </TabPane>
                {/* <TabPane tab="Calendrier" key="2">
                    <AppointmentCalendar />
                </TabPane> */}
                <TabPane tab="Agenda" key="3">
                    {/* Contenu du calendrier */}
                    <MyAgenda />
                </TabPane>
            </Tabs>

        </div>
    );
};

export default QueueManager;
