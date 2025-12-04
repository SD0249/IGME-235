// Variables needed for Undo & Redo features
let previousTotalMatrix = new Matrix3x3();
let currentTotalMatrix = new Matrix3x3();

function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}

function parseElementValue(valueString, elementId) {
    const value = valueString.trim().toLowerCase();

    // 1. Get for degree notation (For Rotation)
    if (value.endsWith('d')) {
        const degrees = parseFloat(value.slice(0, -1));
        const radianVal = degreesToRadians(degrees);

        // Calculate the correct trigonometric value based on element position
        if (elementId === 'e11_input' || elementId === 'e22_input') {
            return Math.cos(radianVal);
        }

        if (elementId === 'e12_input') {
            return Math.sin(radianVal);
        }

        if (elementId === 'e21_input') {
            return -Math.sin(radianVal);
        }
    }

    // 2. If not, default to Pure Number value (For Scaling, Shearing, Translation)
    const num = parseFloat(value);
    return isNAN(num) ? 0 : num;
}

function handleApply() {
    // 1. Collect element and IDs in order (Row Major)


    // 2. Create the new Input Matrix


    // 3. Stack the Transformation


    // 4. Update UI and visualization

}

function UpdateVisualization() {

};

function UpdateDeterminantDisplay() {

};

function ResetInputMatrix() {

};

function Reset() {

}

// Attach handler to the Apply button


// Attach handler to reset button

