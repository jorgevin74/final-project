// Front end JavaScript code goes here
const searchInput  = document.getElementById('search');
const enterBtn = document.getElementById('enter');
const searchContainerEl = document.getElementById('img_area_results');


  const popup = document.getElementById('popup');
  const closeBtn = document.getElementById('closePopUp');

//add the information of albums onto here
dataArr = []

//Generate a token for the Spotify API if it doesn't exist 
async function getToken(){
    let token = null;
    if(localStorage.getItem('spotifyToken')){
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
async function searchForAlbum(searchInput){
    const token = await getToken();
    console.log(token);
    try{
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
        searchForAlbum(searchInput);
        }
        else {
            return dataArr;
        }
        } catch(error){
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

    // loop through top 5 albums
    for (let i = 0; i < 5; i++) {
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

        // Artist
        const artistEl = document.createElement('h2');
        artistEl.classList.add('artist_name');
        artistEl.innerHTML = `<span class="label">Artist: </span><span class="value">${album.artists[0].name}</span>`;

        // Album Title
        const titleEl = document.createElement('h2');
        titleEl.classList.add('album_title');
        titleEl.innerHTML = `<span class="label">Album: </span><span class="value">${album.name}</span>`;

        // Release Date
        const releaseEl = document.createElement('h2');
        releaseEl.classList.add('album_release');
        releaseEl.innerHTML = `<span class="label">Release Date: </span><span class="value">${album.release_date}</span>`;

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
}

//waits a little while before retrieveing the information from the dataArray so that the info can be filled and then calls upon the other function (add album info) 
async function retrieveAlbumInfo(SearchTerm){
    const result = await searchForAlbum(SearchTerm);
    addAlbumInfo(result.albums.items);
}

//function that once you click on the album, then the review panel will pop up



//when you press enter on the keyboard, it searches for the album from spotify
searchInput.addEventListener('keydown', function(event){
    if(event.key === 'Enter'){
        const itemSearchedFor = searchInput.value;
        retrieveAlbumInfo(itemSearchedFor);
    }
});

//when you click the enter button (or a search icon), it searches the album from spotify
enterBtn.addEventListener('click', function(){
    const artSearchFor = searchInput.value;
    retrieveAlbumInfo(artSearchFor);
})



window.addEventListener('load', () => {
  popup.style.display = 'flex';
});

closeBtn.addEventListener('click', () => {
    popup.style.display = 'none';
});






