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

        values = [["ID", "Nom", "Prénom"], ["1", "Dupont", "Jean"], ["2", "Martin", "Sophie"]]
        range = `A1:C${values.length}` // Adjust the range as needed
        spreadsheetId = '1LfjXm0a80JfJ_XcdyES2OKDVyaP0yfpnrEXY285xKSQ' // Replace with your actual spreadsheet ID
        const data = await updateSheetData(spreadsheetId, range,values)
        if (!data) {
            throw createError.NotFound(`No data found in the specified range.`);
        }

        res.send(true)

    } catch (error) {
      logErreur("Famille get",error, req?.params?.id)
      next(error)
    }
  },

}
