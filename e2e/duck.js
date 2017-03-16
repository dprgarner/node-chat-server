const expect = require('chai').expect;

describe('duckduckgo', () => {
  it('searches for webdriverio', () => {
    browser.url('https://duckduckgo.com/');
    browser.setValue('#search_form_input_homepage', 'WebdriverIO')
    browser.click('#search_button_homepage')
    var title = browser.getTitle();
    expect(title).to.contain('WebdriverIO');
  });

  it('searches for webdriverio again', () => {
    browser.url('https://duckduckgo.com/');
    browser.setValue('#search_form_input_homepage', 'WebdriverIO')
    browser.click('#search_button_homepage')
    var title = browser.getTitle();
    expect(title).to.contain('WebdriverIO');
  });

  describe('is going to fail', () => {
    it('searches for webdriverio yet again', () => {
      browser.url('https://duckduckgo.com/');
      browser.setValue('#search_form_input_homepage', 'WebdriverIO')
      browser.click('#search_button_homepage')
      var title = browser.getTitle();
      expect(title).to.contain('WebaadriverIO');
    });
  });
});
