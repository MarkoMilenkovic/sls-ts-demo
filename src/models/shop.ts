import {
    attribute,
    hashKey,
    rangeKey,
    table
} from "@aws/dynamodb-data-mapper-annotations";
import config from "../../config.json";
const tableName = config.PRIMO_SHOP_TABLE;

@table(tableName)
export class Shop {
    @hashKey()
    hashKey?: string;
    @rangeKey()
    id?: string;
    @attribute()
    name?: string;
    @attribute()
    geoJson?: string;
    @attribute({memberType: 'String'})
    categories?: Set<String>;
    distance?: number;
}