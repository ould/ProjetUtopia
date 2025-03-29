const {getSheetData,updateSheetData} = require('../helpers/google');
const { logErreur, logInfo } = require('../helpers/logs');
const createError = require('http-errors');
const UserController = require('./User.Controller');


module.exports = {
  remplirGoogleSheet: async (req, res, next) => {
    try {
        const { spreadsheetId, range, values } = req.body
        const userReferent = await UserController.getCurrentUser(req, res, next)
        const antenneId = userReferent.antenneDefautId

        let Evalues = [["ID", "Nom", "Prénom"], ["1", "Dupont", "Jean"], ["2", "Martin", "Sophie"]]
        let Erange = `Sheet1!A:C` // Adjust the range as needed
        let EspreadsheetId = '1LfjXm0a80JfJ_XcdyES2OKDVyaP0yfpnrEXY285xKSQ' // Replace with your actual spreadsheet ID
        // Fetch the existing data to determine the last filled row
        const existingData = await getSheetData(EspreadsheetId, Erange);
        const lastRow = existingData.length;

        // Update the range to start from the next empty row
        Erange = `Sheet1!A${lastRow + 1}:C${lastRow + Evalues.length}`;
         await updateSheetData(EspreadsheetId, Erange,Evalues)
        
        res.send(true)

    } catch (error) {
      logErreur("Famille get",error, req?.params?.id)
      next(error)
    }
  },

}
