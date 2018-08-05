'use strict';

describe('Measure items E2E Tests:', function () {
  describe('Test Measure items page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/measure-items');
      expect(element.all(by.repeater('measure-item in measure-items')).count()).toEqual(0);
    });
  });
});
