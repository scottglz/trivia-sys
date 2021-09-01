'use strict';

var app = require('../../server');
var chai = require('chai');
var request = require('supertest');

var expect = chai.expect;

var describe = global.describe;
var it = global.it;

describe('API Tests', function () {
   it('handles 404 Not Found', function(done){
      request(app).post('/trivia/nonexistent').end(function(err, res) {
         expect(res.statusCode).to.equal(404);
         expect(res.header['content-type']).to.equal('application/json; charset=utf-8');
         done();
      });
   });

   it('handles crashing code', function(done) {
      request(app).post('/trivia/crasho').end(function(err, res) {
         expect(res.statusCode).to.equal(500);
         expect(res.header['content-type']).to.equal('application/json; charset=utf-8');
         done();
      });
   });

   describe('/trivia/questions', function() {
      it('should reject requests w/o a body', function (done) {
         request(app).post('/trivia/questions')
         .end(function (err, res) {
            expect(res.statusCode).to.equal(400);
            done();
         }); 
      });

      it('should accept good request', function (done) {
         request(app).post('/trivia/questions')
         .send({earliestDay: '2018-12-15', latestDay: '2018-12-31'})
         .end(function (err, res) {
            expect(res.statusCode).to.equal(200);
            done();
         }); 
      });
   });
});
