'use strict';

var chai, crawler;

chai = require('chai');
crawler = require('../crawler');
chai.should();

describe('Crawler module', function () {
  describe('firstPage()', function () {
    var topics;

    before(function (done) {
      var url = 'https://news.ycombinator.com/';
      // runs before all tests in this block
      topics = crawler.firstPage(url);
      done();
    });

    it('should return 30 topics.', function () {
      topics.length.should.be.equal(30);
    });

    it('first position should be an object', function () {
      topics[0].should.be.an('object');
    });

    it('first topic should have keys: \'text\' and \'href\'', function () {
      topics[0].should.have.all.keys('text', 'href', 'score');
    });

    it('first tipic score should be and integer, not empty, not null and not undefined', function () {
      console.log(topics[0]);
      topics[0].score.should.be.a('number')
        .that.is.not.be.empty
          .that.is.not.be.null
            .that.is.not.be.undefined;
    });
  });

  describe('getTopics()', function () {
    var topics = [];

    before(function (done) {
      var url = 'https://news.ycombinator.com/';
      // runs before all tests in this block
      topics = crawler.getTopics(url, topics, 0);
      done();
    });

    it('should return more than 20 pages.', function () {
      topics.should.have.length(20);
    });

    it('first position should return 30 topics.', function () {
      topics[0].should.have.length(30);
    });

    it('first value of first topic should be an object.', function () {
      topics[0][0].should.be.an('object');
    });
  });
});
