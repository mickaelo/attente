import React, { useState } from 'react';
import { Form, Input, Button, DatePicker, Select } from 'antd';
import axios from 'axios';

const { Option } = Select;

const AddPatientForm = ({ getPatients }) => {
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    // Passer les données du nouveau patient à la fonction onAddPatient
    axios.post(`http://localhost:3002/users`, { user: values })
    getPatients()
    // Réinitialiser le formulaire après l'ajout du patient
    form.resetFields();
  };

  return (
    <div>
      <h2>Ajouter un Nouveau Patient</h2>
      <Form
        form={form}
        onFinish={handleSubmit}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
      >
        <Form.Item label="Prénom" name="firstName" rules={[{ required: true, message: 'Veuillez saisir le prénom du patient' }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Nom" name="lastName" rules={[{ required: true, message: 'Veuillez saisir le nom du patient' }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Date de Naissance" name="birthDate" rules={[{ required: true, message: 'Veuillez sélectionner la date de naissance du patient' }]}>
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="Matricule" name="idNumber">
          <Input />
        </Form.Item>

        <Form.Item label="Fonction" name="occupation">
          <Input />
        </Form.Item>

        <Form.Item label="Téléphone Personnel" name="personalPhone" rules={[{ required: true, message: 'Veuillez saisir le numéro de téléphone personnel du patient' }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Adresse" name="address" rules={[{ required: true, message: 'Veuillez saisir l\'adresse du patient' }]}>
          <Input.TextArea />
        </Form.Item>

        <Form.Item label="Prénom" name="firstName" rules={[{ required: true, message: 'Veuillez saisir le prénom du patient' }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Sexe" name="gender" rules={[{ required: true, message: 'Veuillez sélectionner le sexe du patient' }]}>
          <Select>
            <Option value="male">Homme</Option>
            <Option value="female">Femme</Option>
          </Select>
        </Form.Item>

        <Form.Item label="État Civil" name="maritalStatus">
          <Select>
            <Option value="single">Célibataire</Option>
            <Option value="married">Marié(e)</Option>
            <Option value="divorced">Divorcé(e)</Option>
            <Option value="widowed">Veuf/Veuve</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Assurance" name="insurance">
          <Input />
        </Form.Item>

        <Form.Item label="Email" name="email" rules={[{ type: 'email', message: 'Veuillez saisir une adresse email valide' }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Téléphone Fixe" name="homePhone">
          <Input />
        </Form.Item>

        <Form.Item label="Remarques" name="notes">
          <Input.TextArea />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Ajouter Patient
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddPatientForm;
