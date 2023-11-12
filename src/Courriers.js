// EditPatientDetailPage.js
import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, message, Typography, Divider, Row, Col, Tabs, AutoComplete, Modal } from 'antd';
import backgroundImg from './background.jpeg'; // Remplace avec le chemin de ton image de fond
import { useReactToPrint } from 'react-to-print';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { PDFViewer } from 'react-pdf';
import axios from 'axios';
import generateRandomConsultations from './function';
import PreviousConsultationsSummary from './PreviousConsultationsSummary ';
import moment from 'moment';
import EditableTable from './Tableau';
import MedicationSelect from './MedicationSelect';
import { DownloadDoneOutlined, DownloadingTwoTone } from '@mui/icons-material';
import TextArea from 'antd/es/input/TextArea';


const autoCompleteOptions = ['oeil blanc, cornée claire, chambre antérieure corne et formée, cristallin clair'];
const autoCompleteOptions2 = ['pôle postérieur normal'];


const { Option } = Select;
const { Title } = Typography;
const { TabPane } = Tabs;

const Courriers = ({ setCourriers, generateCourrier }) => {
    const [courriers, setMultipleCourriers] = useState([]);
    const [courrierModalVisible, setCourrierModalVisible] = useState(false);

    const [form] = Form.useForm();

    const showCourrierModal = () => {
        setCourrierModalVisible(true);
    };

    const handleCourrierModalOk = () => {
        form.validateFields().then((values) => {
            setMultipleCourriers((prevCourriers) => [...prevCourriers, values.courrier]);
            setCourrierModalVisible(false);
            form.resetFields();
        });
    };

    const handleCourrierModalCancel = () => {
        setCourrierModalVisible(false);
    };

    return (
        <div>
            <Form layout="vertical" form={form}>
                <Button type="primary" onClick={showCourrierModal}>
                    Ajouter une courrier
                </Button>
                <ul>
                    {courriers.map((courrier, index) => (
                        <div>
                            <DownloadingTwoTone style={{ cursor: 'pointer' }} color='info' onClick={async () => await generateCourrier(courrier)} />
                            <strong>Courrier:</strong> {courrier}

                        </div>
                    ))}
                </ul>
            </Form>
            <Modal
                title="Ajouter une courrier"
                visible={courrierModalVisible}
                onOk={handleCourrierModalOk}
                onCancel={handleCourrierModalCancel}
            >
                <Form form={form} layout="vertical">
                    <Form.Item label="Courrier" name={"courrier"}>
                        <Input.TextArea
                            autoSize={{ minRows: 3, maxRows: 6 }}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Courriers;
