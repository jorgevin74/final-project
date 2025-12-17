// Front end JavaScript code goes here
const searchInput = document.getElementById('search');
const enterBtn = document.getElementById('enter');
const searchContainerEl = document.getElementById('img_area_results');


const popup = document.getElementById('popup');
const closeBtn = document.getElementById('closePopUp');

//setting everything up to submit album reviews in here
const track_items = document.getElementsByClassName('track_item');
const reviewPopUp = document.getElementById('review_popup');

const postBtn = document.getElementById('post');

let albumSelected;

//add the information of albums onto here
dataArr = []



//data of different background colors for the posted reviews
colorData = ["#F263A6", "#F279BC", "#77F2F2", "#F2E641", "#F2EC99"];

const albumReview = document.querySelectorAll('.review_content');

for (let i = 0; i < albumReview.length; i++) {
    const randomColor = colorData[Math.floor(Math.random() * colorData.length)];
    albumReview[i].style.backgroundColor = randomColor;
}


//once you click the like button then the button will change 
const likeBtn = document.querySelectorAll('.likeButton');

for (let i = 0; i < likeBtn.length; i++) {
    likeBtn[i].addEventListener('click', async function () {
        likeBtn[i].src = '/images/like.png';
        likeBtn[i].classList.add('likedBtn');

        const reviewId = likeBtn[i].dataset.id;
        const previousLikes = parseInt(likeBtn[i].dataset.likes);

        const countSpan = likeBtn[i].nextElementSibling;
        const newLikes = previousLikes + 1;
        countSpan.textContent = newLikes;
        likeBtn[i].dataset.likes = newLikes;


        await updateReview(reviewId, previousLikes);
    });
}


//Generate a token for the Spotify API if it doesn't exist 
async function getToken() {
    let token = null;
    if (localStorage.getItem('spotifyToken')) {
        token = localStorage.getItem('spotifyToken');
    } else {
        const response = await fetch('/api/spotify/token');
        const data = await response.json();
        token = data.access_token;
        localStorage.setItem('spotifyToken', token);
    }
    return token;
}

