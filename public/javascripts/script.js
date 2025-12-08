// Front end JavaScript code goes here



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

const ALBUM_ID = "4aawyAB9vmqN3uQ7FjRGTy";

//fetch an album from Spotify
async function getAlbum(){
    const token = await getToken();
    try{
        const response = await fetch('https://api.spotify.com/v1/albums/${ALBUM_ID}', {
            headers: {
                'Authorization': 'Bearer ${token}'
            }
        });
    const data = await response.json();
    console.log(data);

    if (data.error) {
        localStorage.removeItem('spotifyToken');
        getAlbum();
    }
    else {
        return data;
    }
    } catch(error){
        console.log('error', error);
    }
}