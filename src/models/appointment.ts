import {
    attribute,
    hashKey,
    rangeKey,
    table
} from "@aws/dynamodb-data-mapper-annotations";
import config from "../../config.json";
const tableName = config.DYNAMODB_TABLE;

@table(tableName)
export class Appointment {
    @hashKey()
    employeeId?: string;
    @rangeKey()
    appointmentStartTime?: string;
    @attribute()
    userId?: string;
}