//fetch an album from Spotify
async function searchForAlbum(searchInput) {
    const token = await getToken();
    console.log(token);
    try {
        const response = await fetch(`https://api.spotify.com/v1/search?q=${searchInput}&type=album`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        //stores the data inside of this array
        dataArr = await response.json();
        console.log(dataArr);

        if (dataArr.error) {
            localStorage.removeItem('spotifyToken');
            return await searchForAlbum(searchInput);
        }
        else {
            return dataArr;
        }
    } catch (error) {
        console.log('error', error);
    }
}

//add the album's information (album cover, artist name & release date) from the spotify api onto the web page
function addAlbumInfo(albums) {
    // reset previous results
    searchContainerEl.innerHTML = '';

    // create UL
    const UnorganizedList = document.createElement('ul');
    UnorganizedList.classList.add('track');
    searchContainerEl.appendChild(UnorganizedList);

    // loop through the top 8 albums searched
    for (let i = 0; i < 8; i++) {
        const album = albums[i];

        // create LI
        const listItem = document.createElement('li');
        listItem.classList.add("track_item");

        // --- album_cover div ---
        const coverDiv = document.createElement('div');
        coverDiv.classList.add('album_cover');

        const imgEl = document.createElement('img');
        imgEl.classList.add('album_artwork');
        imgEl.src = album.images[1].url;
        coverDiv.appendChild(imgEl);

        // --- album_info div ---
        const infoDiv = document.createElement('div');
        infoDiv.classList.add('album_info');

        // Album Title
        const titleEl = document.createElement('h2');
        titleEl.classList.add('album_title');
        titleEl.innerHTML = `<span class="label">Album: </span><span class="value">${album.name}</span>`;

        // Artist
        const artistEl = document.createElement('h2');
        artistEl.classList.add('artist_name');
        artistEl.innerHTML = `<span class="label">Artist: </span><span class="value">${album.artists[0].name}</span>`;

        // Release Date
        const releaseEl = document.createElement('h2');
        releaseEl.classList.add('album_release');
        releaseEl.innerHTML = `<span class="label">Release Date: </span><span class="value">${album.release_date}</span>`;


        //add event listener here for clickable album links
        listItem.addEventListener('click', function () {
            reviewPopUp.style.display = "flex";
            UnorganizedList.style.display = "none"

            const albumDetails = document.getElementById('album_details');
            albumDetails.innerHTML = `
                <img src="${album.images[1].url}" class="album_artwork" />
                <h2 class="album_title">Album: ${album.name}</h2>
                <h2 class="artist_name">Artist: ${album.artists[0].name}</h2>
            `;

            albumSelected = album;
        });


        // append text info
        infoDiv.appendChild(artistEl);
        infoDiv.appendChild(titleEl);
        infoDiv.appendChild(releaseEl);

        // append both divs into LI
        listItem.appendChild(coverDiv);
        listItem.appendChild(infoDiv);

        // append LI into UL
        UnorganizedList.appendChild(listItem);
    }

    //add event listener here to post the content to the board
    postBtn.addEventListener('click', function () {
        reviewPopUp.style.display = "none";
        const userScore = document.getElementById('UserScore').value;
        const userReview = document.getElementById('userText').value;
        addReview(albumSelected.name, albumSelected.artists[0].name, albumSelected.images[1].url, userScore, userReview);


        // build new review card and inject into .list
        const listEl = document.querySelector('.list');
        const reviewDiv = document.createElement('div');
        reviewDiv.classList.add('review_content');

        reviewDiv.innerHTML = `
        <div id="review_albumCover">
            <img src="${newReview.albumCover}" alt="">
        </div>
        <div id="review_artist_title">
            <span id="albumtitle">${newReview.title}</span>
            <span id="artist">${newReview.artist}</span>
        </div>
        <div id="review_score">
            <span id="score">Score: ${newReview.score}</span>
        </div>
        <div id="review_text_score">
            ${newReview.review}
        </div>
        <div id="review_button">
            <span class="likeCount">${newReview.numberOfLikes}</span>
        </div>
    `;

        listEl.prepend(reviewDiv); // add to top of list
    });
}

//adds the review to the database
async function addReview(reviewObjecttitle, reviewObjectArtist, reviewObjectCover, userScore, userReview) {
    const postData = {
        title: reviewObjecttitle,
        artist: reviewObjectArtist,
        albumCover: reviewObjectCover,
        score: userScore,
        review: userReview,
        numberOfLikes: 0
    }
    const response = await fetch('/api/review', {
        method: 'POST', // Specify the HTTP method as POST
        headers: {
            'Content-Type': 'application/json' // Indicate that the body is JSON
        },
        body: JSON.stringify(postData) // Convert the data object to a JSON string
    });
    const data = await response.json();
    console.log('added item', data);
    return data;
}

/*Updates the Review and adds a thumbs up to it */
async function updateReview(id, previousNumOfLikes) {
    const postData = {
        numberOfLikes: previousNumOfLikes + 1
    }
    const response = await fetch('/api/review/' + id, {
        method: 'PUT', // Specify the HTTP method as POST
        headers: {
            'Content-Type': 'application/json' // Indicate that the body is JSON
        },
        body: JSON.stringify(postData) // Convert the data object to a JSON string
    });
    const data = await response.json();
    console.log('added item', data);
}



//waits a little while before retrieveing the information from the dataArray so that the info can be filled and then calls upon the other function (add album info) 
async function retrieveAlbumInfo(SearchTerm) {
    const result = await searchForAlbum(SearchTerm);
    addAlbumInfo(result.albums.items);
}

//when you press enter on the keyboard, it searches for the album from spotify
searchInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        const itemSearchedFor = searchInput.value;
        retrieveAlbumInfo(itemSearchedFor);
    }
});

//when you click the enter button (or a search icon), it searches the album from spotify
enterBtn.addEventListener('click', function () {
    const artSearchFor = searchInput.value;
    retrieveAlbumInfo(artSearchFor);
})


//when you load the page the the pop up window will display as before it was hidden
window.addEventListener('load', () => {
    popup.style.display = 'flex';
});

//once you click on the close or in this case Get Started Button, then the pop up will go away and will lead you into the website
closeBtn.addEventListener('click', () => {
    popup.style.display = 'none';
});






