/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');
const ClientIdentity = require('fabric-shim').ClientIdentity;

class MyContract extends Contract {

    async init(ctx) {
        console.info('init');
    }

    async createCommodity(ctx, commodityStr) {
        // The commodityStr parameter is a stringified JSON object representing the commodity
        // Consideration should be given to validating the data against a model 
        var commodity = JSON.parse(commodityStr);

        console.info('Creating Commodity: ',commodity.tradingSymbol);

        var registryName = 'Asset:org.example.trading.Commodity';
        let comCompKey = ctx.stub.createCompositeKey(registryName, [commodity.tradingSymbol]);
        await ctx.stub.putState(comCompKey, JSON.stringify(commodity));
    }

    async createTrader(ctx, traderStr) {
        // The traderStr parameter is a stringified JSON object representing the trader
        // Consideration should be given to validating the data against a model 
        var trader = JSON.parse(traderStr);

        console.info('Creating Trader: ',trader.tradeId);

        var registryName = 'Participant:org.example.trading.Trader';
        let traderCompKey = ctx.stub.createCompositeKey(registryName, [trader.tradeId]);
        await ctx.stub.putState(traderCompKey, JSON.stringify(trader));
    }

    async createDemoData(ctx) {
        console.info('Demo Data- 2 Commodities, 2 Traders');

        //      Add Commodity 'OIL'
        var commodity = {
            '$class': 'org.example.trading.Commodity',
            '$registryId': 'org.example.trading.Commodity',
            '$registryType': 'Asset',
            description: 'Liquid Fosil Fuel',
            mainExchange: 'COINVEX',
            owner: 'resource:org.example.trading.Trader#TRADER1',
            quantity: 50,
            tradingSymbol: 'OIL'
        };
        var registryName = 'Asset:org.example.trading.Commodity';
        let comCompKey = ctx.stub.createCompositeKey(registryName, [commodity.tradingSymbol]);
        await ctx.stub.putState(comCompKey, JSON.stringify(commodity));

        //      Add Commodity 'CU' - Copper
        commodity = {
            '$class': 'org.example.trading.Commodity',
            '$registryId': 'org.example.trading.Commodity',
            '$registryType': 'Asset',
            description: 'Copper - refined industrial ingots',
            mainExchange: 'COMEX',
            owner: 'resource:org.example.trading.Trader#TRADER3',
            quantity: 140,
            tradingSymbol: 'CU'
        };
        registryName = 'Asset:org.example.trading.Commodity';
        comCompKey = ctx.stub.createCompositeKey(registryName, [commodity.tradingSymbol]);
        await ctx.stub.putState(comCompKey, JSON.stringify(commodity));

        //      Add Trader 'TRADER1'
        var trader = {
            '$class': 'org.example.trading.Trader',
            '$registryId': 'org.example.trading.Trader',
            '$registryType': 'Participant',
            tradeId: 'TRADER1',
            firstName: 'Jenny',
            lastName: 'Jones'
        };
        registryName = 'Participant:org.example.trading.Trader';
        var traderCompKey = ctx.stub.createCompositeKey(registryName, [trader.tradeId]);
        await ctx.stub.putState(traderCompKey, JSON.stringify(trader));

        //      Add Trader 'TRADER2'
        trader = {
            '$class': 'org.example.trading.Trader',
            '$registryId': 'org.example.trading.Trader',
            '$registryType': 'Participant',
            tradeId: 'TRADER2',
            firstName: 'Jack',
            lastName: 'Sock'
        };
        registryName = 'Participant:org.example.trading.Trader';
        traderCompKey = ctx.stub.createCompositeKey(registryName, [trader.tradeId]);
        await ctx.stub.putState(traderCompKey, JSON.stringify(trader));
    }

    async getCommodityByID(ctx, comID) {
        console.info('retrieving commodity by ID');
        var registryName = 'Asset:org.example.trading.Commodity';
        let comCompKey = ctx.stub.createCompositeKey(registryName, [comID]);
        let commodityBytes = await ctx.stub.getState(comCompKey);
        if (commodityBytes.length > 0) {
            var commodity = JSON.parse(commodityBytes);
            console.info('retrieved commodity');
            console.info(commodity);
            return commodity;
        }
        else {
            console.info('No Commodity with that Key: ', comID);
            return 'No Commodity with that Key: ' + comID;
        }
    }

    async getTraderByID(ctx, traderID) {
        console.info('retrieving Trader by ID');
        var registryName = 'Participant:org.example.trading.Trader';
        let traderCompKey = ctx.stub.createCompositeKey(registryName, [traderID]);
        let traderBytes = await ctx.stub.getState(traderCompKey);
        if (traderBytes.length > 0) {
            var trader = JSON.parse(traderBytes);
            console.info('retrieved Trader');
            console.info(trader);
            return trader;
        }
        else {
            console.info('No Trader with that Key: ', traderID);
            return 'No Commodity with that Key: ' + traderID;
        }
    }

