'use strict';

describe('Categoryinfos E2E Tests:', function () {
  describe('Test Categoryinfos page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/categoryinfos');
      expect(element.all(by.repeater('categoryinfo in categoryinfos')).count()).toEqual(0);
    });
  });
});
