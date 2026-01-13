import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Tag,
  Space,
  Row,
  Col,
  Statistic,
  Tabs,
  message,
  Popconfirm,
  InputNumber
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EuroOutlined,
  FileTextOutlined,
  CreditCardOutlined,
  DollarOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;
const { TabPane } = Tabs;

const AccountingPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [patients, setPatients] = useState([]);
  const [dashboard, setDashboard] = useState({});
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('dashboard');

  const API_BASE = 'http://localhost:8000';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [invoicesRes, paymentsRes, expensesRes, patientsRes, dashboardRes] = await Promise.all([
        fetch(`${API_BASE}/accounting/invoices/`),
        fetch(`${API_BASE}/accounting/payments/`),
        fetch(`${API_BASE}/accounting/expenses/`),
        fetch(`${API_BASE}/users/`),
        fetch(`${API_BASE}/accounting/dashboard/`)
      ]);

      const [invoicesData, paymentsData, expensesData, patientsData, dashboardData] = await Promise.all([
        invoicesRes.json(),
        paymentsRes.json(),
        expensesRes.json(),
        patientsRes.json(),
        dashboardRes.json()
      ]);

      setInvoices(invoicesData);
      setPayments(paymentsData);
      setExpenses(expensesData);
      setPatients(patientsData);
      setDashboard(dashboardData);
    } catch (error) {
      message.error('Erreur lors du chargement des données');
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount / 100);
  };

  const handleCreate = async (values) => {
    try {
      const endpoint = activeTab === 'invoices' ? 'invoices' : 
                      activeTab === 'payments' ? 'payments' : 'expenses';
      
      // Convertir la date dayjs en format YYYY-MM-DD
      const processedValues = {
        ...values,
        date: values.date ? dayjs(values.date).format('YYYY-MM-DD') : null
      };
      
      const response = await fetch(`${API_BASE}/accounting/${endpoint}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(processedValues)
      });

      if (response.ok) {
        message.success(`${activeTab === 'invoices' ? 'Facture' : activeTab === 'payments' ? 'Paiement' : 'Dépense'} créé avec succès`);
        setModalVisible(false);
        form.resetFields();
        fetchData();
      } else {
        message.error('Erreur lors de la création');
      }
    } catch (error) {
      message.error('Erreur lors de la création');
    }
  };

  const handleUpdate = async (values) => {
    try {
      const endpoint = activeTab === 'invoices' ? 'invoices' : 
                      activeTab === 'payments' ? 'payments' : 'expenses';
      
      // Convertir la date dayjs en format YYYY-MM-DD
      const processedValues = {
        ...values,
        date: values.date ? dayjs(values.date).format('YYYY-MM-DD') : null
      };
      
      const response = await fetch(`${API_BASE}/accounting/${endpoint}/${editingItem.id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(processedValues)
      });

      if (response.ok) {
        message.success(`${activeTab === 'invoices' ? 'Facture' : activeTab === 'payments' ? 'Paiement' : 'Dépense'} mis à jour avec succès`);
        setModalVisible(false);
        setEditingItem(null);
        form.resetFields();
        fetchData();
      } else {
        message.error('Erreur lors de la mise à jour');
      }
    } catch (error) {
      message.error('Erreur lors de la mise à jour');
    }
  };

  const handleDelete = async (id) => {
    try {
      const endpoint = activeTab === 'invoices' ? 'invoices' : 
                      activeTab === 'payments' ? 'payments' : 'expenses';
      
      const response = await fetch(`${API_BASE}/accounting/${endpoint}/${id}/`, {
        method: 'DELETE'
      });

      if (response.ok) {
        message.success(`${activeTab === 'invoices' ? 'Facture' : activeTab === 'payments' ? 'Paiement' : 'Dépense'} supprimé avec succès`);
        fetchData();
      } else {
        message.error('Erreur lors de la suppression');
      }
    } catch (error) {
      message.error('Erreur lors de la suppression');
    }
  };

  const openModal = (item = null) => {
    setEditingItem(item);
    if (item) {
      form.setFieldsValue({
        ...item,
        date: item.date ? dayjs(item.date) : null
      });
    } else {
      form.resetFields();
    }
    setModalVisible(true);
  };

  const invoiceColumns = [
    {
      title: 'Patient',
      dataIndex: 'patient_id',
      key: 'patient_id',
      render: (patientId) => {
        const patient = patients.find(p => p.id === patientId);
        return patient ? `${patient.firstName} ${patient.lastName}` : 'N/A';
      }
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => dayjs(date).format('DD/MM/YYYY')
    },
    {
      title: 'Montant',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => formatCurrency(amount)
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: 'Statut',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'paid' ? 'green' : status === 'partial' ? 'orange' : 'red'}>
          {status === 'paid' ? 'Payée' : status === 'partial' ? 'Partielle' : 'Impayée'}
        </Tag>
      )
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type'
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => openModal(record)}
          />
          <Popconfirm
            title="Êtes-vous sûr de vouloir supprimer cette facture ?"
            onConfirm={() => handleDelete(record.id)}
            okText="Oui"
            cancelText="Non"
          >
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              size="small"
            />
          </Popconfirm>
        </Space>
      )
    }
  ];

  const paymentColumns = [
    {
      title: 'Facture ID',
      dataIndex: 'invoice_id',
      key: 'invoice_id'
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => dayjs(date).format('DD/MM/YYYY')
    },
    {
      title: 'Montant',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => formatCurrency(amount)
    },
    {
      title: 'Méthode',
      dataIndex: 'method',
      key: 'method',
      render: (method) => (
        <Tag color="blue">{method}</Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => openModal(record)}
          />
          <Popconfirm
            title="Êtes-vous sûr de vouloir supprimer ce paiement ?"
            onConfirm={() => handleDelete(record.id)}
            okText="Oui"
            cancelText="Non"
          >
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              size="small"
            />
          </Popconfirm>
        </Space>
      )
    }
  ];

  const expenseColumns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => dayjs(date).format('DD/MM/YYYY')
    },
    {
      title: 'Montant',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => formatCurrency(amount)
    },
    {
      title: 'Catégorie',
      dataIndex: 'category',
      key: 'category',
      render: (category) => (
        <Tag color="purple">{category}</Tag>
      )
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => openModal(record)}
          />
          <Popconfirm
            title="Êtes-vous sûr de vouloir supprimer cette dépense ?"
            onConfirm={() => handleDelete(record.id)}
            okText="Oui"
            cancelText="Non"
          >
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              size="small"
            />
          </Popconfirm>
        </Space>
      )
    }
  ];

  const renderForm = () => {
    const commonFields = [
      {
        name: 'date',
        label: 'Date',
        rules: [{ required: true, message: 'Veuillez sélectionner une date' }],
        component: <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
      },
      {
        name: 'amount',
        label: 'Montant (en centimes)',
        rules: [{ required: true, message: 'Veuillez saisir un montant' }],
        component: <InputNumber style={{ width: '100%' }} min={0} />
      }
    ];

    if (activeTab === 'invoices') {
      return [
        {
          name: 'patient_id',
          label: 'Patient',
          rules: [{ required: true, message: 'Veuillez sélectionner un patient' }],
          component: (
            <Select placeholder="Sélectionner un patient">
              {patients.map(patient => (
                <Option key={patient.id} value={patient.id}>
                  {patient.firstName} {patient.lastName}
                </Option>
              ))}
            </Select>
          )
        },
        ...commonFields,
        {
          name: 'description',
          label: 'Description',
          component: <Input.TextArea />
        },
        {
          name: 'status',
          label: 'Statut',
          component: (
            <Select defaultValue="unpaid">
              <Option value="unpaid">Impayée</Option>
              <Option value="partial">Partielle</Option>
              <Option value="paid">Payée</Option>
            </Select>
          )
        },
        {
          name: 'type',
          label: 'Type',
          component: (
            <Select placeholder="Sélectionner un type">
              <Option value="consultation">Consultation</Option>
              <Option value="acte">Acte médical</Option>
              <Option value="materiel">Matériel</Option>
              <Option value="autre">Autre</Option>
            </Select>
          )
        }
      ];
    } else if (activeTab === 'payments') {
      return [
        {
          name: 'invoice_id',
          label: 'ID Facture',
          rules: [{ required: true, message: 'Veuillez saisir l\'ID de la facture' }],
          component: <InputNumber style={{ width: '100%' }} min={1} />
        },
        ...commonFields,
        {
          name: 'method',
          label: 'Méthode de paiement',
          component: (
            <Select placeholder="Sélectionner une méthode">
              <Option value="cash">Espèces</Option>
              <Option value="card">Carte bancaire</Option>
              <Option value="cheque">Chèque</Option>
              <Option value="virement">Virement</Option>
            </Select>
          )
        }
      ];
    } else {
      return [
        ...commonFields,
        {
          name: 'category',
          label: 'Catégorie',
          component: (
            <Select placeholder="Sélectionner une catégorie">
              <Option value="loyer">Loyer</Option>
              <Option value="materiel">Matériel</Option>
              <Option value="salaires">Salaires</Option>
              <Option value="utilities">Charges</Option>
              <Option value="autre">Autre</Option>
            </Select>
          )
        },
        {
          name: 'description',
          label: 'Description',
          component: <Input.TextArea />
        }
      ];
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <Card style={{
        borderRadius: '15px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <h1 style={{ 
            color: '#2c3e50', 
            margin: 0, 
            fontSize: '2.5rem',
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
            <EuroOutlined style={{ marginRight: '10px', color: '#27ae60' }} />
            Comptabilité du Cabinet
          </h1>
          <p style={{ 
            textAlign: 'center', 
            color: '#7f8c8d', 
            fontSize: '1.1rem',
            marginTop: '10px'
          }}>
            Gestion des factures, paiements et dépenses
          </p>
        </div>

        <Tabs activeKey={activeTab} onChange={setActiveTab} size="large">
          <TabPane tab={<span><DollarOutlined />Tableau de bord</span>} key="dashboard">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title="Total Factures"
                    value={dashboard.total_invoices || 0}
                    prefix={<FileTextOutlined />}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title="Factures Payées"
                    value={dashboard.paid_invoices || 0}
                    prefix={<FileTextOutlined />}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title="Factures Impayées"
                    value={dashboard.unpaid_invoices || 0}
                    prefix={<FileTextOutlined />}
                    valueStyle={{ color: '#faad14' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title="Total Dépenses"
                    value={dashboard.total_expenses || 0}
                    prefix={<CreditCardOutlined />}
                    valueStyle={{ color: '#f5222d' }}
                  />
                </Card>
              </Col>
            </Row>
            
            <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
              <Col xs={24} lg={12}>
                <Card title="Montants (EUR)" style={{ height: '200px' }}>
                  <Statistic
                    title="Total Factures"
                    value={formatCurrency(dashboard.total_invoices_amount || 0)}
                    valueStyle={{ color: '#1890ff', fontSize: '1.5rem' }}
                  />
                  <Statistic
                    title="Total Payé"
                    value={formatCurrency(dashboard.paid_invoices_amount || 0)}
                    valueStyle={{ color: '#52c41a', fontSize: '1.5rem' }}
                  />
                  <Statistic
                    title="Total Impayé"
                    value={formatCurrency(dashboard.unpaid_invoices_amount || 0)}
                    valueStyle={{ color: '#faad14', fontSize: '1.5rem' }}
                  />
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card title="Bilan Financier (EUR)" style={{ height: '200px' }}>
                  <Statistic
                    title="Total Dépenses"
                    value={formatCurrency(dashboard.total_expenses_amount || 0)}
                    valueStyle={{ color: '#f5222d', fontSize: '1.5rem' }}
                  />
                  <Statistic
                    title="Bénéfice"
                    value={formatCurrency(dashboard.profit || 0)}
                    valueStyle={{ 
                      color: (dashboard.profit || 0) >= 0 ? '#52c41a' : '#f5222d', 
                      fontSize: '1.5rem',
                      fontWeight: 'bold'
                    }}
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab={<span><FileTextOutlined />Factures</span>} key="invoices">
            <div style={{ marginBottom: '16px' }}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => openModal()}
                size="large"
                style={{ borderRadius: '8px' }}
              >
                Nouvelle Facture
              </Button>
            </div>
            <Table
              columns={invoiceColumns}
              dataSource={invoices}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 10 }}
            />
          </TabPane>

          <TabPane tab={<span><CreditCardOutlined />Paiements</span>} key="payments">
            <div style={{ marginBottom: '16px' }}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => openModal()}
                size="large"
                style={{ borderRadius: '8px' }}
              >
                Nouveau Paiement
              </Button>
            </div>
            <Table
              columns={paymentColumns}
              dataSource={payments}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 10 }}
            />
          </TabPane>

          <TabPane tab={<span><EuroOutlined />Dépenses</span>} key="expenses">
            <div style={{ marginBottom: '16px' }}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => openModal()}
                size="large"
                style={{ borderRadius: '8px' }}
              >
                Nouvelle Dépense
              </Button>
            </div>
            <Table
              columns={expenseColumns}
              dataSource={expenses}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 10 }}
            />
          </TabPane>
        </Tabs>

        <Modal
          title={editingItem ? `Modifier ${activeTab === 'invoices' ? 'Facture' : activeTab === 'payments' ? 'Paiement' : 'Dépense'}` : 
                       `Nouvelle ${activeTab === 'invoices' ? 'Facture' : activeTab === 'payments' ? 'Paiement' : 'Dépense'}`}
          open={modalVisible}
          onCancel={() => {
            setModalVisible(false);
            setEditingItem(null);
            form.resetFields();
          }}
          footer={null}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={editingItem ? handleUpdate : handleCreate}
          >
            {renderForm().map((field, index) => (
              <Form.Item
                key={index}
                name={field.name}
                label={field.label}
                rules={field.rules}
              >
                {field.component}
              </Form.Item>
            ))}
            
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  {editingItem ? 'Mettre à jour' : 'Créer'}
                </Button>
                <Button onClick={() => {
                  setModalVisible(false);
                  setEditingItem(null);
                  form.resetFields();
                }}>
                  Annuler
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default AccountingPage; 