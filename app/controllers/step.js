let stepsData;
// note: Insert .dddd
function handleDelete() {
}
document.querySelector('#deleteStep').addEventListener('click', function () {
    handleDelete()
})

// Get Blog ID and Step ID

const urlParams = new URLSearchParams(window.location.search);
const blogId = urlParams.get('blog_id');
const stepId = urlParams.get('step_id');

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
            renderStepsThumbList(data.steps);
            renderStepContentDiv(data.primary_step.step_content);
            renderMainContent(data.blog_information, data.primary_step, data.steps);
            stepImages = [...data.primary_step.step_imgs];
            displayImages(stepImages);
        });
}
getStepData();

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

function renderMainContent(blog_info, primary_step, steps) {
    document.querySelector('.history-heading').innerHTML = blog_info.blog_title;
    document.querySelector('.step-title').innerHTML = `Editing Step - ${primary_step.step_number[0]}  `;
    currentStep = primary_step.step_number[0];
    steps.forEach(step => {
        console.log(step.step_number[0]);
    });
    // nextStep;
    if (currentStep === 1) {
        document.querySelector('#deleteStep').href = `./step-page.html?blog_id=${blogId}&step_id= ${steps[1].stepId} `;
    } else {
        document.querySelector('#deleteStep').href = `./step-page.html?blog_id=${blogId}&step_id= ${
            steps[currentStep - 1].stepId
        } `;
    }
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
function newStepId(clickedStepId) {
    // Update url
    const newUrl = `./step-page.html?blog_id=${blogId}&step_id=${clickedStepId}`;
    history.pushState({}, '', newUrl);
    location.reload();
}

function newHrefIntroduction() {
    // Get the link element by its id
function newHrefIntroduction() {
    // Get the link element by its id
    const introductionTab = document.getElementById('introductionTab');
    const newHref = introductionTab.href = `./introduction-page.html?id=${blogId}`;

    console.log('Introduction href:', newHref);

}

function handleUpdateSteps () {
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
    handleUpdateSteps()
});

