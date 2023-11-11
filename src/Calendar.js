import React, { useState } from 'react';
import { Calendar, Modal, Form, Input, Select, Button, TimePicker } from 'antd';
import moment from 'moment';
import dayjs from 'dayjs';
import 'dayjs/locale/fr'; // Importe la locale française si nécessaire

// Utilise dayjs dans ton code
const formattedDate = dayjs().format('YYYY-MM-DD');
const { Option } = Select;

const AppointmentCalendar = () => {
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    const handleDateCellClick = (value) => {
        form.resetFields();
        setSelectedDate(value);
        setSelectedAppointment(null);
        setVisible(true);
    };

    const handleEdit = (appointment) => {
        form.setFieldsValue(appointment);
        setSelectedAppointment(appointment);
        setSelectedDate(appointment.date);
        setVisible(true);
    };

    const handleCancel = () => {
        setVisible(false);
    };

    const handleOk = () => {
        form
            .validateFields()
            .then((values) => {
                const newAppointment = { date: selectedDate, ...values };

                if (selectedAppointment) {
                    // Si une consultation est sélectionnée, mise à jour
                    const updatedAppointments = appointments.map((appointment) =>
                        appointment === selectedAppointment ? newAppointment : appointment
                    );
                    setAppointments(updatedAppointments);
                } else {
                    // Sinon, ajout d'une nouvelle consultation
                    setAppointments([...appointments, newAppointment]);
                }

                form.resetFields();
                setVisible(false);
                setSelectedAppointment(null);
            })
            .catch((info) => {
                console.log('Validation failed:', info);
            });
    };
    const dateCellRender = (value) => {
        const formattedDate = value.format('YYYY-MM-DD');
        const dailyAppointments = appointments.filter(
          (appointment) => appointment.date.format('YYYY-MM-DD') === formattedDate
        );
      
        return (
          <div>
            <div style={{ marginBottom: '8px' }}>{value.date()}</div>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {dailyAppointments.map((appointment) => (
                <li key={appointment.id}>
                  <span>{appointment.reason}</span>
                  <br />
                  <span>
                    {dayjs(appointment.startTime).format('HH:mm')} - {dayjs(appointment.endTime).format('HH:mm')}
                  </span>
                  <br />
                  <Button onClick={(e) => {
                    e.stopPropagation()
                    handleEdit(appointment)}}>Éditer</Button>
                </li>
              ))}
            </ul>
          </div>
        );
      };

    return (
        <div>
            <Calendar mode='month' cellRender={dateCellRender} onSelect={(value) => handleDateCellClick(value)} />

            <Modal
                title={`Prendre rendez-vous le ${selectedDate ? moment(selectedDate).format('LL') : ''}`}
                visible={visible}
                onCancel={handleCancel}
                onOk={handleOk}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Raison de la consultation"
                        name="reason"
                        rules={[{ required: true, message: 'Veuillez saisir la raison de la consultation' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Médecin"
                        name="doctor"
                        rules={[{ required: true, message: 'Veuillez sélectionner le médecin' }]}
                    >
                        <Select>
                            <Option value="DrSmith">Dr. Smith</Option>
                            <Option value="DrJones">Dr. Jones</Option>
                            {/* Ajoutez d'autres médecins au besoin */}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Heure de début"
                        name="startTime"
                        rules={[{ required: true, message: 'Veuillez sélectionner l\'heure de début' }]}
                    >
                        <TimePicker format="HH:mm" />
                    </Form.Item>
                    <Form.Item
                        label="Heure de fin"
                        name="endTime"
                        rules={[{ required: true, message: 'Veuillez sélectionner l\'heure de fin' }]}
                    >
                        <TimePicker format="HH:mm" />
                    </Form.Item>
                    <Form.Item
                        label="Remarques"
                        name="notes"
                    >
                        <Input.TextArea />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default AppointmentCalendar;
