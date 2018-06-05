'use strict';

const express = require('express');

const router = express.Router();

const Note = require('../models/note');

/* ========== GET/READ ALL ITEM ========== */
router.get('/', (req, res, next) => {
    let filter = {};
    let {searchTerm} = req.query;
    if (searchTerm) {
      filter.title = { $regex: searchTerm };
    }
    Note.find(filter).sort({ _id: 'asc' })    
    .then(results => {
      res.json({results});
    })
    .catch(err => {
      next(err);
    });

  // console.log('Get All Notes');
  // res.json([
  //   { id: 1, title: 'Temp 1' },
  //   { id: 2, title: 'Temp 2' },
  //   { id: 3, title: 'Temp 3' }
  // ]);

});

/* ========== GET/READ A SINGLE ITEM ========== */
router.get('/:id', (req, res, next) => {
  const searchId = req.params.id  
  Note.findById(searchId)
    .then(note => {
      res.json(note);
    })
    .catch(err => {
      next(err);
  });

});

/* ========== POST/CREATE AN ITEM ========== */
router.post('/', (req, res, next) => {

  const {title, content} = req.body;

  Note.create({
    title,
    content,})
  .then(note => res.location(`${req.originalUrl}/${note.id}`).status(201).json(note))
  .catch(err => next(err))
});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/:id', (req, res, next) => {

  console.log('Update a Note');
  res.json({ id: 1, title: 'Updated Temp 1' });

});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/:id', (req, res, next) => {

  console.log('Delete a Note');
  res.status(204).end();
});

module.exports = router;