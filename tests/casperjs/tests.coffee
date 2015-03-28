

casper.test.begin "Page load", (test) ->
  casper.start "http://localhost:4000", ->
    @waitForSelector "body", ->
      test.assertSelectorHasText('title', 'PlusMore');

  casper.run ->
    test.done()

casper.test.begin "Welcome", (test) ->
  casper.start "http://localhost:4000", ->
    test.assertSelectorHasText('h1', 'PlusMore', "Header is PlusMore")
    test.assertExists('#device-bg', "Device Background Rendered");
    test.assertExists("#login", "Must login to access app");

  casper.then ->
    @evaluate (username, password) ->
      document.querySelector('input[type="username"]').value = username;
      document.querySelector('input[type="password"]').value = password;
      document.querySelector('#login-buttons-password').click();
    , 'test@plusmoretablets.com', 'testpassword'

  casper.then ->
    @wait 50000, ->
      @echo '50s'

  casper.then ->
    test.assertExists '#main', 'Logged In'

  casper.run ->
    test.done()
