
//import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js"
// import { getStorage  } from 'https://www.gstatic.com/firebasejs/10.7.2/firebase-storage.js';


let stepsData;
let stateData;
// note: Insert

// Get Blog ID and Step ID

const urlParams = new URLSearchParams(window.location.search);
const blogId = urlParams.get('blog_id');
const stepId = urlParams.get('step_id');
console.log(blogId);
console.log(stepId);

if (stepId == null) {
    const parts = blogId.split('/');

    const stepNumber = parts[parts.length - 1];
    const newblogId = parts[0];
    console.log(stepNumber); // Output: 8

    getInsertStepData(stepNumber, newblogId);
}

function getInsertStepData(stepNumber, blogId) {
    fetch(`http://localhost:3000/guide/blog/edit/steps/insert/api/${blogId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            return response.json();
        })
        .then(data => {
            // Assuming renderStepsThumbListInsert is a function to render data

            console.log(data.steps);
            renderStepsThumbListInsert(data.steps, stepNumber);
        })
        .catch(error => {
            // Handle any errors that occur during the fetch operation or parsing of JSON
            console.error('Error:', error);
            // You can also notify the user about the error
            alert('An error occurred while fetching data. Please try again later.');
        });
}

function renderStepsThumbListInsert(steps, stepNumber) {
    let stepsHtml = '';
    var incrementedStepNumber;
    
    // Insert the new step with an incremented step number
    steps.splice(stepNumber - 1, 0, { step_number: parseInt(stepNumber) + 1 });
    
    // Loop through the steps to update step numbers and build HTML
    steps.forEach((step, index) => {
        const currentStepNumber = step.step_number[0];
        const nextStepNumber = index < steps.length - 1 ? steps[index + 1].step_number[0] : currentStepNumber;
    
        // Increment step numbers for steps after the inserted step
        if (currentStepNumber > stepNumber) {
            step.step_number[0] = currentStepNumber + 1;
        }
    
        // Build HTML for each step
        stepsHtml += `
            <div class="draggable-item" data-id="${currentStepNumber}">
                <img src="${step.step_imgs[0].img_url}" alt="" width=40 onclick="newStepId('${step.stepId}')"/>
            </div>
        `;
    
        // Add HTML for the new step if this is the original stepNumber or the next step
        if (currentStepNumber === stepNumber || nextStepNumber === stepNumber) {
            stepsHtml += `
                <div class="draggable-item" data-id="${parseInt(stepNumber) + 1}">
                    <img src="https://picsum.photos/seed/picsum/200/300" alt="" width=40 onclick=""/>
                </div>
            `;
        }
    });
    
    // Update the HTML content
    document.querySelector('#draggable-list').innerHTML = stepsHtml;
    
}

function getStepData() {
    fetch(`http://localhost:3000/guide/blog/edit/steps/api/${blogId}/${stepId}`)
        //fetch('../../data/step_edit.json')
        .then(response => {
            console.log(response);
            return response.json();
        })
        .then(data => {
            console.log(data);
            stepsData = data.steps;
            stateData = data;
            renderStepsThumbList(data.steps);
            renderStepContentDiv(data.primary_step.step_content);
            renderMainContent(data.blog_information, data.primary_step, data.steps);
            stepImages = [...data.primary_step.step_imgs];
            displayImages(stepImages);
        });
}
if (stepId != null) {
    getStepData();
}

function handleInsert() {
    console.log('egeaga');
    console.log(stateData);
    const stepNumber = stateData.primary_step.step_number[0];
    console.log(stepNumber);
    const newUrl = `./step-page.html?blog_id=${blogId}/new-after/${stepNumber}`;
    console.log('egeaga');
    console.log((document.querySelector('#insertStep').href = newUrl));

    history.pushState({}, '', newUrl);
    location.reload();
}

document.querySelector('#insertStep').addEventListener('click', function (e) {
    e.preventDefault();
    handleInsert();
});
// Image Input START
// Upload Single Image with Multiple Input
// const stepImages = [];

const inputs = document.querySelectorAll('.input-image');
const imgWrappers = document.querySelectorAll('.image-wrapper.thumb-wrapper');
const bigStepImage = document.querySelector('#bigStepImage .image-wrapper');
let stepImages = [];

function displayImages(stepImages) {
    stepImages.forEach((img, index) => {
        imgWrappers[index].innerHTML = `<img src="${img.img_url}" alt=""/>`;
        imgWrappers[index].nextElementSibling.style.display = 'none';
    });
    bigStepImage.innerHTML = `<img src="${stepImages[0].img_url}" alt=""/>`;
    bigStepImage.nextElementSibling.style.display = 'none';
}

if (stepImages.length > 0) {
    stepImages.forEach((img, index) => {
        console.log(imgWrappers[index]);
        imgWrappers[index].innerHTML = `<img src="${img.img_url}" alt=""/>`;
        imgWrappers[index].nextElementSibling.style.display = 'none';
    });
    displayImages(stepImages);
}

// Upload single image
inputs.forEach((input, index) => {
    input.addEventListener('change', function () {
        const file = input.files;
        console.log(URL.createObjectURL(file[0]));
        console.log(stepImages);
        const newStepImg = {
            img_url: `${URL.createObjectURL(file[0])}`,
            img_number: 1,
            _id: '658bf0e414edd9039ddc7b19',
        };
        console.log(newStepImg);
        if (index < 2) {
            stepImages[0] = newStepImg; // Update the image at index 0 for the first and second inputs
        } else {
            stepImages[index - 1] = newStepImg; // Update the image at the exact position for inputs from 3 onwards
        }
        console.log(stepImages);
        displayImages(stepImages);
    });
});
// Image Input END
function handleDelete(deleteHref) {
    // const deleteURL =
    // /guide/blog/edit/steps/delete/:step_id/:blog_id
    const apiUrl = `http://localhost:3000/guide/blog/edit/steps/delete/${stepId}/${blogId}`;

    fetch(apiUrl, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        //body: JSON.stringify({ steps: updatedSteps }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Patch request successful:', data);
            window.location.href = deleteHref;
        })
        .catch(error => {
            console.error('Error during PATCH request:', error);
        });
}

