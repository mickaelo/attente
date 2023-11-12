import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Form, Modal } from 'antd';
import axios from 'axios';

const MedicationsPage = () => {
  const [form] = Form.useForm();
  const [medications, setMedications] = useState([]);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    // Chargement initial de la liste des médicaments
    fetchMedications();
  }, []);

  const fetchMedications = async () => {
    try {
      const response = await axios.get('http://localhost:3002/medications');
      setMedications(response.data);
    } catch (error) {
      console.error('Error fetching medications:', error);
    }
  };

  const handleEditClick = (medication) => {
    setSelectedMedication(medication);
    setIsModalVisible(true);
    form.setFieldsValue({ name: medication.name, posology: medication.posology });
  };

  const handleDeleteClick = async (id) => {
    try {
      await axios.delete(`http://localhost:3002/medications/${id}`);
      fetchMedications(); // Recharger la liste après la suppression
    } catch (error) {
      console.error('Error deleting medication:', error);
    }
  };

  const handleSaveClick = async () => {
    try {
      const values = await form.validateFields();

      if (selectedMedication) {
        // Si un médicament est sélectionné, c'est une mise à jour
        await axios.put(`http://localhost:3002/medications/${selectedMedication.id}`, values);
      } else {
        // Sinon, c'est une création de nouveau médicament
        await axios.post('http://localhost:3002/medications', values);
      }

      // Réinitialiser les états
      setSelectedMedication(null);
      setIsModalVisible(false);
      form.resetFields();
      fetchMedications(); // Recharger la liste après la mise à jour
    } catch (error) {
      console.error('Error saving medication:', error);
    }
  };

  const columns = [
    {
      title: 'Nom',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Dosage',
      dataIndex: 'posology',
      key: 'posology',
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      render: (_, record) => (
        <div>
          <Button onClick={() => handleEditClick(record)}>Éditer</Button>
          <Button danger onClick={() => handleDeleteClick(record.id)}>Supprimer</Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h1>Liste des Médicaments</h1>

      <Table dataSource={medications} columns={columns} rowKey="id" />
      <Button type="primary" onClick={() => setIsModalVisible(true)}>
        Nouvelle Médication
      </Button>
      <Modal
        title={selectedMedication ? 'Éditer Médicament' : 'Ajouter Nouveau Médicament'}
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        onOk={handleSaveClick}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Nom" name="name" rules={[{ required: true, message: 'Veuillez entrer le nom du médicament' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Dosage" name="posology">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MedicationsPage;
