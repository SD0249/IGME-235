// Sound components that communicate successful workings 
const correctSound = new Howl({
    src: ['media/sound/546081__stavsounds__correct3.wav'],
    autoplay: false,
    loop: false,
    volume: 0.35
});

const NASound = new Howl({
    src: ['media/sound/483598__raclure__wrong.mp3'],
    autoplay: false,
    loop: false,
    volume: 0.5
});

// Accessing the History Popup element
const historyPopupElement = document.getElementById('historyPopup');

// Converts angle degree value to radians
function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}

// Parses the given element(text or number) to number values
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
            return -Math.sin(radianVal);
        }

        if (elementId === 'e21_input') {
            return Math.sin(radianVal);
        }
    }

    // 2. If not, default to Pure Number value (For Scaling, Shearing, Translation)
    const num = parseFloat(value);
    return Number.isNaN(num) ? 0 : num;
}

// When apply button is clicked
function handleApply() {
    // 1. Collect element and IDs in order (Row Major)
    const elementIds = [
        'e11_input', 'e12_input', 'e13_input',
        'e21_input', 'e22_input', 'e23_input',
        'e31_input', 'e32_input', 'e33_input'
    ];

    let elements = elementIds.map(id => {
        const inputElement = document.getElementById(id);
        const value = inputElement.value;
        return parseElementValue(value, id);
    });

    // 2. Create the new Input Matrix
    elements[2] *= gridSpacing;         // Translation X, Y values need to be scaled by grid spacing
    elements[5] *= gridSpacing;
    const M_input = new Matrix3x3(elements);
    backwardStack.Push(M_input);

    // 3. Stack the Transformation
    currentTotalMatrix = M_input.multiplyMatrix(currentTotalMatrix);

    // 4. Update UI and visualization
    UpdateVisualization();
    UpdateDeterminantDisplay();
    UpdateMatrixTotalDisplay();
    ResetInputMatrix(elementIds);

    // 5. Update previous total matrix
    previousTotalMatrix = currentTotalMatrix.copy();

    // 6. Play feedback sound
    correctSound.play();
}

// Draws the current total transformation applied
function UpdateVisualization() {
    DrawVisualization();
};

// Displays the current scale factor (determinant)
function UpdateDeterminantDisplay() {
    const determinant = currentTotalMatrix.det();
    if(Number.isNaN(determinant)) return 0;

    // Check if the determinant element exists
    const detElement = document.getElementById('determinantValue');
    if(detElement) {
        detElement.textContent = determinant.toFixed(3);
    }
};

// Displays the current total matrix
function UpdateMatrixTotalDisplay() {
    document.getElementById('e11_total').value = currentTotalMatrix.e11;
    document.getElementById('e12_total').value = currentTotalMatrix.e12;
    document.getElementById('e13_total').value = currentTotalMatrix.e13 / gridSpacing;
    document.getElementById('e21_total').value = currentTotalMatrix.e21;
    document.getElementById('e22_total').value = currentTotalMatrix.e22;
    document.getElementById('e23_total').value = currentTotalMatrix.e23 / gridSpacing;
    document.getElementById('e31_total').value = currentTotalMatrix.e31;
    document.getElementById('e32_total').value = currentTotalMatrix.e32;
    document.getElementById('e33_total').value = currentTotalMatrix.e33;
};

// Resets the input field after user applies
function ResetInputMatrix(elementIds) {
    // Reset the input fields to the identity matrix values
    document.getElementById('e11_input').value = '1';
    document.getElementById('e22_input').value = '1';
    document.getElementById('e33_input').value = '1';

    elementIds.forEach(id => {
        if(id !== 'e11_input' && id !== 'e22_input' && id !== 'e33_input') {
            document.getElementById(id).value = '0';
        }
    });
};

// Resets all of the necessary components for the tool to work
function Reset() {
    // Reset the current and the previous total matrix
    currentTotalMatrix.identity();
    previousTotalMatrix.identity();

    // Empty forward and backward stack
    backwardStack.Empty();
    forwardStack.Empty();

    // Update determinant value and the total transformation matrix displayed
    UpdateDeterminantDisplay();
    UpdateMatrixTotalDisplay();
    UpdateVisualization();
}

