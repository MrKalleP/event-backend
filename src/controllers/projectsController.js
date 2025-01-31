const testData = require("../data/testdata");

const getProjects = (req, res) => {
    const projects = testData.projects.map(({ id, name, description, logs }) => ({
        id,
        name,
        description,
        logs: logs.map(log => log.id),
    }));
    res.json(projects);
};

module.exports = { getProjects };


/*
här så hämtar jag testdatan 
getProjects är en function som har två argument en req som innehåller information om den inkommande förfrågan res används för att skicka ett svar till klienten
så hur fungerar denna 
1 den hämtar en lista av project
2 för varje project i den här listan så skapas ett nytt object som då ska innehålla id, namn, description obs oförändrade 
3 sen så har vi logs där vi får en lista av bara id från varje logg, vi ersätter den ursprungliga koden och ersätter med id

res.json(project) är respons till klienten i form av json

module.exports = {getProjects} => används i projectRoutes där sökvägen till den här datan sätts
*/ 