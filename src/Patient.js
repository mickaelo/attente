// EditPatientDetailPage.js
import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, message, Typography, Divider, Row, Col, Tabs, AutoComplete } from 'antd';
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


const autoCompleteOptions = ['oeil blanc, cornée claire, chambre antérieure corne et formée, cristallin clair'];
const autoCompleteOptions2 = ['pôle postérieur normal'];


const { Option } = Select;
const { Title } = Typography;
const { TabPane } = Tabs;

const EditPatientDetailPage = () => {
  const [medications, setMedications] = useState([])
  console.log(medications)
  const [selectedMedications, setSelectedMedications] = useState([]);

  const handleSelectMedication = (selectedValues) => {
    setSelectedMedications(selectedValues);

    // Générez le texte de l'ordonnance à partir des médicaments sélectionnés
    const selectedMedicationsInfo = selectedValues.map((medicationId) => {
      // Récupérez les détails du médicament en fonction de l'ID
      const medication = medications.find((m) => m.id === medicationId); // Implémentez cette fonction

      // Retournez le nom et la posologie du médicament
      return `${medication.name} - ${medication.posology}`;
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
      return `${medication.name} - ${medication.posology}`;
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
      conclusion: ''
    },
    description: {
      prescription: '1 monture + verres',
      courrier: "Au total, l'examen de ce jour ne retrouve pas d'anomalie. Le prochain contrôle sera dans un an sauf problème."
    },
    rating: '',
  });

  const [formPatient] = Form.useForm();
  const [formMeasurements] = Form.useForm();
  const [formPrescription] = Form.useForm();
  const [formExams] = Form.useForm();
  console.log(consultations)
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
      description: {
        ...patient.description,
        prescription: '1 monture + verres\n\n' + patient.description.prescription,
      },
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
    if (type === "courrier") {
      axios.post(`http://localhost:3001/generate-courrier`, newConsultation, {
        responseType: 'blob'
      })
        .then(res => {
          saveAs(res.data, 'report.pdf');
        })
    }
    else {
      axios.post(`http://localhost:3001/generate-prescription`, newConsultation, {
        responseType: 'blob'
      })
        .then(res => {
          saveAs(res.data, 'report.pdf');
        })
    }
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
                {/* <Form layout="vertical" form={formMeasurements}>
                  <Row>
                    <Col span={6}>
                      <Divider orientation="left">Autoréfractomètre</Divider>
                      <Row>OD
                        <Col span={4}> <Form.Item label="" >
                          <AutoComplete filterOption={filterOptions}

                            onChange={(value) => handleAutoCompleteChange('measurements', 'refraction', 'od1', value)}
                            value={patient.measurements.refraction.od1}
                          />
                        </Form.Item>
                        </Col>
                        <Col span={4}> <Form.Item label="" >
                          <AutoComplete filterOption={filterOptions}
                            onChange={(value) => handleAutoCompleteChange('measurements', 'refraction', 'od2', value)}
                            value={patient.measurements.refraction.od2}
                          />
                        </Form.Item></Col>
                        <Col span={4}> <Form.Item label="">
                          <AutoComplete filterOption={filterOptions}
                            onChange={(value) => handleAutoCompleteChange('measurements', 'refraction', 'od3', value)}
                            value={patient.measurements.refraction.od3}
                          />
                        </Form.Item></Col>

                      </Row>
                      <Row>OG
                        <Col span={4}> <Form.Item label="" >
                          <AutoComplete filterOption={filterOptions}

                            onChange={(value) => handleAutoCompleteChange('measurements', 'refraction', 'og1', value)}
                            value={patient.measurements.refraction.og1}
                          />
                        </Form.Item>
                        </Col>
                        <Col span={4}> <Form.Item label="" >
                          <AutoComplete filterOption={filterOptions}
                            onChange={(value) => handleAutoCompleteChange('measurements', 'refraction', 'og2', value)}
                            value={patient.measurements.refraction.og2}
                          />
                        </Form.Item></Col>
                        <Col span={4}> <Form.Item label="">
                          <AutoComplete filterOption={filterOptions}
                            onChange={(value) => handleAutoCompleteChange('measurements', 'refraction', 'og3', value)}
                            value={patient.measurements.refraction.og3}
                          />
                        </Form.Item></Col>

                      </Row>
                    </Col>
                    <Col span={6}>
                      <Row>
                        <Divider orientation="left"></Divider>
                        <Col span={4}>

                        </Col>
                      </Row>
                    </Col>
                    <Col span={6}>
                      <Row>
                        <Divider orientation="left">Acuité de loin</Divider>
                        <Col span={4}>
                          <Form.Item label="">
                            <AutoComplete filterOption={filterOptions}
                              onChange={(value) => handleAutoCompleteChange('measurements', 'acuitySc', 'od', value)}
                              value={patient.measurements.acuitySc.od}
                            />
                          </Form.Item>
                          <Form.Item label="">
                            <AutoComplete filterOption={filterOptions}
                              onChange={(value) => handleAutoCompleteChange('measurements', 'acuitySc', 'od', value)}
                              value={patient.measurements.acuitySc.od}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>
                    <Col span={6}>
                      <Row>
                        <Divider orientation="left">Acuité de près</Divider>
                        <Col span={4}>
                          <Form.Item label="">
                            <AutoComplete filterOption={filterOptions}
                              onChange={(value) => handleAutoCompleteChange('measurements', 'acuitySc', 'od', value)}
                              value={patient.measurements.acuitySc.od}
                            />
                          </Form.Item>
                          <Form.Item label="">
                            <AutoComplete filterOption={filterOptions}
                              onChange={(value) => handleAutoCompleteChange('measurements', 'acuitySc', 'od', value)}
                              value={patient.measurements.acuitySc.od}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={6}>
                      <Divider orientation="left">Réfraction subjective</Divider>
                      <Row>
                        OD
                        <Col span={4}> <Form.Item label="">
                          <AutoComplete filterOption={filterOptions}
                            onChange={(value) => handleAutoCompleteChange('measurements', 'refraction', 'od1', value)}
                            value={patient.measurements.refraction.od1}
                          />
                        </Form.Item></Col>
                        <Col span={4}> <Form.Item label="">
                          <AutoComplete filterOption={filterOptions}
                            onChange={(value) => handleAutoCompleteChange('measurements', 'refraction', 'od2', value)}
                            value={patient.measurements.refraction.od2}
                          />
                        </Form.Item></Col>
                        <Col span={4}> <Form.Item label="">
                          <AutoComplete filterOption={filterOptions}
                            onChange={(value) => handleAutoCompleteChange('measurements', 'refraction', 'od3', value)}
                            value={patient.measurements.refraction.od3}
                          />
                        </Form.Item></Col>

                      </Row>
                      <Row>OG
                        <Col span={4}>
                          <Form.Item label="" name="og1">
                            <AutoComplete filterOption={filterOptions}
                              onChange={(value) => handleAutoCompleteChange('measurements', 'refraction', 'og1', value)}
                              value={patient.measurements.refraction.og1}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          <Form.Item label="">
                            <AutoComplete filterOption={filterOptions}
                              onChange={(value) => handleAutoCompleteChange('measurements', 'refraction', 'og2', value)}
                              value={patient.measurements.refraction.og2}
                            />
                          </Form.Item></Col>
                        <Col span={4}>
                          <Form.Item label="">
                            <AutoComplete filterOption={filterOptions}
                              onChange={(value) => handleAutoCompleteChange('measurements', 'refraction', 'og3', value)}
                              value={patient.measurements.refraction.og3}
                            />
                          </Form.Item></Col>
                      </Row>
                    </Col>
                    <Col span={6}>
                      <Row>
                        <Divider orientation="left">Add</Divider>
                        <Col span={4}>
                          <Form.Item label="">
                            <AutoComplete filterOption={filterOptions}
                              onChange={(value) => handleAutoCompleteChange('measurements', 'add', 'od', value)}
                              value={patient.measurements.add.od}
                            />
                          </Form.Item>
                          <Form.Item label="">
                            <AutoComplete filterOption={filterOptions}
                              onChange={(value) => handleAutoCompleteChange('measurements', 'add', 'og', value)}
                              value={patient.measurements.add.og}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={6}>

                    </Col>
                  </Row>
                  <Row>
                    <Divider orientation="left">SC</Divider>
                    <Col span={6}>
                      <Row>OD
                        <Col span={4}> <Form.Item label="" >
                          <AutoComplete filterOption={filterOptions}
                            onChange={(value) => handleAutoCompleteChange('measurements', 'refraction', 'od1', value)}
                            value={patient.measurements.refraction.od1}
                          />
                        </Form.Item></Col>
                        <Col span={4}> <Form.Item label="">
                          <AutoComplete filterOption={filterOptions}
                            onChange={(value) => handleAutoCompleteChange('measurements', 'refraction', 'od2', value)}
                            value={patient.measurements.refraction.od2}
                          />
                        </Form.Item></Col>
                        <Col span={4}> <Form.Item label="">
                          <AutoComplete filterOption={filterOptions}
                            onChange={(value) => handleAutoCompleteChange('measurements', 'refraction', 'od3', value)}
                            value={patient.measurements.refraction.od3}
                          />
                        </Form.Item></Col>

                      </Row>
                    </Col>
                    <Col span={12}>
                      <Row>
                        <Col span={4}>
                          <Form.Item label="">
                            <AutoComplete filterOption={filterOptions}
                              onChange={(value) => handleAutoCompleteChange('measurements', 'acuitySc', 'od', value)}
                              value={patient.measurements.acuitySc.od}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={6}>
                      <Row>OG
                        <Col span={4}>
                          <Form.Item label="" name="og1">
                            <AutoComplete filterOption={filterOptions}
                              onChange={(value) => handleAutoCompleteChange('measurements', 'refraction', 'og1', value)}
                              value={patient.measurements.refraction.og1}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          <Form.Item label="">
                            <AutoComplete filterOption={filterOptions}
                              onChange={(value) => handleAutoCompleteChange('measurements', 'refraction', 'og2', value)}
                              value={patient.measurements.refraction.og2}
                            />
                          </Form.Item></Col>
                        <Col span={4}>
                          <Form.Item label="">
                            <AutoComplete filterOption={filterOptions}
                              onChange={(value) => handleAutoCompleteChange('measurements', 'refraction', 'og3', value)}
                              value={patient.measurements.refraction.og3}
                            />
                          </Form.Item></Col>
                      </Row>
                    </Col>
                    <Col span={12}>
                      <Row>
                        <Col span={4}>
                          <Form.Item label="">
                            <AutoComplete filterOption={filterOptions}
                              onChange={(value) => handleAutoCompleteChange('measurements', 'acuityAc', 'od', value)}
                              value={patient.measurements.acuityAc.od}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Divider orientation="left">PIO</Divider>

                  <Row>OD
                    <Col span={2}>
                      <Form.Item label="" >
                        <AutoComplete filterOption={filterOptions}
                          onChange={(value) => handleAutoCompleteChange('measurements', 'pio', 'od', value)}
                          value={patient.measurements.pio.od}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>OG
                    <Col span={2}>
                      <Form.Item label="">
                        <AutoComplete filterOption={filterOptions}
                          onChange={(value) => handleAutoCompleteChange('measurements', 'pio', 'og', value)}
                          value={patient.measurements.pio.og}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={2} offset={2}><Divider orientation="left">Pachymétrie</Divider>
                      <Form.Item label="">
                        <AutoComplete filterOption={filterOptions}
                          onChange={(value) => handleAutoCompleteChange('measurements', 'pachymetrie', 'od', value)}
                          value={patient.measurements.pachymetrie.od}
                        />
                      </Form.Item>
                      <Form.Item label="">
                        <AutoComplete filterOption={filterOptions}
                          onChange={(value) => handleAutoCompleteChange('measurements', 'pachymetrie', 'og', value)}
                          value={patient.measurements.pachymetrie.og}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form> */}
              </TabPane>
              <TabPane tab="Examen" key="3">
                <Form layout="vertical" form={formExams}>
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
                  <Form.Item label="Conclusion">
                    <AutoComplete filterOption={filterOptions}
                      onChange={(value) => handleMeasurementChange('exams', 'conclusion', value)}
                      value={patient.exams.conclusion}
                    />
                  </Form.Item>
                </Form>
              </TabPane>
              <TabPane tab="Ordonnance et courrier" key="4">
                <Form.Item  layout="vertical" label="Médicaments">
                  <MedicationSelect medications={medications.sort((a, b) => a.name.localeCompare(b.name))}
                    onDeselectMedication={handleDeselectMedication} // Nouvelle fonction pour la désélection
                    onSelectMedication={handleSelectMedication} />
                </Form.Item>
                <Form layout="vertical" form={formPrescription}>
                  <Form.Item label="Ordonnance">
                    <Input.TextArea
                      value={patient.description.prescription}
                      onChange={(e) => handleMeasurementChange('description', 'prescription', e.target.value)}
                      autoSize={{ minRows: 3, maxRows: 6 }}
                    />
                  </Form.Item>
                  <Form.Item label="Courrier">
                    <Input.TextArea
                      value={patient.description.courrier}
                      onChange={(e) => handleMeasurementChange('description', 'courrier', e.target.value)}
                      autoSize={{ minRows: 3, maxRows: 6 }}
                    />
                  </Form.Item>
                </Form>
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
            </Tabs>
            <Divider />
            <Form.Item>
              <Button type="primary" onClick={() => handleSave("ordonnance")}>
                Ordonnance
              </Button>
              <Button type="primary" onClick={() => handleSave("courrier")}>
                Courrier
              </Button>
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
