// Front end JavaScript code goes here
const searchInput  = document.getElementById('search');
const enterBtn = document.getElementById('enter');
const searchContainerEl = document.getElementById('search_area_results');

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
function addAlbumInfo(albums){

    //resets the search items
    searchContainerEl.innerHTML = '';

    //creates an unorganized list for the albums
    const UnorganizedList = document.createElement('ul');
    UnorganizedList.classList.add('track');
    searchContainerEl.appendChild(UnorganizedList);

    //for loop that goes through the top 5 searches
    for(let i = 0; i < 5; i++){
        //creates a list item
        const listItem = document.createElement('li');
        listItem.classList.add("track_item");

        //creates an img tag and adds the album artwork into the tag
        const imgEl = document.createElement('img');
        imgEl.classList.add('album_artwork');
        imgEl.src = albums[i].images[1].url;

        //creates a text tag to add the artists name
        const textheading1 = document.createElement('h2');
        textheading1.classList.add('artist_name');
        textheading1.textContent = albums[i].artists[0].name;

        //creates a text tag to add the album title
        const textheading2 = document.createElement('h2');
        textheading2.classList.add('album_title');
        textheading2.textContent = albums[i].name;

        //creates a text tag to show when the album released
        const textheading3 = document.createElement('h2');
        textheading3.classList.add('album_release');
        textheading3.textContent = albums[i].release_date;

        //appends it all 
        listItem.appendChild(imgEl);
        listItem.appendChild(textheading1);
        listItem.appendChild(textheading2);
        listItem.appendChild(textheading3);
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






