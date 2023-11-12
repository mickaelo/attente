import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
    const navigate = useNavigate();

    useEffect(() => {
        // Ici, tu devrais charger les données de la file d'attente depuis ton backend
        // par exemple, avec une requête HTTP vers une API REST
        // Assure-toi d'adapter cela en fonction de ton architecture

        // Exemple de structure d'un élément de file d'attente
        const sampleQueueData = patients;

        setQueue(sampleQueueData);
        getPatients()
    }, []); // Utilise une dépendance vide pour n'effectuer l'effet qu'une seule fois à la création du composant
    const getPatients = () => {
        axios.get(`http://localhost:3002/users`)
            .then(res => {
                setQueue(res.data)
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
            title: 'Prénom',
            dataIndex: 'firstName',
            key: 'name',
        },
        {
            title: 'Nom',
            dataIndex: 'lastName',
            key: 'name',
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
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Popconfirm
                    title="Retirer de la file d'attente?"
                    onConfirm={() => removeFromQueue(record.userId)}
                    okText="Oui"
                    cancelText="Non"
                >
                    <Button type="danger">Retirer</Button>
                </Popconfirm>
            ),
        },
        {
            title: '',
            key: '',
            render: (text, record) => (
                <Button onClick={() => navigate("/consultation/"+record.id)}>edit</Button>
            ),
        },
    ];

    console.log(patients)

    return (
        <div style={backgroundStyle}>
            <h1>File d'attente</h1>
            <Tabs defaultActiveKey="1" tabPosition="left" style={{ height: '100vh' }}>
                <TabPane tab="File d'attente" key="1">
                    {/* Contenu de la file d'attente */}
                    <Table columns={columns} dataSource={queue} />
                </TabPane>
                <TabPane tab="Calendrier" key="2">
                    {/* Contenu du calendrier */}
                    <AppointmentCalendar />
                </TabPane>
                <TabPane tab="Agenda" key="3">
                    {/* Contenu du calendrier */}
                    <MyAgenda />
                </TabPane>
            </Tabs>

        </div>
    );
};

export default QueueManager;
