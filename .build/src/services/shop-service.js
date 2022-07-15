"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shop_1 = require("../models/shop");
const geolib_1 = require("geolib");
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