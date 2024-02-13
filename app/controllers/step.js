// oke test
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js';
import {
    getStorage,
    ref,
    getDownloadURL,
    uploadBytes,
} from 'https://www.gstatic.com/firebasejs/10.7.2/firebase-storage.js';

let stepsData;
let stateData;

// Get Blog ID and Step ID

const urlParams = new URLSearchParams(window.location.search);
var blogId = urlParams.get('blog_id');
var stepId = urlParams.get('step_id');

var prevStepNumber;

if (stepId == null) {
    const parts = blogId.split('/');

    prevStepNumber = parts[parts.length - 1];
    const newblogId = parts[0];
    blogId = newblogId;

    getInsertStepData(prevStepNumber, newblogId);
} else {
    getStepData();
}

function getInsertStepData(prevStepNumber, blogId) {
    fetch(`http://localhost:3000/guide/blog/edit/steps/insert/api/${blogId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            return response.json();
        })
        .then(data => {
            renderStepsThumbListInsert(data.steps, prevStepNumber);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while fetching data. Please try again later.');
        });
}

function newStepId(clickedStepId, blogId) {
    console.log('click new step Id');
    console.log(blogId);
    const newUrl = `./step-page.html?blog_id=${blogId}&step_id=${clickedStepId}`;
    history.pushState({}, '', newUrl);
    location.reload();
}

function renderStepsThumbListInsert(steps, prevStepNumber) {
    let stepsHtml = '';

    steps.splice(prevStepNumber, 0, { step_number: [prevStepNumber + 1] });

    steps.forEach((step, index) => {
        step.step_number[0] = index + 1;
    });
    steps.forEach((step, index) => {
        if (step.step_number[0] == parseInt(prevStepNumber) + 1) {
            stepsHtml += `
            <div class="draggable-item" data-id="${index + 1}">
                <img src="https://assets.cdn.ifixit.com/static/images/guide/NoImage_56x42.jpg" alt="" width=56 height=42/>
            </div>
            `;
        } else {
            stepsHtml += `
            <div class="draggable-item" data-id="${index + 1}">
            <img src="${step.step_imgs[0].img_url}" alt="" onclick="() => {
                newStepId('${step.stepId}', '${blogId}'); }"/>
            </div>
            `;
        }
    });

    document.querySelector('#draggable-list').innerHTML = stepsHtml;
}

function renderStepsThumbList(steps) {
    const stepsData = steps;
    console.log('reach blog id');
    console.log(blogId);
    let stepsHtml = '';
    stepsData.forEach(step => {
        stepsHtml += `
        <div class="draggable-item" data-id="${step.step_number[0]}" style="background-image: url('${step.step_imgs[0].img_url}')" onclick="newStepId('${step.stepId}','${blogId}')">
        </div>                                                                                                              
    `;
    });

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
            stepsData = data.steps;
            stateData = data;
            renderStepsThumbList(data.steps);
            renderStepContentDiv(data.primary_step.step_content);
            renderMainContent(data.blog_information, data.primary_step, data.steps);
            stepImages = [...data.primary_step.step_imgs];
            displayImages(stepImages);
        });
}

function handleInsert() {
    const stepNumber = stateData.primary_step.step_number[0];
    const newUrl = `./step-page.html?blog_id=${blogId}/new-after/${stepNumber}`;
    history.pushState({}, '', newUrl);
    location.reload();
}

document.querySelector('#insertStep').addEventListener('click', function (e) {
    e.preventDefault();
    handleInsert();
});
// Image Input START
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
            stepImages[0] = newStepImg;
        } else {
            stepImages[index - 1] = newStepImg;
        }
        console.log(stepImages);
        displayImages(stepImages);
    });
});
// Image Input END

function handleDelete(deleteHref) {
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
    var currentStepNumber = primary_step.step_number[0];
    var curentStepId = primary_step.stepId;
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

        const step_icon = step.icon;
        if (step_icon == 'icon_note') {
            lineDiv.insertAdjacentHTML(
                'afterbegin',
                '<div class="icon bullet bullet_note fa-solid fa-circle-info"></div>'
            );
        } else if (step_icon == 'icon_caution') {
            lineDiv.insertAdjacentHTML(
                'afterbegin',
                '<div class="icon bullet bullet_caution fa-solid fa-triangle-exclamation"></div>'
            );
        } else if (step_icon == 'icon_reminder') {
            lineDiv.insertAdjacentHTML(
                'afterbegin',
                '<div class="icon bullet bullet_reminder fa-solid fa-thumbtack"></div>'
            );
        } else {
            lineDiv.insertAdjacentHTML(
                'afterbegin',
                `<div class="icon fa fa-circle bullet bullet_${step_icon}"></div>`
            );
        }
        lineDiv.appendChild(paragraph);
        document.getElementById('myEditor').appendChild(lineDiv);
        newTextEditor(paragraph);
    });

    const contentBullets = document.querySelectorAll('.line .bullet');
    var modal = document.getElementById('myModal');

    contentBullets.forEach(contentBullet => {
        contentBullet.addEventListener('click', function () {
            var closeBtn = document.querySelector('.close');
            console.log('colse button' + closeBtn);
            closeBtn.addEventListener('click', function () {
                modal.style.display = 'none';
                console.log('hellooooo');
                // Remove the hello div if it exists
                var helloDiv = document.querySelector('.hello');
                if (helloDiv) {
                    helloDiv.remove();
                }
            });

            var helloDiv = document.createElement('div');
            helloDiv.textContent = 'Hello'; // You can set any content for the new div here
            helloDiv.classList.add('hello'); // Adding class name "hello" to the div

            // Insert the new div next to the contentBullet
            contentBullet.insertAdjacentElement('afterend', helloDiv);

            modal.style.display = 'block';
        });
    });

    // When the user clicks anywhere outside of the modal, close it
    window.addEventListener('click', function (event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });
    console.log(modal);
    console.log(contentBullets);
}
// Xử lý hiển thị icon của step content icon =bullet
// bullet.(class name)
// classname: red, black, yellow, Icon notice, icon warning , icon
// bullet_note, bullet_caution, bullet reminder

function newHrefIntroduction() {
    // Get the link element by its id
    const introductionTab = document.getElementById('introductionTab');
    const newHref = (introductionTab.href = `./introduction-page.html?id=${blogId}`);

    console.log('Introduction href:', newHref);
}

function handleUpdateSteps() {
    let isDraggingEnabled = false;
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

function saveImageFirebase() {
    const firebaseConfig = {
        apiKey: 'AIzaSyBXGDpGLkoxPHaMGIG-E6GxviDDssv-97c',
        authDomain: 'thesis-268ea.firebaseapp.com',
        projectId: 'thesis-268ea',
        storageBucket: 'thesis-268ea.appspot.com',
        messagingSenderId: '1065392850994',
        appId: '1:1065392850994:web:023a10aca1806650fd142b',
        measurementId: 'G-XHJ0ES966N',
    };

    const app = initializeApp(firebaseConfig);
    const storage = getStorage(app, 'gs://thesis-268ea.appspot.com');

    // Create a storage reference from our storage service
    const storageRef = ref(storage);

    document.getElementById('saveBtn').addEventListener('click', async () => {
        // Paragraph input
        const paragraphs = document.querySelectorAll('.p-inline');
        const paragraphsArray = Array.from(paragraphs);

        const stepContentArray = [];

        paragraphsArray.forEach((paragraph, index) => {
            const content = paragraph.innerHTML.trim();

            const stepContentObj = {
                content_div_number: index + 1,
                content_div: content,
            };

            stepContentArray.push(stepContentObj);
        });

        const jsonStepContent = {
            step_content: stepContentArray,
        };

        const jsonString = JSON.stringify(jsonStepContent);

        // Images input
        const fileInputs = document.querySelectorAll('.input-image');
        // Assuming you have a dynamic step ID stored in a variable called 'stepId'

        try {
            // Create a reference to the 'steps_edit_images/step_id' folder
            const stepIdRef = ref(storageRef, `steps_edit_images_/step_insert_${parseInt(prevStepNumber) + 1}`);

            let uploadedFileCount = 0;
            let uploadImagesURL = [];

            // Create an array to store promises returned by getDownloadURL()
            const promises = [];

            for (const input of fileInputs) {
                const file = input.files[0];
                if (file !== undefined) {
                    uploadedFileCount++; // Increment the uploaded file count
                    const fileName = `/image_${uploadedFileCount}.jpg`; // Use the uploadedFileCount as the index

                    // Create a reference to the file inside the 'step_id' folder
                    const fileRef = ref(stepIdRef, fileName);

                    try {
                        // Upload the file to Firebase Storage
                        const snapshot = await uploadBytes(fileRef, file);
                        console.log('Uploaded a blob or file!');

                        // Push the promise returned by getDownloadURL() into the promises array
                        promises.push(
                            getDownloadURL(fileRef)
                                .then(url => {
                                    uploadImagesURL.push(url);
                                })
                                .catch(error => {
                                    console.log('Error getting download URL:', error);
                                })
                        );
                    } catch (error) {
                        console.error('Error uploading file:', error);
                    }
                } else {
                    console.log('File is undefined. Skipping upload.');
                }
            }

            // Wait for all promises to resolve
            await Promise.all(promises);

            // After all promises are resolved, call uploadImagesServerInsertStep()
            console.log('Upload images URL:', uploadImagesURL);
            uploadDataServerInsertStep(uploadImagesURL, jsonString);
        } catch (error) {
            console.error('Error uploading images:', error);
        }
    });
}

saveImageFirebase();

function uploadDataServerInsertStep(uploadImagesURL, stepContent) {
    const apiUrl = `http://localhost:3000/guide/blog/edit/steps/${blogId}`;
    console.log('before sending');
    console.log(uploadImagesURL);
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ images: uploadImagesURL, stepContent: stepContent, prevStepNumber: prevStepNumber }),
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
