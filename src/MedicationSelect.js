// MedicationSelect.js

import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

const MedicationSelect = ({ medications, onDeselectMedication, onSelectMedication }) => {
    const handleSelectChange = (selectedValues, option) => {
        const selectedValue = selectedValues[selectedValues.length - 1];
        onSelectMedication(selectedValues);
    };

    const handleDeselect = (deselectedValue) => {
        onDeselectMedication(deselectedValue);
    };
    return (
        <Select
            mode="multiple"
            style={{ minWidth: 150 }}
            placeholder="Sélectionnez des médicaments"
            onChange={handleSelectChange}
            onDeselect={handleDeselect}
        >
            {medications.map((medication) => (
                <Select.Option key={medication.id} value={medication.id}>
                    {medication.name} ({medication.posology})
                </Select.Option>
            ))}
        </Select>
    );
};

export default MedicationSelect;
