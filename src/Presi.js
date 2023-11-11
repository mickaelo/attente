import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: '#fff',
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1,
    },
    title: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 10,
    },
    content: {
        fontSize: 12,
        marginBottom: 10,
    },
});
const PrescriptionDocument = ({ patientName, medications }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.section}>
                <Text style={styles.title}>Ordonnance Médicale</Text>
                <Text style={styles.subtitle}>{`Patient: ${patientName}`}</Text>
                <View>
                    {medications.map((medication, index) => (
                        <Text key={index} style={styles.content}>{`${index + 1}. ${medication}`}</Text>
                    ))}
                </View>
                <Text style={styles.content}>
                    Veuillez suivre attentivement les instructions ci-dessus. En cas d'effets indésirables, veuillez consulter votre médecin.
                </Text>
            </View>
        </Page>
    </Document>
);
export default PrescriptionDocument;
