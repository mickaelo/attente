import React from 'react';
import { List, Tag, Typography } from 'antd';

const { Text } = Typography;

const PreviousConsultationsSummary = ({ previousConsultations }) => {
    const sorted = previousConsultations.sort(function (a, b) {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return new Date(a.date) - new Date(b.date);
    })

    return (
        <div style={{ height: '20vh', width: '100%', overflow: 'auto', borderTop: '1px solid #e8e8e8' }}>
            <h4 style={{ marginBottom: '16px', padding: '8px 16px', color: "#7fc4fd", borderBottom: '1px solid #e8e8e8' }}>
                Précédentes consultations
            </h4>
            <List
                dataSource={[sorted[sorted.length - 1]]}
                renderItem={(consultation) => (
                    <List.Item style={{ padding: '8px 16px', borderBottom: '1px solid #e8e8e8' }}>
                        <List.Item.Meta
                            title={
                                <>
                                    <Text strong>{consultation?.date?.format('LL')}</Text>
                                    <Tag color="blue" style={{ marginLeft: '8px' }}>{`#${consultation?.id}`}</Tag>
                                </>
                            }
                            description={
                                <>
                                    < div > Réfraction : OD Mesures | {consultation?.measurements?.[1]?.['OD_measure'][0]} {consultation?.measurements?.[1]?.['OD_measure'][1]} {consultation?.measurements?.[1]?.['OD_measure'][2]} | AVL {consultation?.measurements?.[1]?.['OD_AVL']} | AVP {consultation?.measurements?.[1]?.['OD_AVP']} | ADD {consultation?.measurements?.[1]?.['OD_ADD']} | 
                                    OG Mesures | {consultation?.measurements?.[1]?.['OG_measure'][0]} {consultation?.measurements?.[1]?.['OG_measure'][1]} {consultation?.measurements?.[1]?.['OG_measure'][2]} | AVL {consultation?.measurements?.[1]?.['OG_AVL']} | AVP {consultation?.measurements?.[1]?.['OG_AVP']} | ADD {consultation?.measurements?.[1]?.['OG_ADD']}
                                     </div>
                                    < div > PIO : OG Mesures {consultation?.measurements?.[3]?.['OG_measure'][0]} {consultation?.measurements?.[3]?.['OG_measure'][1]} {consultation?.measurements?.[3]?.['OG_measure'][2]} | 
                                    OD Mesures {consultation?.measurements?.[3]?.['OD_measure'][0]} {consultation?.measurements?.[3]?.['OD_measure'][1]} {consultation?.measurements?.[3]?.['OD_measure'][2]}</div>
                                    <div>LAF : OD {consultation?.exams?.laf?.od} | OG {consultation?.exams?.laf?.og}</div>
                                    <div>FO : OD {consultation?.exams?.fo?.od} | OG {consultation?.exams?.fo?.og}</div>
                                    <div>Conclusion : {consultation?.exams?.conclusion}</div>
                                </>
                            }
                        />
                    </List.Item>
                )}
            />
        </div>
    );
};

export default PreviousConsultationsSummary;
