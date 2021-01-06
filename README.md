# Jest Testing Promises

This is a work in progress on writing Jest unit tests for pure Promise based functions in JavaScript.

Contributions are welcome, however before submitting a Pull Request please begin with an [issue](https://github.com/subz390/listProcess/issues) or [discussion](https://github.com/subz390/listProcess/discussions) to discuss what you have in mind.

## How To Run the Tests

### On your local computer
- clone this repo to a folder on your local computer
- `git clone https://github.com/subz390/listProcess.git`
- install the dependencies, `npm install` `yarn install`
- and then you can run the scripts listed below


### On repl.it
- Head over to [Repl.it](https://repl.it/@subz390/listProcess)
- Click the **Run** button to run the tests, generate a coverage report, and serve the report web page.  You may need to refresh the web view browser to load the page.  When you're done click the **Run**, now called **Stop** button.

Note: I've had "issues" with serving HTML on repl.it.  It seems that you need to have registered an account to start a web service.  And only one service will be generated.  So if for example I start the web service, and anonymous user views the repl they'll get the webpages from my server and they can't start the server.  Oh and good luck if the web view panel doesn't open for you, I'm yet to find out a way of opening it manually.  The web page is at https://listprocess.subz390.repl.co/ for reference.

### Scripts
- `npm run test` in the bash console to run the test and view its results in the console.
- `npm run test:coverage` to run the test _and_ generate a coverage report.
- `npm run serve` to start serving the coverage report web pages.  `Ctrl+C` to stop the server.  Open `http://localhost:3000` in your browser.
- `npm run test+serve` to do all the above.

For `yarn`, replace all the above `npm` with `yarn`.