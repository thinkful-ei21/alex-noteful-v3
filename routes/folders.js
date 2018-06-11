'use strict';
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Folder = require('../models/folder');
/* ========== GET/READ ALL ITEM ========== */
router.get('/', (req, res, next) => {
    Folder.find().sort({ _id: 'asc' })    
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
  Folder.findById(searchId)
    .then(Folder => {
        if (Folder) {
            res.status(200).json(Folder);
        } else {
            res.status(404).json(Folder);
        }
    })
    .catch(err => {
      next(err);
  });
});
/* ========== POST/CREATE AN ITEM ========== */
router.post('/', (req, res, next) => {

  const {name} = req.body;

  Folder.create({
    name,
    })
  .then(folder => res.location(`${req.originalUrl}/${folder.id}`).status(201).json(folder))
  .catch(err => next(err))
});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/:id', (req, res, next) => {

  const { id } = req.params;
  const { name } = req.body;

  /***** Never trust users - validate input *****/
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  const updateFolder = { name };

  Note.findByIdAndUpdate(id, updateFolder, { new: true })
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

  Folder.findByIdAndRemove(id)
    .then(() => {
      res.status(204).end();
    })
    .catch(err => {
      next(err);
    });
});


module.exports = router;