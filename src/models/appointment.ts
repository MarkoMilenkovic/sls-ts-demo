import {
    attribute,
    hashKey,
    rangeKey,
    table
} from "@aws/dynamodb-data-mapper-annotations";
import config from "../../config.json";
const tableName = config.PRIMO_APPOINTMENT_TABLE;

@table(tableName)
export class Appointment {
    @hashKey()
    employeeId?: string;
    @rangeKey()
    appointmentStartTime?: string;
    @attribute()
    userId?: string;
    @attribute()
    serviceId?: string;
    @attribute()
    appointmentEndTime?: string;

}