    async updateCommodity(ctx, commodityStr) {
        // The commodityStr parameter is a stringified JSON object representing the complete commodity
        // the whole object will be replaced using this method. Additional code would be required to 
        // support update of individual properties
        // Consideration should be given to validating the data against a model 
        var commodity = JSON.parse(commodityStr);

        console.info('updating Commodity: ',commodity.tradingSymbol);

        // Attempt to get existing Commodity asset
        var registryName = 'Asset:org.example.trading.Commodity';
        let comCompKey = ctx.stub.createCompositeKey(registryName, [commodity.tradingSymbol]);
        let commodityBytes = await ctx.stub.getState(comCompKey);
        if (commodityBytes.length == 0) {
            console.info('No Commodity with that Key: ', commodity.tradingSymbol);
            return 'No Commodity with that Key: ' + commodity.tradingSymbol;
        }

        // Commodity does exist - so can be updated
        await ctx.stub.putState(comCompKey, JSON.stringify(commodity));
    }

    async updateTrader(ctx, traderStr) {
        // The traderStr parameter is a stringified JSON object representing the complete Trader
        // the whole object will be replaced using this method. Additional code would be required to 
        // support update of individual properties
        // Consideration should be given to validating the data against a model 
        var trader = JSON.parse(traderStr);

        console.info('updating Trader:',trader.tradeId);

        // Attempt to get existing Trader participant
        var registryName = 'Participant:org.example.trading.Trader';
        let traderCompKey = ctx.stub.createCompositeKey(registryName, [trader.tradeId]);
        let traderBytes = await ctx.stub.getState(traderCompKey);
        if (traderBytes.length == 0) {
            console.info('No Trader with that Key: ', trader.tradeId);
            return 'No Commodity with that Key: ' + trader.tradeId;
        }

        // Trader does exist - so can be updated
        await ctx.stub.putState(traderCompKey, JSON.stringify(trader));
        return trader;
    }

    async deleteCommodity(ctx, comID) {
        console.info('deleting commodity by ID: ', comID);
        var registryName = 'Asset:org.example.trading.Commodity';
        let comCompKey = ctx.stub.createCompositeKey(registryName, [comID]);

        // Attempt to get Commodity first
        let commodityBytes = await ctx.stub.getState(comCompKey);
        if (commodityBytes.length > 0) {
            let result = await ctx.stub.deleteState(comCompKey);
            console.info('deleted commodity');
        }
        else {
            console.info('No Commodity with that Key: ', comID);
            return 'No Commodity with that Key: ' + comID;
        }
    }

    async deleteTrader(ctx, traderID) {
        console.info('Deleting Trader: ',traderID);
        var registryName = 'Participant:org.example.trading.Trader';
        let traderCompKey = ctx.stub.createCompositeKey(registryName, [traderID]);

        //Attempt to Get the Trader first
        let traderBytes = await ctx.stub.getState(traderCompKey);
        if (traderBytes.length > 0) {
            var result = await ctx.stub.deleteState(traderCompKey);
            console.info('deleted Trader');
        }
        else {
            console.info('No Trader with that Key: ', traderID);
            return 'No Commodity with that Key: ' + traderID;
        }
    }

    async trade(ctx, comID, newOwner) {
        console.info('Trade commodity to New Owner');
        //newOwner is assumed to be the short ID of the Trader, NOT the whole relationship value

        var registryName = 'Asset:org.example.trading.Commodity';
        let comCompKey = ctx.stub.createCompositeKey(registryName, [comID]);

        // retrieve the Commodity
        let commodityBytes = await ctx.stub.getState(comCompKey);
        if (commodityBytes.length == 0) {
            console.info('No Commodity with that Key: ', comID);
            return 'No Commodity with that Key: ' + comID;
        }

        console.info('Trade commodity');
        var commodity = JSON.parse(commodityBytes);

        // Set the new owner as a composer style Relationship/Resource
        var resourceName = 'resource:org.example.trading.Trader#';
        commodity.owner = resourceName + newOwner;

        // Emit the tradeEvent - passing the whole Commodity Object as the Payload.
        ctx.stub.setEvent('tradeEvent', Buffer.from(JSON.stringify(commodity)));

        // Update the Commodity
        await ctx.stub.putState(comCompKey, JSON.stringify(commodity));
    }

    async removeHighQuantityCommodities(ctx) {
        let qString = '{"selector":{"\\\\$class":"org.example.trading.Commodity","quantity":{"$gt":60}}}';
        let commodityQI = await ctx.stub.getQueryResult(qString);

        let res = { done: false };
        while (!res.done) {
            res = await commodityQI.next();
            if (res && res.value && res.value.value) {
                let comCompKey = res.value.key;
                console.info('The Key: ', comCompKey);
                // let result = await ctx.stub.deleteState(comCompKey);
            }
            if (res && res.done) {
                try {
                    commodityQI.close();
                }
                catch (err) {
                }
            }
        }
    }

