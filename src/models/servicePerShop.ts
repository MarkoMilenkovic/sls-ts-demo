import {
    attribute,
    hashKey,
    rangeKey,
    table
} from "@aws/dynamodb-data-mapper-annotations";
import config from "../../config.json";
const tableName = config.PRIMO_SERVICES_PER_SHOP_TABLE;

@table(tableName)
export class ServicePerShop {
    @hashKey()
    serviceId?: string;
    @rangeKey()
    shopId?: string;
    @attribute()
    durationInMinutes?: number;
    @attribute()
    price?: string;
}