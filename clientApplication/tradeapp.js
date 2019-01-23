/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const { FileSystemWallet, Gateway } = require('fabric-network');

// A wallet stores a collection of identities for use
const wallet = new FileSystemWallet('./wallet');

async function main() {

    // A gateway defines the peers used to access Fabric networks
    const gateway = new Gateway();

    // Main try/catch block
    try {

        // define the identity to use
        const identityLabel = 'Admin@org1.example.com';

        // Load connection profile; will be used to locate a gateway
        //        let connectionProfile = yaml.safeLoad(fs.readFileSync('network.yaml', 'utf8'));
        let ccpFile = fs.readFileSync('connection.json');
        const ccp = JSON.parse(ccpFile.toString());
        console.log('~~~~~~~~~~~~connectionProfile~~~~~~~~~~~~~~~~');

        // Set connection options; use 'admin' identity from application wallet
        let connectionOptions = {
            identity: identityLabel,
            wallet: wallet,
            discovery: {
                asLocalHost: true
            }
        };

        // Connect to gateway using application specified parameters
        await gateway.connect(ccp, connectionOptions);

        console.log('Connected to Fabric gateway.');
        console.log('~~~~~~~~~~~~gateway~~~~~~~~~~~~~~~~');

        // Get addressability network (channel)
        const network = await gateway.getNetwork('composerchannel');
        console.log('~~~~~~~~~~~~network~~~~~~~~~~~~~~~~');

        // Get addressability to trade contract
        const contract = await network.getContract('trade-network');
        console.log('~~~~~~~~~~~~contract~~~~~~~~~~~~~~~~');


        console.log('Submit transactions.');

        // Create initial test data 
        var response = await contract.submitTransaction('createDemoData');
        console.log('Transaction Response:', response.toString());

        // Create Commodity
        var testCommodityJS = {
            '$class': 'org.example.trading.Commodity',
            '$registryId': 'org.example.trading.Commodity',
            '$registryType': 'Asset',
            description: 'Kg of unrefined Rubber',
            mainExchange: 'SGX',
            owner: 'resource:org.example.trading.Trader#TRADER7',
            quantity: 45,
            tradingSymbol: 'RUBBER'
        };
        var testCommodity = JSON.stringify(testCommodityJS);
        response = await contract.submitTransaction('createCommodity', testCommodity);
        console.log('Transaction Response:', response.toString());

        // Create Trader
        var testTraderJS = { 
            '$class': 'org.example.trading.Trader',
            '$registryId': 'org.example.trading.Trader',
            '$registryType': 'Participant',
            tradeId: 'TRADER7',
            firstName: 'Frank',
            lastName: 'Adams'
        };
        var testTrader = JSON.stringify(testTraderJS);
        response = await contract.submitTransaction('createTrader', testTrader);
        console.log('Transaction Response:', response.toString());

        // Retrieve Commodity By ID
        response = await contract.submitTransaction('getCommodityByID', 'RUBBER');
        console.log('Transaction Response:', response.toString());

        // Retrieve Trader By ID
        response = await contract.submitTransaction('getTraderByID', 'TRADER7');
        console.log('Transaction Response:', response.toString());

        // Update Commodity - note that in this implementation, the whole object must passed
        var modifiedCommodityJS = {
            '$class': 'org.example.trading.Commodity',
            '$registryId': 'org.example.trading.Commodity',
            '$registryType': 'Asset',
            description: 'KG Latex Rubber',
            mainExchange: 'SGX',
            owner: 'resource:org.example.trading.Trader#TRADER7',
            quantity: 45,
            tradingSymbol: 'RUBBER'
        };
        var modifiedCommodity = JSON.stringify(modifiedCommodityJS);
        response = await contract.submitTransaction('updateCommodity', modifiedCommodity);
        console.log('Transaction Response:', response.toString());

        // Update Trader - note that in this implementation, the whole object must passed
        var modifiedTraderJS = { 
            '$class': 'org.example.trading.Trader',
            '$registryId': 'org.example.trading.Trader',
            '$registryType': 'Participant',
            tradeId: 'TRADER7',
            firstName: 'Francis',
            lastName: 'Adam'
        };
        var modifiedTrader = JSON.stringify(modifiedTraderJS);
        response = await contract.submitTransaction('updateTrader', modifiedTrader);
        console.log('Transaction Response:', response.toString());

        // Trade commodity to a new owner
        response = await contract.submitTransaction('trade', 'RUBBER', 'TRADER1');
        console.log('Transaction Response:', response.toString());

        // Query Commodity by Owner - using evaluateTransaction
        console.log('Commodity by Owner Query');
        response = await contract.evaluateTransaction('queryCommodityByOwner', 'resource:org.example.trading.Trader#TRADER1');
        console.log('Transaction Response:');
        console.log(response.toString());

        // Query Commodity by Exchange - using evaluateTransaction
        console.log('Commodity by Exchange Query');
        response = await contract.evaluateTransaction('queryCommodityByExchange', 'SGX');
        console.log('Transaction Response:');
        console.log(response.toString());

        // Query All Commodities 
        console.log('All Commodities Query');
        response = await contract.evaluateTransaction('queryAllCommodity');
        console.log('Transaction Response:');
        console.log(response.toString());

        // Query All Traders using generic transaction 
        console.log('All Traders Query - using generic transaction');
        response = await contract.evaluateTransaction('queryAllFromRegistry', 'Trader', 'Participant');
        console.log('Transaction Response:');
        console.log(response.toString());


        // History Query
        console.log('trying History Query');
        response = await contract.evaluateTransaction('historyForCommodity', 'RUBBER');
        console.log('Transaction Response:', response.toString());

        // Delete Commodity By ID
        response = await contract.submitTransaction('deleteCommodity', 'RUBBER');
        console.log('Transaction Response:', response.toString());

        // Delete Trader By ID
        response = await contract.submitTransaction('deleteTrader', 'TRADER7');
        console.log('Transaction Response:', response.toString());




/*        // Add Ten Quantity - checking quantity before and afterwards!
        response = await contract.submitTransaction('checkQuantity', 'CORN');
        console.log('Transaction Response:', response.toString());

        response = await contract.submitTransaction('plusTen', 'CORN');
        console.log('Transaction Response:', response.toString());

        response = await contract.submitTransaction('checkQuantity', 'CORN');
        console.log('Transaction Response:', response.toString());
*/


    } catch (error) {
        console.log(`Error processing transaction. ${error}`);
        console.log(error.stack);
    } finally {
        // Disconnect from the gateway
        console.log('Disconnect from Fabric gateway.');
        gateway.disconnect();
    }
}

main().then(() => {
    console.log('done');
}).catch((e) => {
    console.log(e);
    console.log(e.stack);
    process.exit(-1);
});