// Clicking the undo button, 
// the shape is transformed back to the previous transformation.
function Undo() {
    // Check whether undo action can be performed
    if(backwardStack.isEmpty()) 
    {
        NASound.play();
        return;
    }

    // 1. Pop the latest matrix from backwardStack and push it to forwardStack
    forwardStack.Push(backwardStack.Pop());
    
    // 2. Recompute the current total matrix by multiplying all matrices in the backwardstack
    currentTotalMatrix.identity();

    // Create a temporary array of all matrices currently in the stack
    const remainingMatrices = backwardStack.toArray();

    // Multiply them in order
    for(let i = 0; i < remainingMatrices.length; i++) {
        currentTotalMatrix = remainingMatrices[i].multiplyMatrix(currentTotalMatrix);
    }

    // 3. Recompute previousTotalMatrix
    previousTotalMatrix.identity();

    for(let i = 0; i < remainingMatrices.length - 1; i++) {
        previousTotalMatrix = remainingMatrices[i].multiplyMatrix(previousTotalMatrix);
    }

    // 4. Update displays
    UpdateDeterminantDisplay();
    UpdateMatrixTotalDisplay();
    UpdateVisualization();
}

// Clicking the redo button,
// the shape is transformed back to where it was before clicking undo
function Redo() {
    // Check whether redo action can be performed
    if(forwardStack.isEmpty())
    {
        NASound.play();
        return;
    }    

    // 1. Pop the latest matrix from forwardstack and push it to backward stack
    backwardStack.Push(forwardStack.Pop());

    // 2. Recompute the current total matrix by multiplying all matrices in the backwardstack
    currentTotalMatrix.identity();

    // Create a temporary array of all matrices currently in the stack
    const remainingMatrices = backwardStack.toArray();

    // Multiply them in order
    for(let i = 0; i < remainingMatrices.length; i++) {
        currentTotalMatrix = remainingMatrices[i].multiplyMatrix(currentTotalMatrix);
    }

    // 3. Recompute previousTotalMatrix
    previousTotalMatrix.identity();

    for(let i = 0; i < remainingMatrices.length - 1; i++) {
        previousTotalMatrix = remainingMatrices[i].multiplyMatrix(previousTotalMatrix);
    }

    // Update Displays
    UpdateDeterminantDisplay();
    UpdateMatrixTotalDisplay();
    UpdateVisualization();
}

// Display the transformation matrices applied from each stacks when they are hovered
function displayHistory(stack, isRedoStack) {
    const matrices = stack.toArray().reverse();
    let html = isRedoStack ? '<h3>Redo History (Forward)</h3>' : '<h3>Undo History (Backward)</h3>'

    if(matrices.length === 0) {
        historyPopupElement.innerHTML = html + '<p>No Operation available</p>';
        historyPopupElement.classList.remove('hidden');
        return;
    }

    matrices.forEach((matrix, index) => {
        const translationX = (matrix.e13 / gridSpacing);
        const translationY = (matrix.e23 / gridSpacing);

        html += `<div class="historyItem">
                    <strong>${matrices.length - index}.</strong>
                    <div class="historyMatrix">
                        <span>${matrix.e11.toFixed(2)}</span><span>${matrix.e12.toFixed(2)}</span><span>${translationX}</span>
                        <span>${matrix.e21.toFixed(2)}</span><span>${matrix.e22.toFixed(2)}</span><span>${translationY}</span>
                        <span>${matrix.e31.toFixed(2)}</span><span>${matrix.e32.toFixed(2)}</span><span>${matrix.e33.toFixed(2)}</span>
                    </div>
                </div>`;
    });

    historyPopupElement.innerHTML = html;
    historyPopupElement.classList.remove('hidden');
}

// When cursor leaves from hovering, stop displaying all the matrices from the stack
function hideHistory() {
    historyPopupElement.classList.add('hidden');
}

// Attach handler to the Apply button
document.getElementById('applyButton').addEventListener('click', handleApply);

// Attach handler to reset button
document.getElementById('resetButton').addEventListener('click', Reset);

// Attach handler to Undo button
document.getElementById('undoButton').addEventListener('click', Undo);
document.getElementById('undoButton').addEventListener('mouseenter', () => displayHistory(backwardStack, false));
document.getElementById('undoButton').addEventListener('mouseleave', hideHistory);

// Attach handler to Redo button
document.getElementById('redoButton').addEventListener('click', Redo);
document.getElementById('redoButton').addEventListener('mouseenter', () => displayHistory(forwardStack, true));
document.getElementById('redoButton').addEventListener('mouseleave', hideHistory);



