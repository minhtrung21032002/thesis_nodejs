const api = new Api();

function getEl(id) {
    return document.getElementById(id);
}

const renderUI = data => {
    let content = '';
    data.forEach(blog => {
        content += ` 
        <a href="../view/blog-page.html?id=${blog.blog_id}" class="col-md-4 blog-link">
            <figure class="blog-card">
                <div class="img-wrapper">
                    <img
                        src="${blog.img_url}"
                        onerror="this.src='../../assets/img/cat.jpg';"
                        class="blog-card-image" />
                </div>
                <div class="blog-card-content">
                    <h3 class="blog-card-title">${blog.guide_title}</h3>
                </div>
            </figure>
        </a>
    `;
    });
    document.querySelector('.cards-container').innerHTML = content;
};

// const getListBlogs = () => {
//     api.fetchData()
//         .then(result => {
//             renderUI(result.data);
//         })
//         .catch(err => {
//             console.log(err);
//         });
// };

// Assuming your JSON file is hosted or part of your project
const filePath = 'http://localhost:3000/guide/api';

// Fetch JSON data
fetch(filePath)
    .then(response => response.json())
    .then(data => {
        // Now 'data' contains the contents of the JSON file
        console.log(data);
        renderUI(data);
    })
    .catch(error => console.error('Error fetching JSON:', error));
