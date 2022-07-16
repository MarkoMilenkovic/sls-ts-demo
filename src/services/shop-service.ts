import { Shop } from "../models/shop";
import { DynamoDB } from "aws-sdk";
import { getDistance } from 'geolib';
import { GeoDataManager } from 'dynamodb-geo';
import { v4 as uuidv4 } from 'uuid';

class ShopService {
    constructor(
        private geoDataManager: GeoDataManager
    ) { }

    async getShopsNearLocation(latitude: number, longitude: number, radius: number): Promise<Shop[]> {
        const responseDb: DynamoDB.ItemList = await this.geoDataManager.queryRadius({
            RadiusInMeter: radius,
            CenterPoint: {
                latitude: latitude,
                longitude: longitude
            }
        });
        return mapToShops(responseDb, latitude, longitude);
    }

    async createShop(latitude: number, longitude: number, name: string): Promise<Shop> {
        const id: string = uuidv4();
        const item = await this.geoDataManager.putPoint({
            RangeKeyValue: { S: id }, // Use this to ensure uniqueness of the hash/range pairs.
            GeoPoint: { // An object specifying latitutde and longitude as plain numbers. Used to build the geohash, the hashkey and geojson data
                latitude: latitude, //40.24450,//51.51,
                longitude: longitude, //23.72385//-0.13
            },
            PutItemInput: { // Passed through to the underlying DynamoDB.putItem request. TableName is filled in for you.
                Item: { // The primary key, geohash and geojson data is filled in for you
                    name: { S: name }, // Specify attribute values using { type: value } objects, like the DynamoDB API.
                    // capital: { S: 'London' }
                },
                // ... Anything else to pass through to `putItem`, eg ConditionExpression
            }
        }).promise();

        const response: any = item.$response;
        const itemJson = JSON.parse(response.request.httpRequest.body).Item;
        
        const shop = new Shop();
        shop.rangeKey = id;
        shop.name = name;
        shop.hashKey = itemJson.hashKey.N;
        shop.geoJson = JSON.parse(itemJson.geoJson.S);
        return shop;
    }

}

function mapToShops(data: DynamoDB.ItemList, latitude: number, longitude: number): Shop[] {
    const shops: Shop[] = [];
    data.forEach(it => {
        const shop = new Shop();
        const name = it.name.S as string;
        const geoJson = JSON.parse(it.geoJson.S as string);
        const coordinates = geoJson.coordinates;
        shop.geoJson = geoJson;
        const distance = getDistance(
            { latitude: latitude, longitude: longitude },
            { latitude: coordinates[1], longitude: coordinates[0] }
        );
        shop.name = name;
        shop.distance = distance;
        shops.push(shop);
    });
    return shops;
}

export default ShopService;