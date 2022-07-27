import { Shop } from "../models/shop";
import { DynamoDB } from "aws-sdk";
import { getDistance } from 'geolib';
import { GeoDataManager } from 'dynamodb-geo';
import { DataMapper, ScanOptions } from "@aws/dynamodb-data-mapper";
import {
    ConditionExpression, contains
} from '@aws/dynamodb-expressions';
import { v4 as uuidv4 } from 'uuid';
import CategoryService from "./category-service";
import gen2array from "../libs/array-helper"; 

class ShopService {
    constructor(
        private readonly mapper: DataMapper,
        private readonly geoDataManager: GeoDataManager,
        private readonly categoryService: CategoryService
    ) { }

    async getShopsNearLocation(latitude: number, longitude: number, radius: number, category: string): Promise<Shop[]> {
        const tableName = this.geoDataManager.getGeoDataManagerConfiguration().tableName;

        const responseDb: DynamoDB.ItemList = await this.geoDataManager.queryRadius({
            RadiusInMeter: radius,
            CenterPoint: {
                latitude: latitude,
                longitude: longitude
            },
            ...(category && {
                QueryInput: {
                    TableName: tableName,
                    FilterExpression: "contains(categories, :category)",
                    ExpressionAttributeValues: {
                        ':category': { S: category }
                    }
                }
            })
        });
        return mapToShops(responseDb, latitude, longitude);
    }

    async createShop(latitude: number, longitude: number, name: string, shopCategories: string[]): Promise<Shop> {
        if (!latitude || !longitude || !name || !shopCategories || shopCategories.length === 0) {
            throw {
                code: "ClientError",
                message: "Missing required parameters!"
            }
        }
        const categoriesFromDb = await this.categoryService.getCategoriesByNames(shopCategories);
        if (categoriesFromDb.length !== shopCategories.length) {
            throw {
                code: "ClientError",
                message: "Unknown category provided"
            }
        }
        const id: string = uuidv4();
        const item = await this.geoDataManager.putPoint({
            RangeKeyValue: { S: id },
            GeoPoint: {
                latitude: latitude, //40.24450,//51.51,
                longitude: longitude, //23.72385//-0.13
            },
            PutItemInput: {
                Item: {
                    name: { S: name },
                    ...(shopCategories && { categories: { SS: shopCategories } })
                },
            }
        }).promise();

        const response: any = item.$response;
        const itemJson = JSON.parse(response.request.httpRequest.body).Item;

        const shop = new Shop();
        const { hashKey, geoJson, categories } = itemJson;
        shop.id = id;
        shop.name = name;
        shop.hashKey = hashKey.N;
        shop.geoJson = JSON.parse(geoJson.S);
        shop.categories = mapCategories(categories.SS);
        return shop;
    }

    async getShopsForCategory(category: string): Promise<Shop[]> {
        let equalsExpressionPredicate = contains(category);
        const categoryConditionExpression: ConditionExpression = {
            ...equalsExpressionPredicate,
            subject: 'categories'
        };
        const scanOptions: ScanOptions = {
            filter: categoryConditionExpression,
        }
        const shops = await gen2array(this.mapper.scan(Shop, scanOptions));
        const finalShops = shops.map(s => {
            const shop = new Shop();
            shop.id = s.id;
            shop.name = s.name;
            const geoJson = JSON.parse(s.geoJson!);
            shop.geoJson = geoJson;
            shop.categories = mapCategories(s.categories);
            return shop;
        });
        return finalShops;
    }

}

function mapCategories(categoriesSet: any): any {
    return categoriesSet ? Array.from(categoriesSet) : [];
}

function mapToShops(data: DynamoDB.ItemList, latitude: number, longitude: number): Shop[] {
    const shops: Shop[] = [];
    data.forEach(it => {
        const shop = new Shop();
        shop.id = it.id.S!;
        const name = it.name.S as string;
        const geoJson = JSON.parse(it.geoJson.S as string);
        const coordinates = geoJson.coordinates;
        shop.geoJson = geoJson;
        const distance = getDistance(
            { latitude: latitude, longitude: longitude },
            { latitude: coordinates[1], longitude: coordinates[0] }
        );
        shop.name = name;
        shop.categories = mapCategories(it.categories.SS);
        shop.distance = distance;
        shops.push(shop);
    });
    return shops;
}

export default ShopService;