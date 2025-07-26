import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Modal, Form, Input, DatePicker, Select } from 'antd';
import EditPatientForm from './EditPatientForm'; // Assure-toi d'importer correctement le composant d'édition
import moment from 'moment';
import { useNavigate } from "react-router-dom";
import backgroundImg from './background.jpeg'; // Remplace avec le chemin de ton image de fond
import AppointmentCalendar from './Calendar';
import AddPatientForm from './AddPatient';
import axios from 'axios';
const { confirm } = Modal;
const { Option } = Select;


const backgroundStyle = {
  backgroundImage: `url(${backgroundImg})`,
  backgroundSize: 'cover',
  minHeight: '100vh',
  padding: '20px',
  color: 'white',
};

const generateRandomDate = () => {
  const start = new Date(1950, 0, 1);
  const end = new Date(2005, 11, 31);
  const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return moment(randomDate).format('YYYY-MM-DD');
};
const generateRandomPhoneNumber = () => {
  const digits = Math.floor(100000000 + Math.random() * 900000000);
  return `0${digits.toString().substring(0, 9)}`;
};

const generateRandomEmail = (firstName, lastName) => {
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'example.com'];
  const randomDomain = domains[Math.floor(Math.random() * domains.length)];
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${randomDomain}`;
};

const generateRandomPatients = () => {
  const patients = [];

  for (let i = 1; i <= 100; i++) {
    const firstName = `Patient${i}`;
    const lastName = `LastName${i}`;
    const birthDate = generateRandomDate();
    const idNumber = `ID${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    const occupation = `Occupation${i}`;
    const personalPhone = generateRandomPhoneNumber();
    const address = `Address${i}`;
    const gender = i % 2 === 0 ? 'male' : 'female';
    const maritalStatus = i % 3 === 0 ? 'married' : 'single';
    const insurance = `Insurance${i}`;
    const email = generateRandomEmail(firstName, lastName);
    const homePhone = generateRandomPhoneNumber();
    const notes = `Notes for patient ${i}`;

    const patient = {
      id: i,
      firstName,
      lastName,
      birthDate,
      idNumber,
      occupation,
      personalPhone,
      address,
      gender,
      maritalStatus,
      insurance,
      email,
      homePhone,
      notes,
    };

    patients.push(patient);
  }

  return patients;
};


const PatientList = () => {
  const [tab, setTab] = useState(null);
  const navigate = useNavigate();
  const [searchForm] = Form.useForm();
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [patients, setPatients] = useState([]);
  useEffect(() => {
    getPatients()
  }, [])

  const getPatients = () => {
    axios.get(`http://localhost:3002/users`)
      .then(res => {
        setPatients(res.data)
        setFilteredPatients(res.data)
      })
      .catch(err => {
        console.error('Erreur lors de la récupération des patients:', err);
        // Fallback vers les données générées si l'API n'est pas disponible
        const generatedPatients = generateRandomPatients();
        setPatients(generatedPatients);
        setFilteredPatients(generatedPatients);
      })
  }
  const onDeletePatient = (patient) => {
    axios.delete(`http://localhost:3002/users/${patient.id}`)
      .then(res => {
        getPatients()
      })
      .catch(err => {
        console.error('Erreur lors de la suppression du patient:', err);
      })
  }
  const columns = [
    {
      title: 'Prénom',
      dataIndex: 'firstName',
      key: 'firstName',
    },
    {
      title: 'Nom',
      dataIndex: 'lastName',
      key: 'lastName',
    },
    {
      title: 'Date de Naissance',
      dataIndex: 'birthDate',
      key: 'birthDate',
    },
    {
      title: 'Matricule',
      dataIndex: 'idNumber',
      key: 'idNumber',
    },
    {
      title: 'Fonction',
      dataIndex: 'occupation',
      key: 'occupation',
    },
    {
      title: 'Téléphone Personnel',
      dataIndex: 'personalPhone',
      key: 'personalPhone',
    },
    {
      title: 'Adresse',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Sexe',
      dataIndex: 'gender',
      key: 'gender',
    },
    {
      title: 'État Civil',
      dataIndex: 'maritalStatus',
      key: 'maritalStatus',
    },
    {
      title: 'Assurance',
      dataIndex: 'insurance',
      key: 'insurance',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Téléphone Fixe',
      dataIndex: 'homePhone',
      key: 'homePhone',
    },
    {
      title: 'Remarques',
      dataIndex: 'notes',
      key: 'notes',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Space size="middle">
          <Button onClick={() => navigate(`/patients/${record.id}`)}>Consulter dossier</Button>
          <Button onClick={() => showEditModal(record)}>Éditer</Button>
          <Button onClick={() => showDeleteConfirm(record)}>Supprimer</Button>
        </Space>
      ),
    },
  ];
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const showEditModal = (patient) => {
    setSelectedPatient(patient);
    setEditModalVisible(true);
  };
  const showAddModal = (patient) => {
    setAddModalVisible(true);
  };

  const handleAddCancel = () => {
    setAddModalVisible(false);
    setSelectedPatient(null);
  };

  const handleEditCancel = () => {
    setEditModalVisible(false);
    setSelectedPatient(null);
  };


  const handleSearch = (values) => {
    // Applique les filtres en fonction des valeurs de recherche
    const filteredResults = patients.filter((patient) => {
      return (
        (!values.firstName || patient.firstName.toLowerCase().includes(values.firstName.toLowerCase())) &&
        (!values.lastName || patient.lastName.toLowerCase().includes(values.lastName.toLowerCase())) &&
        (!values.birthDate || moment(patient.birthDate).isSame(moment(values.birthDate), 'day')) &&
        (!values.idNumber || patient.idNumber.includes(values.idNumber)) &&
        (!values.occupation || patient.occupation.toLowerCase().includes(values.occupation.toLowerCase())) &&
        (!values.gender || patient.gender === values.gender) &&
        (!values.maritalStatus || patient.maritalStatus === values.maritalStatus)
      );
    });

    setFilteredPatients(filteredResults);
  };

  const showDeleteConfirm = (patient) => {
    confirm({
      title: 'Êtes-vous sûr de vouloir supprimer ce patient?',
      icon: 'ExclamationCircleOutlined',
      okText: 'Oui',
      okType: 'danger',
      cancelText: 'Non',
      onOk() {
        onDeletePatient(patient);
      },
    });
  };

  return (
    <div style={backgroundStyle}>
      <h2>Liste des Patients</h2>
      {/* Formulaire de recherche */}
      <Form
        form={searchForm}
        onFinish={handleSearch}
        layout="inline"
        style={{ marginBottom: '16px' }}
      >
        <Form.Item name="firstName" label="Prénom">
          <Input />
        </Form.Item>

        <Form.Item name="lastName" label="Nom">
          <Input />
        </Form.Item>

        <Form.Item name="birthDate" label="Date de Naissance">
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="idNumber" label="Matricule">
          <Input />
        </Form.Item>

        <Form.Item name="occupation" label="Fonction">
          <Input />
        </Form.Item>

        <Form.Item name="gender" label="Sexe">
          <Select>
            <Option value="male">Homme</Option>
            <Option value="female">Femme</Option>
          </Select>
        </Form.Item>

        <Form.Item name="maritalStatus" label="État Civil">
          <Select>
            <Option value="single">Célibataire</Option>
            <Option value="married">Marié(e)</Option>
            <Option value="divorced">Divorcé(e)</Option>
            <Option value="widowed">Veuf/Veuve</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Rechercher
          </Button>
        </Form.Item>
        <Form.Item>
          <Button onClick={() => showAddModal()}>Ajouter</Button>
        </Form.Item>
      </Form>
      <Table dataSource={filteredPatients || patients} columns={columns} />
      {/* Composant d'édition des patients */}
      {selectedPatient && (
        <EditPatientForm
          visible={isEditModalVisible}
          patient={selectedPatient}
          onCancel={handleEditCancel}
          onUpdatePatient={(updatedPatient) => {
            // Implémente la logique pour mettre à jour le patient dans la liste
            axios.put(`http://localhost:3002/users/${updatedPatient.id}`, updatedPatient)
              .then(res => {
                handleEditCancel();
                getPatients()
              })
            console.log('Patient mis à jour :', updatedPatient);
          }}
        />
      )}
      <Modal
        title={`Ajout`}
        visible={isAddModalVisible}
        onCancel={handleAddCancel}
        footer={[
          <Button key="cancel" onClick={handleAddCancel}>
            Annuler
          </Button>,
        ]}
      >
        <AddPatientForm getPatients={getPatients} />
      </Modal>
    </div>
  );
};

