'use strict';
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Tag = require('../models/tags');
/* ========== GET/READ ALL ITEM ========== */
router.get('/', (req, res, next) => {
    Tag.find().sort({ _id: 'asc' })    
    .then(results => {
      res.json({results});
    })
    .catch(err => {
      next(err);
    });
});
/* ========== GET/READ A SINGLE ITEM ========== */
router.get('/:id', (req, res, next) => {
  const searchId = req.params.id
  if (!mongoose.Types.ObjectId.isValid(searchId)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }  
  Tag.findById(searchId)
    .then(tag => {
        if (tag) {
            res.status(200).json(tag);
        } else {
            res.status(404).json(tag);
        }
    })
    .catch(err => {
      next(err);
  });
});
/* ========== POST/CREATE AN ITEM ========== */
router.post('/', (req, res, next) => {

  const {name} = req.body;

  Tag.create({
    name,
    })
  .then(note => res.location(`${req.originalUrl}/${note.id}`).status(201).json(note))
  .catch(err => next(err))
});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/:id', (req, res, next) => {

  const { id } = req.params;
  const { title, content } = req.body;

  /***** Never trust users - validate input *****/
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  if (!title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  const updateNote = { title, content };

  Note.findByIdAndUpdate(id, updateNote, { new: true })
    .then(result => {
      if (result) {
        res.status(204).json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/:id', (req, res, next) => {
  const { id } = req.params;

  /***** Never trust users - validate input *****/
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  Note.findByIdAndRemove(id)
    .then(() => {
      res.status(204).end();
    })
    .catch(err => {
      next(err);
    });
});


module.exports = router;