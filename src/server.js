const app = require("./app");
const portNumber = 3000;

app.listen(portNumber, () => {
    console.log(`Server is running on http://localhost:${portNumber}`);
});


// starting server  =>   nodemon src/server.js