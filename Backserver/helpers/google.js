const { google } = require('googleapis');
const path = require('path');

module.exports ={

    getSheetData: async (spreadsheetId, range) => {
        await getSheetData(spreadsheetId, range);
    },
    updateSheetData: async (spreadsheetId, range, values) => {
        await updateSheetData(spreadsheetId, range, values);
    },
};

async function initializeGoogleAuth() {
    let credentialsPath = path.join(__dirname, '../config/google.json');
    let SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
    const auth = new google.auth.GoogleAuth({
        keyFile: credentialsPath,
        scopes: SCOPES,
    });

    return await auth.getClient();
}


async function getSheetData(spreadsheetId, range) {

    let auth = initializeGoogleAuth();
    if (!auth) {
        console.error('Google Auth not initialized');
        return;
    }
    if (!spreadsheetId || !range) {
        console.error('Spreadsheet ID and range are required');
        return;
    }

    const sheets = google.sheets({ version: 'v4', auth: auth });

    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range,
        });
        return response.data.values;
    } catch (error) {
        console.error('Error fetching data from Google Sheets:', error);
        throw error;
    }
}

async function updateSheetData(spreadsheetId, range, values) {
    let auth = initializeGoogleAuth();
    if (!auth) {
        console.error('Google Auth not initialized');
        return;
    }
    if (!spreadsheetId || !range) {
        console.error('Spreadsheet ID and range are required');
        return;
    }

    const sheets = google.sheets({ version: 'v4', auth: auth });

    try {
        const response = await sheets.spreadsheets.values.update({
            spreadsheetId,
            range,
            valueInputOption: 'RAW',
            resource: { values },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating data in Google Sheets:', error);
        throw error;
    }
}