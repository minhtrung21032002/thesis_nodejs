let stepsData;

// Get Blog ID and Step ID

const urlParams = new URLSearchParams(window.location.search);
const blogId = urlParams.get('blog_id');
const stepId = urlParams.get('step_id');


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
    });

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
        // console.log(step.step_imgs);
        stepsHtml += `
            <div class="draggable-item" data-id="${step.step_number[0]}">
            <img src="${step.step_imgs[0].img_url}" alt="" width=40 />
            </div>
        `;
    });

    document.querySelector('#draggable-list').innerHTML = stepsHtml;
}

document.addEventListener('DOMContentLoaded', function () {
    let isDraggingEnabled = false;

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
        const apiUrl = 'http://localhost:3000/guide/blog/edit/steps/657e6ae5817b8b95953fa2ac';

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
});
