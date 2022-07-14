import {
    attribute,
    hashKey,
    rangeKey,
    table
} from "@aws/dynamodb-data-mapper-annotations";
import config from "../../config.json";
const tableName = config.DYNAMODB_TABLE;

//todo: add serviceId
@table(tableName)
export class Appointment {
    @hashKey()
    employeeId?: string;
    @rangeKey()
    appointmentStartTime?: string;
    @attribute()
    userId?: string;
}