const mongoose = require('mongoose');

const { MONGODB_URI } = require('../config');
const Note = require('../models/note');
const Tag = require('../models/tags');

const seedNotes = require('../db/seed/notes');
const seedTags = require('../db/seed/tags');
//console.log(Note);
mongoose.connect(MONGODB_URI)
  .then(() => mongoose.connection.db.dropDatabase())
  .then(() => {
    return Promise.all([
      Note.insertMany(seedNotes),
      Tag.insertMany(seedTags),
      Tag.createIndexes()]);
    })
  .then(results => {
    console.info(`Inserted ${results.length} Notes`);
  })
  .then(() => mongoose.disconnect())
  .catch(err => {
    console.error(err);
  });