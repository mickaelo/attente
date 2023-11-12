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
import { DownloadDoneOutlined, DownloadingTwoTone, PlusOneOutlined, PlusOneRounded } from '@mui/icons-material';


const autoCompleteOptions = ['oeil blanc, cornée claire, chambre antérieure corne et formée, cristallin clair'];
const autoCompleteOptions2 = ['pôle postérieur normal'];


const { Option } = Select;
const { Title } = Typography;
const { TabPane } = Tabs;

const Ordonnances = ({ setOrdonnances, generatePrescription }) => {
    const [medications, setMedications] = useState([])
    const [selectedMedications, setSelectedMedications] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [prescriptionModalVisible, setPrescriptionModalVisible] = useState(false);

    const [form] = Form.useForm();

    const showPrescriptionModal = () => {
        setPrescriptionModalVisible(true);
    };
    const handleSelectMedication = (selectedValues) => {
        setSelectedMedications(selectedValues);

        // Générez le texte de l'ordonnance à partir des médicaments sélectionnés
        const selectedMedicationsInfo = selectedValues.map((medicationId) => {
            // Récupérez les détails du médicament en fonction de l'ID
            const medication = medications.find((m) => m.id === medicationId); // Implémentez cette fonction

            // Retournez le nom et la posologie du médicament
            return `${medication.name}${medication.posology ? " - " + medication.posology : ""}`;
        });

        // Mettez à jour le champ d'ordonnance
        // handleMeasurementChange('description', 'prescription', selectedMedicationsInfo.join('\n'))
    };
    // const handleMeasurementChange = (type, category, value) => {
    //     setPatient((prevPatient) => ({
    //         ...prevPatient,
    //         [type]: {
    //             ...prevPatient[type],
    //             [category]: value,
    //         },
    //     }));
    //     console.log(patient)
    // };
    const handlePrescriptionModalOk = () => {
        form.validateFields().then((values) => {
            // Générez le texte de l'ordonnance à partir des médicaments sélectionnés
            const selectedMedicationsInfo = selectedMedications.map((medicationId) => {
                // Récupérez les détails du médicament en fonction de l'ID
                const medication = medications.find((m) => m.id === medicationId); // Implémentez cette fonction

                // Retournez le nom et la posologie du médicament
                return `${medication.name}${medication.posology ? " - " + medication.posology : ""}`;
            });
            const newPrescription = {
                medication: selectedMedicationsInfo.join('\n'),
            };
            setPrescriptions((prevPrescriptions) => [...prevPrescriptions, newPrescription]);
            setOrdonnances(prescriptions)
            setPrescriptionModalVisible(false);
            form.resetFields();
        });
    };

    const handlePrescriptionModalCancel = () => {
        setPrescriptionModalVisible(false);
    };

    const handleDeselectMedication = (deselectedValue) => {
        const updatedMedications = selectedMedications.filter(
            (medicationId) => medicationId !== deselectedValue
        );

        setSelectedMedications(updatedMedications);

        const updatedMedicationsInfo = updatedMedications.map((medicationId) => {
            const medication = medications.find((m) => m.id === medicationId); // Implémentez cette fonction
            return `${medication.name}${medication.posology ? " - " + medication.posology : ""}`;
        });

        // handleMeasurementChange('description', 'prescription', updatedMedicationsInfo.join('\n'))
    };

    useEffect(() => {
        axios.get(`http://localhost:3002/medications`)
            .then(res => {
                setMedications(res.data)
            })
    }, [])

    const [formPrescription] = Form.useForm();


    const filterOptions = (inputValue, option) => {
        const lowerCaseInput = inputValue.toLowerCase();
        const lowerCaseOption = option.value.toLowerCase();
        return inputValue && lowerCaseOption.includes(lowerCaseInput);
    };

    const backgroundStyle = {
        backgroundImage: `url(${backgroundImg})`,
        backgroundSize: 'cover',
        minHeight: '100vh',
        padding: '20px',
        color: 'white',
    };

    const formStyle = {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: '20px',
        borderRadius: '10px',
    };

    return (
        <div>
            <Form layout="vertical" form={form}>
                <Button type="primary" onClick={showPrescriptionModal}>
                    Ajouter une ordonnance
                </Button>
                <ul>
                    {prescriptions.map((prescription, index) => (
                        <div>
                            <DownloadingTwoTone style={{ cursor: 'pointer' }} color='info' onClick={async () => await generatePrescription(prescription.medication)} />
                            <strong>Ordonnance:</strong> {prescription.medication}

                        </div>
                    ))}
                </ul>
            </Form>
            <Modal
                title="Ajouter une ordonnance"
                visible={prescriptionModalVisible}
                onOk={handlePrescriptionModalOk}
                onCancel={handlePrescriptionModalCancel}
            >
                <Form form={form} layout="vertical">
                    <MedicationSelect medications={medications.sort((a, b) => a.name.localeCompare(b.name))}
                        onDeselectMedication={handleDeselectMedication} // Nouvelle fonction pour la désélection
                        onSelectMedication={handleSelectMedication} />
                </Form>
            </Modal>
        </div>
    );
};

export default Ordonnances;
