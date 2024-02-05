



function loadIntroductionData() {


    // Find Blog Id in URL
    const urlParams = new URLSearchParams(window.location.search);
    const blogId = urlParams.get('id');
   
    // Fetch
    fetch(`http://localhost:3000/guide/blog/edit/intro/api/${blogId}`)
    //fetch('../../data/introduction_data.json')
        .then(response => response.json())
        .then(data => {
            console.log(data);

            let stepsData;

        function getQueryParam(name) {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get(name);
        }

        // Retrieve the blog_id from the URL
        const blogIdFromURL = getQueryParam('blog_id');
            // console.log(data)
            renderIntroduction(data);
            renderStepsThumbList(data.steps, blogId);
        });
}
loadIntroductionData();

function renderIntroduction(data) {
    console.log(data.blog_information);
    console.log(data.blog_information.blog_title);
    document.querySelector('.guide-title').innerHTML = `
    ${data.blog_information.blog_title}`;
}

function renderStepsThumbList(steps, blogId) {
    const stepsData = steps;
    const defaultStep = stepsData[0].stepId // Step 1 as default Primary Step

     // Update Href Value Of Step Page With Blog Id and Step Id (Primary Step)
     stepPageHref(blogId, defaultStep);


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

// Update Href Value Of Step Page
function stepPageHref(blogId, stepId) {
    const guideStepsTab = document.querySelector('.tab-link[data-tab="guidesteps"]');

    if (guideStepsTab) {
        guideStepsTab.href = `./step-page.html?blog_id=${blogId}&step_id=${stepId}`;


    } else {
        console.error('Guide Steps tab not found.');
    }
}

