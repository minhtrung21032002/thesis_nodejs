function loadIntroductionData() {
    fetch('../../data/introduction_data.json')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // console.log(data)
            // renderIntroduction(data);
            renderStepsThumbList(data.steps);
        });
}
loadIntroductionData();

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
