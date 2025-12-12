var express = require('express');
var router = express.Router();

//Access the API env variabls
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

//GET /api/spotify/token
router.get('/token', async function(req,res){
    try{
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `grant_type=client_credentials&client_id=${SPOTIFY_CLIENT_ID}&client_secret=${SPOTIFY_CLIENT_SECRET}`
        });
        const data = await response.json();
        res.json(data);
    } catch(error){
        console.log('error', error);
        res.status = "500";
        res.send("Something went wrong");
    }
})


module.exports = router;