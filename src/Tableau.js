import React, { useState } from 'react';
import { Table, Space, Input, Popconfirm, Form } from 'antd';

const EditableCell = ({
    editing,
    dataIndex,
    title,
    record,
    index,
    children,
    ...restProps
}) => {

    const [measures, setMeasures] = useState(record?.[dataIndex] || ['', '', '']);
    const [measure1, setMeasure1] = useState(record?.[dataIndex]?.[0] || '');
    console.log(record?.[dataIndex])
    if (record?.[dataIndex] === undefined) {
        return <td {...restProps}>
            {children}
        </td >
    }
    if (title === "Mesure") {
        console.log(measures)

        const handleMeasureChange = (value, measureIndex) => {
            console.log(measureIndex)
            setMeasures((prevMeasures) => {
                const newMeasures = [...prevMeasures];
                newMeasures[measureIndex] = value;
                return newMeasures;
            });
        };

        return (
            <td {...restProps}>
                {editing ? (
                    <Form.List name={dataIndex}
                        style={{ margin: 0 }}
                        rules={[
                            {
                                required: true,
                                message: `Veuillez entrer les mesures de ${title}!`,
                            },
                        ]}>
                        {(fields, { add, remove }) => (
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                {fields.map((field, index) => (
                                    <Space style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                                        <Form.Item
                                            {...field}
                                            rules={[{ required: true, message: 'Entrez la première mesure' }]}
                                        >
                                            <Input
                                                placeholder="Mesure 1"
                                                onChange={(e) => handleMeasureChange(e.target.value, index)}
                                                value={measures[index]}
                                            />
                                        </Form.Item>
                                    </Space>
                                ))}
                            </div>)}
                    </Form.List>
                ) : (
                    `${measures[0]} ${measures[1]} ${measures[2]}`
                )}
            </td>
        );
    } else {
        const handleMeasureChange = (value, measureIndex) => {
            switch (measureIndex) {
                case 0:
                    setMeasure1(value);
                    break;
                default:
                    break;
            }
        };

        return (
            <td {...restProps}>
                {editing ? <Form.Item
                    name={dataIndex}
                    style={{ margin: 0 }}
                    rules={[
                        {
                            required: true,
                            message: `Veuillez entrer la première mesure de ${title}!`,
                        },
                    ]}
                >
                    <Input value={measure1} onChange={(value) => handleMeasureChange(value, 0)} />
                </Form.Item> : (
                    children
                )}
            </td>
        );
    }
};
const EditableTable = ({ setMeasurements }) => {
    const [form] = Form.useForm();
    const [data, setData] = useState([
        {
            key: '1',
            type: 'Autoréfraction',
            OD_measure: ['', '', ''],
            OD_AVL: '',
            OD_AVP: '',
            OD_ADD: '',
            OG_measure: ['', '', ''],
            OG_AVL: '',
            OG_AVP: '',
            OG_ADD: '',
        },
        {
            key: '2',
            type: 'Réfraction subjective',
            OD_measure: ['', '', ''],
            OD_AVL: '',
            OD_AVP: '',
            OD_ADD: '',
            OG_measure: ['', '', ''],
            OG_AVL: '',
            OG_AVP: '',
            OG_ADD: '',
        },
        {
            key: '3',
            type: 'SC',
            OD_AVL: '',
            OD_AVP: '',
            OG_AVL: '',
            OG_AVP: '',
        },
        {
            key: '4',
            type: 'PIO',
            OD_measure: ['', '', ''],
            OG_measure: ['', '', ''],
        },
        {
            key: '5',
            type: 'Pachymétrie',
            OD_measure: ['', '', ''],
            OG_measure: ['', '', ''],
        },
        // Ajoutez d'autres lignes selon vos besoins
    ]);
    console.log(data)
    const [editingKey, setEditingKey] = useState('');

    const isEditing = (record) => record.key === editingKey;

    const edit = (record) => {
        form.setFieldsValue({ ...record });
        setEditingKey(record.key);
    };

    const cancel = () => {
        setEditingKey('');
    };

    const save = async (key) => {
        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex((item) => key === item.key);

            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, { ...item, ...row });
                setData(newData);
                setEditingKey('');
            } else {
                newData.push(row);
                setData(newData);
                setEditingKey('');
            }
            setMeasurements(newData)
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const columns = [
        {
            title: '',
            dataIndex: 'type',
            width: '10%',
            editable: false,
        },
        {
            title: 'OD',
            children: [
                {
                    title: 'Mesure',
                    dataIndex: 'OD_measure',
                    width: '15%',
                    editable: true,
                },
                {
                    title: 'AVL',
                    dataIndex: 'OD_AVL',
                    width: '15%',
                    editable: true,
                },
                {
                    title: 'AVP',
                    dataIndex: 'OD_AVP',
                    width: '15%',
                    editable: true,
                },
                {
                    title: 'ADD',
                    dataIndex: 'OD_ADD',
                    width: '15%',
                    editable: true,
                },
            ],
        },
        {
            title: 'OG',
            children: [
                {
                    title: 'Mesure',
                    dataIndex: 'OG_measure',
                    width: '15%',
                    editable: true,
                },
                {
                    title: 'AVL',
                    dataIndex: 'OG_AVL',
                    width: '15%',
                    editable: true,
                },
                {
                    title: 'AVP',
                    dataIndex: 'OG_AVP',
                    width: '15%',
                    editable: true,
                },
                {
                    title: 'ADD',
                    dataIndex: 'OG_ADD',
                    width: '15%',
                    editable: true,
                },
            ],
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <a
                            href="javascript:;"
                            onClick={() => save(record.key)}
                            style={{ marginRight: 8 }}
                        >
                            Enregistrer
                        </a>
                        <Popconfirm title="Êtes-vous sûr de vouloir annuler?" onConfirm={cancel}>
                            <a>Annuler</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <a disabled={editingKey !== ''} onClick={() => edit(record)}>
                        Éditer
                    </a>
                );
            },
        },
    ];

    const mergedColumns = columns.map((col) => {
        if (!col.children) {
            return col;
        }

        return {
            ...col,
            children: col.children.map((child) => ({
                ...child,
                onCell: (record) => ({
                    record,
                    inputType: child.dataIndex === 'type' ? 'text' : 'number',
                    dataIndex: child.dataIndex,
                    title: child.title,
                    editing: isEditing(record),
                }),
            })),
            ellipsis: true, // Ajoute l'ellipse pour le texte long
            responsive: ['lg'], // Spécifie la réactivité, par exemple 'lg' pour large
            // ... (le reste des propriétés reste inchangé)
        };
    });

    return (
        <Form form={form} component={false}>
            <Table
                components={{
                    body: {
                        cell: EditableCell,
                    },
                }}
                bordered
                dataSource={data}
                columns={mergedColumns}
                rowClassName="editable-row"
                pagination={{
                    onChange: cancel,
                }}
            />
        </Form>
    );
};

export default EditableTable;
