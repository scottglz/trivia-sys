'use strict';

var chai = require('chai');
var expect = chai.expect;
const fs = require('fs');
const path = require('path');
const { analyze } = require('../tuesday-trivia-analyzer');

var describe = global.describe;
var it = global.it;

describe('tuesday-trivia-analyzer', function() {
   it('reads sample file correctly', function() {
      const body = fs.readFileSync(path.resolve(__dirname, './testfiles/sample-tuesday-trivia-email-body.txt'), 'utf8');
      var result = analyze(0, body);
      expect(result).to.deep.equal([
         {
            day: '1969-12-30',
            q: 'In the early years of his career, Georges Braque said he was paired with what other painter as if they were "mountain climbers roped together"?'
         },
         {
            day: '1969-12-31',
            q: 'What animal is the only ratite native to Africa?'
         },
         {
            day: '1970-01-01',
            q: 'What successful reality TV show actually started off as a spin-off of a very different ABC series about Beverly Hills plastic surgeons?'
         },
         {
            day: '1970-01-02',
            q: 'For the last fifteen years before it was abandoned, the chateau known as the Petit Trianon was used as a refuge by what famous woman?'
         },
         {
            day: '1970-01-03',
            q: 'In an unpleasant mental image, a small, temporary uptick in a declining stock price is known as a "bounce" of what?'
         },
         {
            day: '1970-01-04',
            q: 'What wine is named for one of the largest cities in Iran, though the modern version is mostly exported from Australia?'
         },
         {
            day: '1970-01-05',
            q: 'What unusual distinction is shared by these movies?  Blade Runner 2049, Ed Wood, Ferdinand, The Godfather, Jumanji: Welcome to the Jungle, Magic Mike, Predator, The Princess Bride, Roadhouse, Spider-Man.'
         }
      ]);
   });
});