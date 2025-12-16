var express = require('express');
var router = express.Router();
const Reviews = require('../models/Reviews');


/*POST  */
router.post('/', async function (){
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
        res.send('Something went wrong');
    }
});


router.put('/:id', async function () {
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