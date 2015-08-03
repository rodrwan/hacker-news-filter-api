'use strict';

var chai, utils, testString;

chai = require('chai');
utils = require('../utils');
testString = 'The dogs is in the house';
chai.should();

describe('Utils module', function () {
  it('normalize should have length 2.', function () {
    utils.normalize(testString).should.have.length(2);
  });

  it('normalize should return an array.', function () {
    utils.normalize(testString).should.be.an('array');
  });

  it('normalize shold not return stopwords "is, in, the".', function () {
    utils.normalize(testString).should.not.include.members(['is', 'in', 'the']);
  });

});