export default PatientList;

// const users = []
// for (let pas = 0; pas < 10; pas++) {
//   const formData = `scope=all&filter=%26member_type%3Dabo-plus&nonce=ef38acd365&action=members_filter&object=members&target=%23buddypress+%5Bdata-bp-list%5D&&search_terms=&page=${pas}&extras=&caller=&template=&method=reset`;

//   fetch('https://hommenouveau.fr/wp-admin/admin-ajax.php', {
//     method: 'POST',
//     headers: {
//       'Accept': '*/*',
//       'Accept-Encoding': 'gzip, deflate, br',
//       'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
//       'Connection': 'keep-alive',
//       'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
//       'Content-Length': formData.length.toString(),
//       'Cookie': 'your_cookie_data_here',
//       'DNT': '1',
//       'Host': 'hommenouveau.fr',
//       'Origin': 'https://hommenouveau.fr',
//       'Referer': 'https://hommenouveau.fr/membres/',
//       'Sec-Fetch-Dest': 'empty',
//       'Sec-Fetch-Mode': 'cors',
//       'Sec-Fetch-Site': 'same-origin',
//       'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
//       'X-Requested-With': 'XMLHttpRequest',
//       'sec-ch-ua': '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
//       'sec-ch-ua-mobile': '?0',
//       'sec-ch-ua-platform': '"Windows"'
//     },
//     body: formData,
//   })
//     .then(response => response.json())
//     .then(data => {
//         // Assuming 'htmlContent' contains the HTML string you provided
//   var htmlContent = data.data.contents;

//   // Create a temporary div element to hold the HTML content
//   var tempDiv = document.createElement('div');
//   tempDiv.innerHTML = htmlContent;

//   // Select the elements you want to extract using querySelector or other DOM methods
//   var memberElements = tempDiv.querySelectorAll('.item-entry');

//   // Iterate through each member element and extract relevant information
//   var membersData = [];

//   memberElements.forEach(function(memberElement) {
//       var name = memberElement.querySelector('.list-title.member-name a').textContent.trim();
//       var lastActivity = memberElement.querySelector('.item-meta.last-activity').textContent.trim();

//       // You can add more properties based on the data you need

//       var memberData = {
//           name: name,
//           lastActivity: lastActivity
//       };

//       membersData.push(memberData);
//   });

//   // Log the extracted data
//   // console.log(membersData);
//   users.push(membersData)
//     })
//     .catch(error => console.error(error));
//   }
//   console.log(users)
