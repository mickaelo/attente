import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, DatePicker, Select } from 'antd';
import moment from 'moment';

const { Option } = Select;

const EditPatientForm = ({ visible, patient, onCancel, onUpdatePatient }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(patient);
  }, [patient, form]);

  const handleSubmit = (values) => {
    // Mettre à jour les données du patient
    const updatedPatient = { ...patient, ...values };
    onUpdatePatient(updatedPatient);
  };

  return (
    <Modal
      title={`Éditer le patient ${patient.firstName} ${patient.lastName}`}
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Annuler
        </Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()}>
          Enregistrer
        </Button>,
      ]}
    >
      <Form
        form={form}
        onFinish={handleSubmit}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
      >
        <Form.Item label="Prénom" name="firstName">
          <Input />
        </Form.Item>

        <Form.Item label="Nom" name="lastName">
          <Input />
        </Form.Item>

        {/* <Form.Item label="Date de Naissance" name="birthDate">
          <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
        </Form.Item> */}

        <Form.Item label="Matricule" name="idNumber">
          <Input />
        </Form.Item>

        <Form.Item label="Fonction" name="occupation">
          <Input />
        </Form.Item>

        <Form.Item label="Téléphone Personnel" name="personalPhone">
          <Input />
        </Form.Item>

        <Form.Item label="Adresse" name="address">
          <Input.TextArea />
        </Form.Item>

        <Form.Item label="Sexe" name="gender">
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

        <Form.Item label="Email" name="email">
          <Input />
        </Form.Item>

        <Form.Item label="Téléphone Fixe" name="homePhone">
          <Input />
        </Form.Item>

        <Form.Item label="Remarques" name="notes">
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditPatientForm;
