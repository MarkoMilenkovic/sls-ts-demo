import { Shop } from "../models/shop";
import { DynamoDB } from "aws-sdk";
import { getDistance } from 'geolib';
import { GeoDataManager } from 'dynamodb-geo';

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