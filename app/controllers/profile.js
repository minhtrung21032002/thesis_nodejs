fetch('../../data/profile_data.json')
    .then(res => {
        console.log(res);
        return res.json();
    })
    .then(data => {
        console.log(data);

        renderUserInfo(data.user_information);
        renderBadges(data.list_badges);
        renderGuideCards(data.list_guides);
    });

function renderBadges(listBadges) {
    let content = '';
    listBadges.forEach(badge => {
        console.log(badge);
        content += `
         <div class="badge-card">
                <img
                    src="${badge.badge_icon}"
                    alt="Badge Icon"
                    style="max-width: 50px" />
                <h3>${badge.badge_name}</h3>
                <p>Reach 0-1000 points</p>
        </div>
        `;
    });

    document.getElementById('badges-container').innerHTML = content;
}

function renderUserInfo(user) {
    console.log(user);
    let content = '';
    content += `
            <img
                src="${user.user_img}"
                alt="User Image"
                style="max-width: 100px; border-radius: 50%" />
            <h2>${user.user_name}</h2>
            <p>User ID: ${user.user_id}</p>
            <p>Points: ${user.points}</p>
            <p>Member Since: ${user.member_since}</p>
    `;

    document.getElementById('user-info').innerHTML = content;
}

function renderGuideCards(guides) {
    let content = '';
    guides.forEach(guide => {
        content += `
             <div class="guide-card">
                 <img
                    src="${guide.img_url}"
                    alt="Guide Image"
                    style="max-width: 100%" />
                <h3>${guide.guide_title}</h3>
             </div>
             `;
    });
    document.getElementById('guides-container').innerHTML = content;
}