    async queryAllCommodity(ctx) {
        console.info('Query All Commodity: ');

        let qString = '{"selector": {"\\\\$class":"org.example.trading.Commodity"}}';
        let commodityQI = await ctx.stub.getQueryResult(qString);

        let results = [];
        let res = { done: false };
        while (!res.done) {
            res = await commodityQI.next();
            if (res && res.value && res.value.value) {
                let val = res.value.value.toString('utf8');
                if (val.length > 0) {
                    results.push(JSON.parse(val));
                }
            }
            if (res && res.done) {
                try {
                    commodityQI.close();
                }
                catch (err) {
                }
            }
        }
        console.info('~~~~~~Results~~~~~~');
        console.info(results);
        console.info('~~~~~~End Results~~~~~~');
        return results;
    }

    async queryCommodityByExchange(ctx, comEx) {
        console.info('Query Commodity by Exchange: ', comEx);

        // Note the the Mango Query requires \\ to 'escape the $ and this needs to be doubled here ! 
        let qString = '{"selector": { "$and": [{"\\\\$class":"org.example.trading.Commodity"},{"mainExchange":"' + comEx + '"}]}}';
        let commodityQI = await ctx.stub.getQueryResult(qString);

        let results = [];
        let res = { done: false };
        while (!res.done) {
            res = await commodityQI.next();
            if (res && res.value && res.value.value) {
                let val = res.value.value.toString('utf8');
                if (val.length > 0) {
                    results.push(JSON.parse(val));
                }
            }
            if (res && res.done) {
                try {
                    commodityQI.close();
                }
                catch (err) {
                }
            }
        }
        console.info('~~~~~~Results~~~~~~');
        console.info(results);
        console.info('~~~~~~End Results~~~~~~');
        return results;
    }

    async queryCommodityByOwner(ctx, comOwn) {
        console.info('Query Commodity by Owner: ', comOwn);
        // Note: The Commodity Owner should be of the format of a Composer Relationship/Resource
        // "resource:org.example.trading.Trader#TRADER2"

        let qString = '{"selector": { "$and": [{"\\\\$class":"org.example.trading.Commodity"},{"owner":"' + comOwn + '"}]}}';
        let commodityQI = await ctx.stub.getQueryResult(qString);

        let results = [];
        let res = { done: false };
        while (!res.done) {
            res = await commodityQI.next();
            if (res && res.value && res.value.value) {
                let val = res.value.value.toString('utf8');
                if (val.length > 0) {
                    results.push(JSON.parse(val));
                }
            }
            if (res && res.done) {
                try {
                    commodityQI.close();
                }
                catch (err) {
                }
            }
        }
        console.info('~~~~~~Results~~~~~~');
        console.info(results);
        console.info('~~~~~~End Results~~~~~~');
        return results;
    }

    async queryAllFromRegistry(ctx, registry, registryType) {
        // The registryType must be 'Asset' or 'Participant'

        console.info('retrieving AllKeys in a Registry using Partial Composite Key:');
        var registryName = registryType.trim() + ':org.example.trading.' + registry.trim();
        console.info(registryName);

        let commodityIterator = await ctx.stub.getStateByPartialCompositeKey(registryName, []);

        let results = [];
        let res = { done: false };
        while (!res.done) {
            res = await commodityIterator.next();
            if (res && res.value && res.value.value) {
                let comCompKey = res.value.key;
                let val = res.value.value.toString('utf8');
                if (val.length > 0) {
                    results.push(JSON.parse(val));
                }
            }
            if (res && res.done) {
                try {
                    commodityIterator.close();
                }
                catch (err) {
                }
            }
        }
        console.info('~~~~~~Results~~~~~~');
        console.info(results);
        console.info('~~~~~~End Results~~~~~~');
        return results;

    }

    async historyForCommodity(ctx, comKey) {
        console.info('Commodity History: ', comKey);
        var registryName = 'Asset:org.example.trading.Commodity';
        let comCompKey = ctx.stub.createCompositeKey(registryName, [comKey]);

        let commodityQI = await ctx.stub.getHistoryForKey(comCompKey);

        let results = [];
        let res = { done: false };
        while (!res.done) {
            res = await commodityQI.next();
            //console.info('Raw Result');
            //console.info(res);
            if (res && res.value && res.value.value) {
                let val = res.value.value.toString('utf8');
                if (val.length > 0) {
                    results.push(JSON.parse(val));
                }
            }
            if (res && res.done) {
                try {
                    commodityQI.close();
                }
                catch (err) {
                }
            }
        }
        console.info(' Results from query');
        results.forEach(comHist => {
            console.info(comHist);
        });
        return results;
    }

}

module.exports = MyContract;
