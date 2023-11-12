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
import Ordonnances from './Ordonnances';
import Courriers from './Courriers';


const autoCompleteOptions = ['oeil blanc, cornée claire, chambre antérieure corne et formée, cristallin clair'];
const autoCompleteOptions2 = ['pôle postérieur normal'];


const { Option } = Select;
const { Title } = Typography;
const { TabPane } = Tabs;

const EditPatientDetailPage = () => {
  const [medications, setMedications] = useState([])
  const [selectedMedications, setSelectedMedications] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [letters, setLetters] = useState([]);
  const [prescriptionModalVisible, setPrescriptionModalVisible] = useState(false);
  const [letterModalVisible, setLetterModalVisible] = useState(false);

  const [form] = Form.useForm();

  const showPrescriptionModal = () => {
    setPrescriptionModalVisible(true);
  };

  const handlePrescriptionModalOk = () => {
    form.validateFields().then((values) => {
      const newPrescription = {
        medication: values.medication,
        dosage: values.dosage,
        duration: values.duration,
      };
      setPrescriptions((prevPrescriptions) => [...prevPrescriptions, newPrescription]);
      setPrescriptionModalVisible(false);
      form.resetFields();
    });
  };

  const handlePrescriptionModalCancel = () => {
    setPrescriptionModalVisible(false);
  };

  const showLetterModal = () => {
    setLetterModalVisible(true);
  };

  const handleLetterModalOk = () => {
    form.validateFields().then((values) => {
      const newLetter = {
        subject: values.subject,
        content: values.content,
      };
      setLetters((prevLetters) => [...prevLetters, newLetter]);
      setLetterModalVisible(false);
      form.resetFields();
    });
  };

  const handleLetterModalCancel = () => {
    setLetterModalVisible(false);
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
    handleMeasurementChange('description', 'prescription', selectedMedicationsInfo.join('\n'))
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

    handleMeasurementChange('description', 'prescription', updatedMedicationsInfo.join('\n'))
  };

  useEffect(() => {
    axios.get(`http://localhost:3002/medications`)
      .then(res => {
        setMedications(res.data)
      })
  }, [])
  const [consultations, setConsultations] = useState(generateRandomConsultations(50))
  const [patient, setPatient] = useState({
    id: 1,
    name: 'John Doe',
    status: 'En attente',
    diagnosis: 'Aucun problème de santé connu.',
    allergies: '',
    prescription: 'Traitement 1',
    antecedents: '',
    consultations: [],
    diseases: [],
    measurements: {
      refraction: { od1: '', od2: '', od3: '', og1: '', og2: '', og3: '' },
      add: { od: '', og: '' },
      acuitySc: { od: '', og: '' },
      acuityAc: { od: '', og: '' },
      pio: { od: '', og: '' },
      pachymetrie: { od: '', og: '' },
    },
    exams: {
      laf: { od: '', og: '' },
      fo: { od: '', og: '' },
      external: { od: '', og: '' },
      conclusion: '',
      motif: ""
    },
    description: {
      prescription: '',
      courrier: "Au total, l'examen de ce jour ne retrouve pas d'anomalie. Le prochain contrôle sera dans un an sauf problème."
    },
    rating: '',
  });

  const [formPatient] = Form.useForm();
  const [formMeasurements] = Form.useForm();
  const [formPrescription] = Form.useForm();
  const [formExams] = Form.useForm();

  const generateCourrier = async (e) => {
    const examsValues = formExams.getFieldsValue();
    const newConsultation = {
      ...examsValues,
      ...patient,
      date: moment(),
    };
    await axios.post(`http://localhost:3001/generate-courrier`, {
      ...newConsultation,
      description: {
        courrier: e
      }
    }, {
      responseType: 'blob'
    }).then(res => {
      saveAs(res.data, `courrier.pdf`);
    })
  }
  const generatePrescription = async (e) => {
    const examsValues = formExams.getFieldsValue();
    const newConsultation = {
      ...examsValues,
      ...patient,
      date: moment(),
    };
    await axios.post(`http://localhost:3001/generate-prescription`, {
      ...newConsultation,
      description: {
        prescription: e
      }
    }, {
      responseType: 'blob'
    }).then(res => {
      saveAs(res.data, `ordonnance.pdf`);
    })
  }
  const handleSave = (type) => {
    // Récupérer les valeurs de tous les formulaires
    const patientValues = formPatient.getFieldsValue();
    const prescriptionValues = formPrescription.getFieldsValue()
    const measurementsValues = formMeasurements.getFieldsValue();
    const examsValues = formExams.getFieldsValue();
    // Créer une nouvelle consultation avec les informations du patient et des formulaires
    const newConsultation = {
      ...examsValues,
      ...patient,
      date: moment(),
      // measurements: {
      //   refraction: measurementsValues.refraction,
      //   acuitySC: measurementsValues.acuitySC,
      //   acuityAC: measurementsValues.acuityAC,
      //   pio: measurementsValues.pio,
      // },
      // exams: {
      //   laf: examsValues.laf,
      //   external: examsValues.external,
      // },
      // Ajoutez d'autres champs selon vos besoins
    };
    setConsultations([...consultations, newConsultation])
    axios.post(`http://localhost:3002/consultations`, { consultation: newConsultation })
    // Vous pouvez ensuite stocker cette nouvelle consultation dans votre base de données ou votre état local
    console.log('Nouvelle consultation:', newConsultation);
    // if (type === "courrier") {
    //   axios.post(`http://localhost:3001/generate-courrier`, newConsultation, {
    //     responseType: 'blob'
    //   })
    //     .then(res => {
    //       saveAs(res.data, 'report.pdf');
    //     })
    // }
    // else {
    //   newConsultation.description?.prescription?.map((p, i) => axios.post(`http://localhost:3001/generate-prescription`, {
    //     ...newConsultation,
    //     description: {
    //       prescription: p
    //     }
    //   }, {
    //     responseType: 'blob'
    //   })
    //     .then(res => {
    //       saveAs(res.data, `report${i}.pdf`);
    //     }))

    // }
  };
  const handleInputChange = (name, value) => {
    setPatient((prevPatient) => ({
      ...prevPatient,
      [name]: value,
    }));
  };

  const generateReport = async (type) => {
    const reportData = JSON.stringify(patient, null, 2);
    console.log(reportData)
    if (type === 'pdf') {
      // Logique pour générer le PDF avec react-pdf
      // Exemple basique
      const pdfBlob = new Blob([reportData], { type: 'application/pdf' });
      saveAs(pdfBlob, 'report.pdf');
    } else if (type === 'word') {
      // Logique pour générer le document Word avec docx
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'Rapport des Informations',
                    bold: true,
                    fontSize: 24,
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: reportData,
                    fontSize: 12,
                  }),
                ],
              }),
            ],
          },
        ],
      });

      const docxBlob = await Packer.toBuffer(doc);
      saveAs(new Blob([docxBlob]), 'report.docx');
    }
  };

  const handleAutoCompleteChange = (type, category, eye, value) => {
    console.log(patient[category])
    setPatient((prevPatient) => ({
      ...patient,
      [type]: {
        ...prevPatient[type],
        [category]: {
          ...prevPatient[type][category],
          [eye]: value,
        },
      },
    }));
    console.log(patient)
  };

  const handleMeasurementChange = (type, category, value) => {
    setPatient((prevPatient) => ({
      ...prevPatient,
      [type]: {
        ...prevPatient[type],
        [category]: value,
      },
    }));
    console.log(patient)
  };

  const handleExamChange = (category, eye, value) => {
    setPatient((prevPatient) => ({
      ...prevPatient,
      exams: {
        ...prevPatient.exams,
        [category]: {
          ...prevPatient.exams[category],
          [eye]: value,
        },
      },
    }));
  };

  const filterOptions = (inputValue, option) => {
    const lowerCaseInput = inputValue.toLowerCase();
    const lowerCaseOption = option.value.toLowerCase();
    return inputValue && lowerCaseOption.includes(lowerCaseInput);
  };

  const handleSubmit = () => {
    // Ici, tu devrais envoyer les modifications du patient à ton backend
    // Par exemple, avec une requête HTTP vers une API REST
    console.log('Patient modifié :', patient);
    // Exemple d'affichage d'un message de confirmation
    message.success('Modifications enregistrées avec succès.');

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
    <div style={backgroundStyle}>
      <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
        <Col span={20}>
          <div style={formStyle}>
            <Title level={2} style={{ color: '#1890ff' }}>
              Suivi de {patient.name}
            </Title>
            <PreviousConsultationsSummary previousConsultations={consultations} />
            <Tabs defaultActiveKey="1">
              <TabPane tab="Informations générales" key="1">
                <Form layout="vertical" form={formPatient}>
                  {/* <Form.Item label="Nom" name="name">
                    <Input
                      value={patient.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                  </Form.Item> */}
                  <Form.Item label="Traitements" name="prescription">
                    <Select mode='multiple'><Select.Option
                      option={['Traitement1']}
                      value={patient.prescription}
                      onChange={(e) => handleInputChange('prescription', e.target.value)}
                      autoSize={{ minRows: 3, maxRows: 6 }}
                    >Test</Select.Option></Select>
                  </Form.Item>
                  <Form.Item label="Antécédents" name="antecedents">
                    <Input.TextArea
                      value={patient.antecedents}
                      onChange={(e) => handleInputChange('antecedents', e.target.value)}
                      autoSize={{ minRows: 3, maxRows: 6 }}
                    />
                  </Form.Item>
                  <Form.Item label="Allergies" name="allergies">
                    <Input.TextArea
                      value={patient.allergies}
                      onChange={(e) => handleInputChange('allergies', e.target.value)}
                      autoSize={{ minRows: 3, maxRows: 6 }}
                    />
                  </Form.Item>
                </Form>
              </TabPane>
              <TabPane tab="Mesures" key="2">
                <EditableTable setMeasurements={(data) => setPatient({ ...patient, measurements: data })} />
              </TabPane>
              <TabPane tab="Examen" key="3">
                <Row>
                  <Col>
                    <Form layout="vertical" form={formExams}>
                      <Divider orientation="left">Motif de consultation</Divider>
                      <Form.Item label="">
                        <AutoComplete filterOption={filterOptions}
                          onChange={(value) => handleMeasurementChange('exams', 'motif', value)}
                          value={patient.exams.motif}
                        />
                      </Form.Item>
                      <Divider orientation="left">LAF</Divider>
                      <Form.Item label="LAF OD">
                        <AutoComplete filterOption={filterOptions}
                          options={autoCompleteOptions.map((option) => ({ value: option }))}
                          onChange={(value) => handleAutoCompleteChange('exams', 'laf', 'od', value)}
                          value={patient.exams.laf.od}
                        />
                      </Form.Item>
                      <Form.Item label="LAF OG">
                        <AutoComplete filterOption={filterOptions}
                          options={autoCompleteOptions.map((option) => ({ value: option }))}
                          onChange={(value) => handleAutoCompleteChange('exams', 'laf', 'og', value)}
                          value={patient.exams.laf.og}
                        />
                      </Form.Item>
                      <Divider orientation="left">FO</Divider>
                      <Form.Item label="FO OD">
                        <AutoComplete filterOption={filterOptions}
                          options={autoCompleteOptions2.map((option) => ({ value: option }))}
                          onChange={(value) => handleAutoCompleteChange('exams', 'fo', 'od', value)}
                          value={patient.exams.fo.od}
                        />
                      </Form.Item>
                      <Form.Item label="FO OG">
                        <AutoComplete filterOption={filterOptions}
                          options={autoCompleteOptions2.map((option) => ({ value: option }))}
                          onChange={(value) => handleAutoCompleteChange('exams', 'fo', 'og', value)}
                          value={patient.exams.fo.og}
                        />
                      </Form.Item>
                      <Divider orientation="left">Externe</Divider>
                      <Form.Item label="Externe OD">
                        <AutoComplete filterOption={filterOptions}
                          onChange={(value) => handleAutoCompleteChange('exams', 'external', 'od', value)}
                          value={patient.exams.external.od}
                        />
                      </Form.Item>
                      <Form.Item label="Externe OG">
                        <AutoComplete filterOption={filterOptions}
                          onChange={(value) => handleAutoCompleteChange('exams', 'external', 'og', value)}
                          value={patient.exams.external.og}
                        />
                      </Form.Item>
                      <Divider orientation="left">Conclusion</Divider>
                      <Form.Item label="">
                        <AutoComplete filterOption={filterOptions}
                          onChange={(value) => handleMeasurementChange('exams', 'conclusion', value)}
                          value={patient.exams.conclusion}
                        />
                      </Form.Item>
                    </Form>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab="Ordonnance et courrier" key="4">
                {/* <Form.Item layout="vertical" label="Médicaments">
                  <MedicationSelect medications={medications.sort((a, b) => a.name.localeCompare(b.name))}
                    onDeselectMedication={handleDeselectMedication} // Nouvelle fonction pour la désélection
                    onSelectMedication={handleSelectMedication} />
                </Form.Item> */}
                <Courriers generateCourrier={generateCourrier} setCourriers={(e) => handleMeasurementChange('description', 'courrier', e)} />
                <Ordonnances generatePrescription={generatePrescription} setOrdonnances={(e) => handleMeasurementChange('description', 'prescription', e)} />
              </TabPane>
              <TabPane tab="Cotation" key="5">
                <Form layout="vertical">
                  <Divider orientation="left">Cotation</Divider>
                  <Form.Item label="Cotation">
                    <Input
                      value={patient.rating}
                      onChange={(e) => handleInputChange('rating', e.target.value)}
                    />
                  </Form.Item>
                </Form>
              </TabPane>
              <TabPane tab="Imagerie" key="6">
                <Form layout="vertical">
                  <Divider orientation="left">Imagerie</Divider>
                  <Form.Item label="Imagerie">
                    <Input
                      value={patient.rating}
                      onChange={(e) => handleInputChange('rating', e.target.value)}
                    />
                  </Form.Item>
                </Form>
              </TabPane>
            </Tabs>
            <Divider />
            <Form.Item>
              <Button type="primary" onClick={() => handleSave("ordonnance")}>
                Enregistrer consultation
              </Button>
              {/* <Button style={{ marginLeft: 20 }} type="primary" onClick={() => handleSave("courrier")}>
                Générer courrier
              </Button> */}
              {/* <Button type="default" onClick={() => axios.get(`http://localhost:3001/generate-prescription?patientName=toto&medication=toto&dosage=toto`, {
                responseType: 'blob'
              })
                .then(res => {
                  saveAs(res.data, 'report.pdf');
                })} style={{ marginLeft: '10px' }}>
                Générer PDF
              </Button>
              <Button type="default" onClick={() => generateReport('word')} style={{ marginLeft: '10px' }}>
                Générer Word
              </Button> */}
            </Form.Item>
          </div>
        </Col>
      </Row>

    </div>
  );
};

export default EditPatientDetailPage;
