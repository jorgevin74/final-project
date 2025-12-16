var express = require('express');
var router = express.Router();
var fs = require('fs');
const Reviews = require('../models/Reviews');


/*GET */
router.get('/', async function(req, res, next){
    try{
        const items = await Reviews.find();
        res.json(items);
    } catch(error){
        console.log(error);
        res.status(500);
        res.send('Something went wrong');
    }
});

/*POST  */
router.post('/', async function (request, response){
    console.log(request.body);
    try {
        const newFields = {
            ...request.body,
            createdAt: new Date(),
            value: 0.25,
        }
        console.log(newFields)
        const newItem = await Reviews.create(newFields);
        response.json(newItem);
    }  catch (error) {
        console.log(error);
        response.send('Something went wrong');
    }
});


/*PUT */
router.put('/:id', async function (request, response) {
    console.log(request.params.id);
    console.log(request.body);

    try {
        const updatedItem = await Reviews.findByIdAndUpdate(
            request.params.id,
            {
                ...request.body
            }
        )
        response.json(updatedItem);
    } catch (error) {
        console.log(error);
        response.send('something went wrong')
    }
})

module.exports = router;