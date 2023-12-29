const api = new Api();

function getEl(id) {
    return document.getElementById(id);
}

const renderUI = data => {
    let content = '';
    data.forEach(blog => {
        content += ` 
        <a href="/blog?id=${blog._id}" class="col-md-4 blog-link">
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
const filePath = '../../data/guide_data.json';

// Fetch JSON data
fetch(filePath)
    .then(response => response.json())
    .then(data => {
        // Now 'data' contains the contents of the JSON file
        console.log(data);
        renderUI(data);
    })
    .catch(error => console.error('Error fetching JSON:', error));

////////////////////////////////////////////////////////
// Fetch JSON for specific blog when click on guide link
// Assuming you have a function to fetch blog data by ID
async function fetchBlogData(blogId) {
    // You need to implement this function to fetch data from the server
    // For example, using fetch or XMLHttpRequest
    const response = await fetch(`/blog?id=${blogId}`);
    const data = await response.json();
    return data;
}

document.addEventListener('DOMContentLoaded', function () {
    const blogLinks = document.querySelectorAll('.blog-link');

    blogLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();

            const blogId = getQueryParamValue('id', link.href);

            // Fetch data based on the blog ID
            // fetch(`/api/blog?id=${blogId}`)
            fetch(`../../data/blog_data.json`)
                .then(response => response.json())
                .then(blogData => {
                    // Now you have the blog data, you can use it as needed
                    console.log(blogData);

                    // Redirect to the blog page or update the content dynamically
                    window.location.href = `/blog?id=${blogId}`;
                })
                .catch(error => console.error('Error fetching blog data:', error));
        });
    });

    // Function to extract query parameter value from URL
    function getQueryParamValue(param, url) {
        const queryString = url.split('?')[1];
        const queryParams = new URLSearchParams(queryString);
        return queryParams.get(param);
    }
});