function renderMainContent(blog_info, primary_step, steps) {
    document.querySelector('.history-heading').innerHTML = blog_info.blog_title;
    document.querySelector('.step-title').innerHTML = `Editing Step - ${primary_step.step_number[0]}  `;
    currentStepNumber = primary_step.step_number[0]; // stepnumber = 1 => steps[0]
    ccurentStepId = primary_step.stepId;

    currentStepNumber = primary_step.step_number[0]; // stepnumber = 1 => steps[0]
    console.log(currentStepNumber);
    steps.forEach(step => {
        console.log(step.step_number[0]);
    });
    let newHrefDelete;

    if (currentStepNumber === 1) {
        const nextStep = steps[1].stepId;
        newHrefDelete = document.querySelector(
            '#deleteStep'
        ).href = `./step-page.html?blog_id=${blogId}&step_id=${nextStep} `;
    } else {
        const previousStep = steps[currentStepNumber - 2].stepId;
        newHrefDelete = document.querySelector(
            '#deleteStep'
        ).href = `./step-page.html?blog_id=${blogId}&step_id=${previousStep} `;
    }
    document.querySelector('#deleteStep').addEventListener('click', function (e) {
        e.preventDefault();
        handleDelete(newHrefDelete);
    });
}

function renderStepContentDiv(step_content) {
    console.log(step_content);

    step_content.forEach(step => {
        console.log(step);
        const lineDiv = document.createElement('div');
        lineDiv.classList.add('line');
        const paragraph = document.createElement('div');
        paragraph.classList.add('p-inline');
        paragraph.innerHTML = step.content_div;

        lineDiv.insertAdjacentHTML('afterbegin', '<div class="icon fa fa-circle bullet"></div>');
        lineDiv.appendChild(paragraph);
        document.getElementById('myEditor').appendChild(lineDiv);
        newTextEditor(paragraph);
    });
}

