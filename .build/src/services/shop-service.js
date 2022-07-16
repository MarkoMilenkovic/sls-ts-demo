"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shop_1 = require("../models/shop");
const geolib_1 = require("geolib");
const uuid_1 = require("uuid");
class ShopService {
    constructor(geoDataManager) {
        this.geoDataManager = geoDataManager;
    }
    async getShopsNearLocation(latitude, longitude, radius) {
        const responseDb = await this.geoDataManager.queryRadius({
            RadiusInMeter: radius,
            CenterPoint: {
                latitude: latitude,
                longitude: longitude
            }
        });
        return mapToShops(responseDb, latitude, longitude);
    }
    async createShop(latitude, longitude, name) {
        const id = (0, uuid_1.v4)();
        const item = await this.geoDataManager.putPoint({
            RangeKeyValue: { S: id },
            GeoPoint: {
                latitude: latitude,
                longitude: longitude, //23.72385//-0.13
            },
            PutItemInput: {
                Item: {
                    name: { S: name }, // Specify attribute values using { type: value } objects, like the DynamoDB API.
                    // capital: { S: 'London' }
                },
                // ... Anything else to pass through to `putItem`, eg ConditionExpression
            }
        }).promise();
        const response = item.$response;
        const itemJson = JSON.parse(response.request.httpRequest.body).Item;
        const shop = new shop_1.Shop();
        shop.rangeKey = id;
        shop.name = name;
        shop.hashKey = itemJson.hashKey.N;
        shop.geoJson = JSON.parse(itemJson.geoJson.S);
        return shop;
    }
}
function mapToShops(data, latitude, longitude) {
    const shops = [];
    data.forEach(it => {
        const shop = new shop_1.Shop();
        const name = it.name.S;
        const geoJson = JSON.parse(it.geoJson.S);
        const coordinates = geoJson.coordinates;
        shop.geoJson = geoJson;
        const distance = (0, geolib_1.getDistance)({ latitude: latitude, longitude: longitude }, { latitude: coordinates[1], longitude: coordinates[0] });
        shop.name = name;
        shop.distance = distance;
        shops.push(shop);
    });
    return shops;
}
exports.default = ShopService;
//# sourceMappingURL=shop-service.js.map