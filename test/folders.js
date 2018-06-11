'use strict';

const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const { TEST_MONGODB_URI } = require('../config');
const Folder = require('../models/folder');
const seedFolders = require('../db/seed/folder');
const expect = chai.expect;
chai.use(chaiHttp);

before(function () {
    return mongoose.connect(TEST_MONGODB_URI)
      .then(() => mongoose.connection.db.dropDatabase());
  });

  beforeEach(function () {
    return Folder.insertMany(seedFolders);
  });

  afterEach(function () {
    return mongoose.connection.db.dropDatabase();
  });

  after(function () {
    return mongoose.disconnect();
  });

describe('POST /api/folders', function () {
    it('should create and return a new folder when provided valid data', function () {
      const newFolder = {
        'name': 'cats'
      };

      let res;
      // 1) First, call the API
      return chai.request(app)
        .post('/api/folders')
        .send(newFolder)
        .then(function (_res) {
          res = _res;
          expect(res).to.have.status(201);
          expect(res).to.have.header('location');
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.keys('id', 'name', 'createdAt', 'updatedAt');
          // 2) then call the database
          return Folder.findById(res.body.id);
        })
        // 3) then compare the API response to the database results
        .then(data => {
          expect(res.body.id).to.equal(data.id);
          expect(res.body.name).to.equal(data.name);
          expect(new Date(res.body.createdAt)).to.eql(data.createdAt);
          expect(new Date(res.body.updatedAt)).to.eql(data.updatedAt);
        });
    });
  });

  describe('GET /api/folders/:id', function () {
    it('should return correct note', function () {
      let data;
      // 1) First, call the database
      return Note.findOne()
        .then(_data => {
          data = _data;
          // 2) then call the API with the ID
          return chai.request(app).get(`/api/folders/${data.id}`);
        })
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          //console.log(res.body);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.keys('id', 'title', 'content', 'createdAt', 'updatedAt');

          // 3) then compare database results to API response
          expect(res.body.id).to.equal(data.id);
          expect(res.body.title).to.equal(data.title);
          expect(res.body.content).to.equal(data.content);
          expect(new Date(res.body.createdAt)).to.eql(data.createdAt);
          expect(new Date(res.body.updatedAt)).to.eql(data.updatedAt);
        });
    });
  });

  describe('GET /api/folders', function () {
    // 1) Call the database **and** the API
    // 2) Wait for both promises to resolve using `Promise.all`
    it('return all folders', function() {
    return Promise.all([
        Folder.find(),
        chai.request(app).get('/api/folders')
      ])
      // 3) then compare database results to API response
        .then(([data, res]) => {
            //console.log(res.body);
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body.results).to.be.a('array');
          expect(res.body.results).to.have.length(data.length);
        });
    });
  });

  describe('PUT api/folders/:id', function() {
    it('should update correct folder', function(){
        const updateData = {
            name: 'fofofofof'
          };
          
          return Folder.findOne()
            .then(function(folder) {
              updateData.id = folder.id;
              // make request then inspect it to make sure it reflects
              // data we sent
              return chai.request(app)
                .put(`/api/folders/${folder.id}`)
                .send(updateData);
            })
            .then(function(res) {
              expect(res).to.have.status(204);
              return Folder.findById(updateData.id);
            })
            .then(function(folder) {
              expect(folder.name).to.equal(updateData.name);
            });
    });
  });

  describe('DELETE api/folders/:id', function() {
    it('should delete correct folder', function(){
        let data;

        return Folder
        .findOne()
        .then(function(_data) {
            data = _data;
            return chai.request(app).delete(`/api/folders/${data.id}`);
        })
        .then(function(res) {
            expect(res).to.have.status(204);
            return Folder.findById(data.id);
        })
        .then(function(_data) {
            expect(_data).to.be.null;
        });
    });
  });