'use strict';

describe('Userinfos E2E Tests:', function () {
  describe('Test Userinfos page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/userinfos');
      expect(element.all(by.repeater('userinfo in userinfos')).count()).toEqual(0);
    });
  });
});
