import testData from "./testdata"

const getAllData = (req, res) => {
    res.json(testData)
}

module.exports = { getAllData }