// // Function to fetch and display blog data
// function loadBlogData(blogId) {
//     // Fetch blog data using the blog ID
//     fetch(`http://localhost:3000/guide/blog/api/${blogId}`)
//         .then(response => { if (!response.ok) {
//     throw new Error(`Network response was not ok (Status: ${response.status})`);
// };return response.json()})
//         .then(data => {
//             // Update the content of the blogContent div
//
//             <!-- Add more content as needed -->
//           `;
//         })
//         .catch(error => console.error('Error fetching blog data:', error));
// }

// Get blog ID from the URL parameter
// const urlParams = new URLSearchParams(window.location.search);
// const blogId = urlParams.get('id');
// console.log(blogId);

// // Load blog data on page load
// if (blogId) {
//     loadBlogData(blogId);
// }

//////////////////////////////////////
function loadBlogData(blogId) {}
fetch(`../../data/blog_data.json`)
    .then(response => {
        if (!response.ok) {
            throw new Error(`Network response was not ok (Status: ${response.status})`);
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        const { _id, member_since, password, user_name, total_guides, __v } = data.user_information;
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

        data.steps.forEach(renderStep);
    })
    .catch(error => console.error(`Error fetching blog data: ${error.message}`, error));

function renderStep(step) {
    console.log(step);
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
                                                    <button onclick="postComment(this)" class="post-comment-btn">
                                                        Post comment
                                                    </button>
                                                </div>
                                            </div>
                                            <div class="comments" style="display: none">
                                                <div class="comment">
                                                    <div class="comment-icon">💬</div>
                                                    <div class="comment-content">
                                                        <div class="comment-author">John Doe</div>
                                                        <div class="comment-date">December 10, 2023</div>
                                                        This guide was really helpful! Thanks for sharing.
                                                        <button onclick="replyToComment(this)" class="reply-button">
                                                            Reply
                                                        </button>
                                                    </div>
                                                </div>
                                                <div class="comment">
                                                    <div class="comment-icon">💬</div>
                                                    <div class="comment-content">
                                                        <div class="comment-author">Jane Smith</div>
                                                        <div class="comment-date">December 11, 2023</div>
                                                        I had the same issue, and this fixed it for me. Great job!
                                                        <button onclick="replyToComment(this)" class="reply-button">
                                                            Reply
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
    `;
    stepList.appendChild(stepItem);
}

// Function to render step images
function renderImages(images) {
    // prettier-ignore
    return images.map((image,index) => `
    <a href="${image.img_url}"
       ${index === 1 ? ' onmouseover="changeMainImage(this)"' : ''}>
       <img src="${image.img_url}" alt="Step Image ${image.img_number}">
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
    const commentsContainer = document.querySelector('.comments');

    comments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.classList.add('comment');

        commentElement.innerHTML = `
      <div class="comment-icon">💬</div>
      <div class="comment-content">
        <div class="comment-author">${comment.user_information.user_name}</div>
        <div class="comment-date">${comment.dateCreated}</div>
        ${comment.comment_content}
        <button onclick="replyToComment(this)" class="reply-button">Reply</button>
      </div>
    `;

        commentsContainer.appendChild(commentElement);
    });
}

// Get blog ID from the URL parameter
const urlParams = new URLSearchParams(window.location.search);
const blogId = urlParams.get('id');
console.log(blogId);

// Load blog data on page load
if (blogId) {
    loadBlogData(blogId);
}
