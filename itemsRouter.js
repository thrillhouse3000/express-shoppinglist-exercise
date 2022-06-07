const express = require('express');
const router = new express.Router();
const ExpressError = require('./expressError');

const items = require('./fakeDb')

router.get('/', (req, res) => {
    res.json(items);
})

router.post('/', (req, res, next) => {
    try {
        if(req.body.name === '' || req.body.price === '') {
            throw new ExpressError('Name/Price required', 400)
        }
        items.push(req.body);
        return res.status(201).json({added: req.body});
    } catch(err) {
        return next(err)
    }
})

router.get('/:name', (req, res, next) => {
    try {
        const item = items.find(i => i.name === req.params.name);
        if(!item) {
            throw new ExpressError('Item not found', 404)
        }
        return res.json(item);
    } catch(err) {
        return next(err)
    }
  
})

router.patch('/:name', (req, res, next) => {
    try {
        const foundItem = items.find(i => i.name === req.params.name);
        if(!foundItem) {
            throw new ExpressError('Item not found', 404)
        }
        if(req.body.name === '' || req.body.price === '') {
            throw new ExpressError('Name/Price required', 400)
        }
        foundItem.name = req.body.name;
        foundItem.price = req.body.price;
        return res.json({updated: foundItem});
    } catch(err) {
        return next(err)
    }
    
})

router.delete('/:name', (req, res, next) => {
    try {
        const foundItem = items.findIndex(i => i.name === req.params.name);
        if(foundItem === -1) {
            throw new ExpressError('Item not found', 404)
        }
        items.splice(foundItem, 1);
        return res.json({message: "Deleted"});
    } catch(err) {
        return next(err);
    }
    
})

module.exports = router;
