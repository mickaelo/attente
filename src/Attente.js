import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Tabs, Table, Button, Popconfirm, message, Tag } from 'antd';
import { useNavigate } from "react-router-dom";
import backgroundImg from './medical-bg.jpg'; // Nouvelle image médicale nette
import AppointmentCalendar from './Calendar';
import MyAgenda from './Agenda';
import OpenAIComponent from './OpenAIComponent';

const { TabPane } = Tabs;

const backgroundStyle = {
    backgroundImage: `url(${backgroundImg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
    padding: '20px',
    color: 'white',
    // Suppression du flou
    // backdropFilter: 'blur(2px)',
    // backgroundColor: 'rgba(255,255,255,0.85)',
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
        axios.get(`http://localhost:8000/consultations`)
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
            sort: (a, b) => moment(b.date).unix() - moment(a.date).unix(),
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
        <div style={{
            ...backgroundStyle,
            color: '#222',
            borderRadius: '16px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
            margin: '32px auto',
            maxWidth: 1200,
            padding: '32px 24px',
        }}>
            <Tabs
                onChange={setTab}
                defaultActiveKey="1"
                tabPosition="left"
                style={{ minHeight: '80vh' }}
                items={[
                    {
                        label: <span style={{fontWeight:'bold',fontSize:18,letterSpacing:1}}>Consultations du jour</span>,
                        key: '1',
                        children: (
                            <div>
                                <OpenAIComponent />
                                <Table
                                    columns={columns}
                                    dataSource={queue}
                                    rowKey={row => row.id}
                                    bordered
                                    style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                                />
                            </div>
                        ),
                    },
                    // {
                    //     label: <span style={{fontWeight:'bold',fontSize:18,letterSpacing:1}}>Calendrier</span>,
                    //     key: '2',
                    //     children: <AppointmentCalendar />,
                    // },
                    {
                        label: <span style={{fontWeight:'bold',fontSize:18,letterSpacing:1}}>Agenda</span>,
                        key: '3',
                        children: <MyAgenda />,
                    },
                ]}
            />
        </div>
    );
};

export default QueueManager;