function renderStepsThumbList(steps) {
    const stepsData = steps;
    let stepsHtml = '';
    stepsData.forEach(step => {
        stepsHtml += `
        <div class="draggable-item" data-id="${step.step_number[0]}">
            <img src="${step.step_imgs[0].img_url}" alt="" width=40 onclick="newStepId('${step.stepId}')"/>
        </div>
    `;
    });
    document.querySelector('#draggable-list').innerHTML = stepsHtml;
}

function newStepId(clickedStepId) {
    // Update url
    const newUrl = `./step-page.html?blog_id=${blogId}&step_id=${clickedStepId}`;
    history.pushState({}, '', newUrl);
    location.reload();
}

function newHrefIntroduction() {
    // Get the link element by its id
    const introductionTab = document.getElementById('introductionTab');
    const newHref = (introductionTab.href = `./introduction-page.html?id=${blogId}`);

    console.log('Introduction href:', newHref);
}

function handleUpdateSteps() {
    let isDraggingEnabled = false;
    // click on insert, append a new empty step, reload the page
    // in the render step check if step == null => display image
    // primary step the same, check if that step data is empty => then delete that step from (user click other step) reload the page
    // Update href value of introduction
    newHrefIntroduction();

    function toggleButtonsVisibility(isDraggingEnabled) {
        const saveCancelButtons = document.getElementById('saveCancelButtons');

        if (isDraggingEnabled) {
            saveCancelButtons.style.display = 'block';
        } else {
            saveCancelButtons.style.display = 'none';
        }
    }

    toggleButtonsVisibility(isDraggingEnabled);

    const draggableList = new Draggable.Sortable(document.querySelectorAll('#draggable-list'), {
        draggable: '.draggable-item',
        mirror: {
            constrainDimensions: true,
        },
        classes: {
            mirror: 'draggable-mirror',
        },
        dragClass: 'sortable-source--is-dragging',
    });

    draggableList.on('sortable:start', event => {
        if (!isDraggingEnabled) {
            event.cancel();
        }
    });

    draggableList.on('sortable:stop', event => {
        const draggedItem = event.data.dragEvent.source;
        const itemId = draggedItem.getAttribute('data-id');
        console.log('Dropped item with ID:', itemId);
    });

    document.querySelector('.rearrange-steps-button').addEventListener('click', function () {
        isDraggingEnabled = !isDraggingEnabled;
        console.log(isDraggingEnabled);

        toggleButtonsVisibility(isDraggingEnabled);
    });

    document.getElementById('saveStepsButton').addEventListener('click', function () {
        console.log(stepsData);
        const updatedOrder = Array.from(document.querySelectorAll('.draggable-item')).map(item =>
            item.getAttribute('data-id')
        );

        const updatedSteps = stepsData.map(step => {
            const newStepNumber = updatedOrder.indexOf(step.step_number[0].toString()) + 1;
            return { ...step, step_number: [newStepNumber] };
        });
        console.log(updatedSteps);
        sendPatchRequest(updatedSteps);
        isDraggingEnabled = false;
        toggleButtonsVisibility(isDraggingEnabled);
    });

    document.getElementById('cancelStepsButton').addEventListener('click', function () {
        isDraggingEnabled = false;
        toggleButtonsVisibility(isDraggingEnabled);
    });

    function sendPatchRequest(updatedSteps) {
        const apiUrl = `http://localhost:3000/guide/blog/edit/steps/${blogId}`;

        fetch(apiUrl, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ steps: updatedSteps }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Patch request successful:', data);
            })
            .catch(error => {
                console.error('Error during PATCH request:', error);
            });
    }
}

document.addEventListener('DOMContentLoaded', function () {
    handleUpdateSteps();
});

function saveImageFirebase(){

    

const firebaseConfig = {
  apiKey: "AIzaSyBXGDpGLkoxPHaMGIG-E6GxviDDssv-97c",
  authDomain: "thesis-268ea.firebaseapp.com",
  projectId: "thesis-268ea",
  storageBucket: "thesis-268ea.appspot.com",
  messagingSenderId: "1065392850994",
  appId: "1:1065392850994:web:023a10aca1806650fd142b",
  measurementId: "G-XHJ0ES966N"
};

const app = initializeApp(firebaseConfig);
const storage = app.storage();
}

