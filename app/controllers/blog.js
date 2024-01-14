let dataGlo;
function loadBlogData(blogId) {
    // fetch(`http://localhost:3000/guide/blog/api/${blogId}`)
    fetch('../../data/blog_data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok (Status: ${response.status})`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            dataGlo = data;
            const { _id: user_id, member_since, password, user_name, total_guides } = data.user_information;
            const {
                _id: blogId,
                blog_title,
                last_updated,
                conclusion,
                difficulty,
                introduction,
                time,
            } = data.blog_information;

            // Update the content of the blogContent div
            document.querySelector('.guide-title').innerHTML = `
            ${blog_title} 
        `;
            document.querySelector('.guide-author').innerHTML = `
            ${user_name}
        `;

            const formattedDate = new Intl.DateTimeFormat('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
            }).format(new Date(last_updated));
            document.querySelector('.author-date').innerHTML = `Last updated ${formattedDate}`;

            document.querySelector('.difficulty').insertAdjacentText('beforeend', `${difficulty}`);

            document.querySelector('.time').insertAdjacentText('beforeend', `${time}`);

            document.querySelector('.guide-intro-main h2').insertAdjacentHTML('afterend', `${introduction}`);

            data.steps.forEach((step) => { renderStep(step, user_id) });

            renderComments(data.summary_comments);
        })
        .catch(error => console.error(`Error fetching blog data: ${error.message}`, error));
}
loadBlogData();

function renderStep(step, user_id) {
    console.log('user_id')
    console.log(user_id)

    console.log(step.stepId)
    const stepList = document.getElementById('steps-container');
    const stepItem = document.createElement('li');
    stepItem.classList.add('step', 'step-wrapper');
    stepItem.innerHTML = `
        <div class="step-title">Step ${step.step_number[0]}: Identify the problem</div>
        <div class="image-container">
        <div class="fotorama"
             data-nav="thumbs"
             data-loop="false"
             data-arrows="false"> 
             ${renderImages(step.step_imgs)}
        </div>
           
        </div>
        <ol class="step-content step-guide">
            ${renderContent(step.step_content)}
        </ol>
        <div class="comment-section">
                <div class="comment-button-container">
                    <div class="comment-button" onclick="toggleComments(this)">Comment</div>
                </div>    
                
                <div class="comment-input" style="display: none">
                    <h4 class="js-add-comment-title">Add Comment</h4>
                    <textarea class="common-reply-textarea">Type your comment</textarea>
                    <div class="post-buttons">
                        <button onclick="postComment(this,'${step.stepId}','${user_id}')" class="post-comment-btn">
                            Post comment
                        </button>
                    </div>
                </div>
                
                <div class="comments" style="display: none">
                   ${renderStepComments(step.step_comments)}
                </div>                                  
        </div>
    `;
    stepList.appendChild(stepItem);
}

// Function to render step images
function renderImages(images) {
    // prettier-ignore
    return images.map((image, index) => `
    <a href="${image.img_url}"
       ${index === 1 ? ' onmouseover="changeMainImage(this)"' : ''}>
       <img src="${image.img_url}" alt="Step Image ${image.img_number}" width=275>
    </a>
    `).join('');
}

// Function to render step content
function renderContent(content) {
    return content
        .map(
            item => `
        <li class="step-item line">
            <div class="icon fa fa-circle bullet bullet_black"></div>
            <p>${item.content_div}</p>
        </li>
    `
        )
        .join('');
}

// Function to render comments
function renderComments(comments) {
    const commentsContainer = document.querySelector('.comments-container');

    let content = '';

    comments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.classList.add('comment');

        commentElement.innerHTML = `
      <div class="comment-icon">💬</div>
      <div class="comment-content">
        <div class="comment-author">${comment.user_information.user_name}</div>
        <div class="comment-date">${new Date(comment.dateCreated).toLocaleString('en-US', {
            timeZone: 'Asia/Ho_Chi_Minh',
        })}</div>
        ${comment.comment_content}
        <button onclick="replyToComment(this)" class="reply-button">Reply</button>
      </div>
    `;

        commentsContainer.appendChild(commentElement);
    });

    commentsContainer.querySelector('.comments-list').innerHTML = content;
}

function renderStepComments(comments) {
    return comments
        .map(comment => {
            return `<div class='comment'>
            <div class='comment-icon'>💬</div>
            <div class='comment-content'>
                <div class='comment-author'>Jane Smith</div>
                <div class='comment-date'>December 11, 2023</div>
                ${comment.comment_content}
                <button onclick='replyToComment(this)' class='reply-button'>
                    Reply
            </div>
                </button>
        </div>`;
        })
        .join('');
}

//
function toggleComments(button) {
    const commentSection = button.closest('.comment-section');

    const commentInput = commentSection.querySelector('.comment-input');

    const commentsContainer = commentSection.querySelector('.comments');

    if (commentInput.style.display === 'none') {
        commentInput.style.display = 'block';
        commentsContainer.style.display = 'block';
    } else {
        commentInput.style.display = 'none';
        commentsContainer.style.display = 'none';
    }
}

function postComment(button, step_id, user_id) {
    var commentInputContainer = button.closest('.comment-input');

    var commentTextarea = commentInputContainer.querySelector('textarea');
    // /guide/blog/comment/step/:step_id/:user_id
    var commentText = commentTextarea.value.trim();


    if (commentText !== '') {
        // Prepare the data to be sent
        var postData = {
            author: 'Your Name', // You can replace this with the actual author information
            date: getCurrentDate(),
            text: commentText,
        };
        // localhost:3000/guide/blog/comment/step/658bf0e414edd9039ddc7b18/658e8240bcdfd9edfeeabd2e
        // Make the fetch POST request
        fetch(`http://localhost:3000/guide/blog/comment/step/${step_id}/${user_id}`, {

            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData),
        })
        .then(response => {
            console.log(response);
            if (response.status === 200) {
                // Reload the page
                window.location.reload();
            }
            return response.json();
        })

            .then(data => {
                // Handle the response data if needed
                console.log('Comment posted successfully:', data);
            })
            .catch(error => {
                console.error('Error posting comment:', error);
            });

    }
}

function getCurrentDate() {
    var currentDate = new Date();
    return currentDate.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function replyToComment(button) {
    document.querySelectorAll('.reply-input').forEach(function (replyInput) {
        replyInput.style.display = 'none';
    });

    var closestCommonReplyInput = button.closest('.comment-section').querySelector('.common-reply-textarea');
    closestCommonReplyInput.parentElement.style.display = 'block';

    closestCommonReplyInput.focus();
}

// Get blog ID from the URL parameter
const urlParams = new URLSearchParams(window.location.search);
const blogId = urlParams.get('id');
console.log(blogId);

// Load blog data on page load
if (blogId) {
    loadBlogData(blogId);
}
