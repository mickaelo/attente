import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Form, Modal, Space, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
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
      const response = await axios.get('http://localhost:8000/medications');
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
      await axios.delete(`http://localhost:8000/medications/${id}`);
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
        await axios.put(`http://localhost:8000/medications/${selectedMedication.id}`, values);
      } else {
        // Sinon, c'est une création de nouveau médicament
        await axios.post('http://localhost:8000/medications', values);
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
      title: 'Nom du Médicament',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <span style={{ fontWeight: '500', color: '#1a365d' }}>{text}</span>
      ),
    },
    {
      title: 'Dosage',
      dataIndex: 'posology',
      key: 'posology',
      render: (text) => (
        <Tag color="blue" style={{ fontSize: '12px' }}>
          {text || 'Non spécifié'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />}
            onClick={() => handleEditClick(record)}
            style={{ borderRadius: '6px' }}
          >
            Éditer
          </Button>
          <Button 
            danger 
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteClick(record.id)}
            style={{ borderRadius: '6px' }}
          >
            Supprimer
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      padding: '32px 24px',
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.95)',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        padding: '32px 24px',
        maxWidth: 1200,
        margin: '0 auto',
      }}>
        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <h1 style={{ 
            fontSize: '32px', 
            fontWeight: 'bold', 
            color: '#1a365d', 
            marginBottom: '8px' 
          }}>
            Gestion des Médicaments
          </h1>
          <p style={{ 
            color: '#666', 
            fontSize: '16px',
            marginBottom: '24px'
          }}>
            Gérez votre base de données de médicaments et leurs posologies
          </p>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => setIsModalVisible(true)}
            size="large"
            style={{ 
              background: '#52c41a', 
              borderColor: '#52c41a',
              borderRadius: '8px',
              fontWeight: '500',
              height: '48px',
              padding: '0 24px'
            }}
          >
            Ajouter un Médicament
          </Button>
        </div>

        <div style={{
          background: '#fff',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          overflow: 'hidden'
        }}>
          <Table 
            dataSource={medications} 
            columns={columns} 
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} sur ${total} médicaments`,
            }}
          />
        </div>

        <Modal
          title={
            <span style={{ fontSize: '18px', fontWeight: '600', color: '#1a365d' }}>
              {selectedMedication ? 'Éditer Médicament' : 'Ajouter Nouveau Médicament'}
            </span>
          }
          open={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            setSelectedMedication(null);
            form.resetFields();
          }}
          onOk={handleSaveClick}
          width={600}
          centered
          okText="Enregistrer"
          cancelText="Annuler"
        >
          <Form form={form} layout="vertical" style={{ marginTop: '16px' }}>
            <Form.Item 
              label="Nom du médicament" 
              name="name" 
              rules={[{ required: true, message: 'Veuillez entrer le nom du médicament' }]}
            >
              <Input 
                placeholder="Ex: Paracétamol" 
                size="large"
                style={{ borderRadius: '8px' }}
              />
            </Form.Item>
            <Form.Item 
              label="Dosage/Posologie" 
              name="posology"
            >
              <Input.TextArea 
                placeholder="Ex: 500mg, 3 fois par jour" 
                rows={3}
                style={{ borderRadius: '8px' }}
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default MedicationsPage;
