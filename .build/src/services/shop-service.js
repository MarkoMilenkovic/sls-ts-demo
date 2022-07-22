"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const shop_1 = require("../models/shop");
const geolib_1 = require("geolib");
const dynamodb_expressions_1 = require("@aws/dynamodb-expressions");
const uuid_1 = require("uuid");
const array_helper_1 = __importDefault(require("../libs/array-helper"));
class ShopService {
    constructor(mapper, geoDataManager, categoryService) {
        this.mapper = mapper;
        this.geoDataManager = geoDataManager;
        this.categoryService = categoryService;
    }
    async getShopsNearLocation(latitude, longitude, radius, category) {
        const tableName = this.geoDataManager.getGeoDataManagerConfiguration().tableName;
        const responseDb = await this.geoDataManager.queryRadius(Object.assign({ RadiusInMeter: radius, CenterPoint: {
                latitude: latitude,
                longitude: longitude
            } }, (category && {
            QueryInput: {
                TableName: tableName,
                FilterExpression: "contains(categories, :category)",
                ExpressionAttributeValues: {
                    ':category': { S: category }
                }
            }
        })));
        return mapToShops(responseDb, latitude, longitude);
    }
    async createShop(latitude, longitude, name, shopCategories) {
        const categoriesFromDb = await this.categoryService.getCategoriesByNames(shopCategories);
        if (categoriesFromDb.length !== shopCategories.length) {
            throw {
                code: 'ClientError',
                message: 'Unknown category provided'
            };
        }
        const id = (0, uuid_1.v4)();
        const item = await this.geoDataManager.putPoint({
            RangeKeyValue: { S: id },
            GeoPoint: {
                latitude: latitude,
                longitude: longitude, //23.72385//-0.13
            },
            PutItemInput: {
                Item: Object.assign({ name: { S: name } }, (shopCategories && { categories: { SS: shopCategories } })),
            }
        }).promise();
        const response = item.$response;
        const itemJson = JSON.parse(response.request.httpRequest.body).Item;
        const shop = new shop_1.Shop();
        const { hashKey, geoJson, categories } = itemJson;
        shop.id = id;
        shop.name = name;
        shop.hashKey = hashKey.N;
        shop.geoJson = JSON.parse(geoJson.S);
        shop.categories = mapCategories(categories.SS);
        return shop;
    }
    async getShopsForCategory(category) {
        let equalsExpressionPredicate = (0, dynamodb_expressions_1.contains)(category);
        const categoryConditionExpression = Object.assign(Object.assign({}, equalsExpressionPredicate), { subject: 'categories' });
        const scanOptions = {
            filter: categoryConditionExpression,
        };
        const shops = await (0, array_helper_1.default)(this.mapper.scan(shop_1.Shop, scanOptions));
        const finalShops = shops.map(s => {
            const shop = new shop_1.Shop();
            shop.id = s.id;
            shop.name = s.name;
            const geoJson = JSON.parse(s.geoJson);
            shop.geoJson = geoJson;
            shop.categories = mapCategories(s.categories);
            return shop;
        });
        return finalShops;
    }
}
function mapCategories(categoriesSet) {
    return categoriesSet ? Array.from(categoriesSet) : [];
}
function mapToShops(data, latitude, longitude) {
    const shops = [];
    data.forEach(it => {
        const shop = new shop_1.Shop();
        shop.id = it.id.S;
        const name = it.name.S;
        const geoJson = JSON.parse(it.geoJson.S);
        const coordinates = geoJson.coordinates;
        shop.geoJson = geoJson;
        const distance = (0, geolib_1.getDistance)({ latitude: latitude, longitude: longitude }, { latitude: coordinates[1], longitude: coordinates[0] });
        shop.name = name;
        shop.categories = mapCategories(it.categories.SS);
        shop.distance = distance;
        shops.push(shop);
    });
    return shops;
}
exports.default = ShopService;
//# sourceMappingURL=shop-service.js.map