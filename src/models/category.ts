import {
    attribute,
    hashKey,
    table
} from "@aws/dynamodb-data-mapper-annotations";
import config from "../../config.json";
const tableName = config.PRIMO_CATEGORIES_TABLE;

@table(tableName)
export class Category {
    @hashKey()
    name?: string;
    @attribute()
    description?: string;
    @attribute()
    hasImage?: boolean;

    photoUrl?: string;

}