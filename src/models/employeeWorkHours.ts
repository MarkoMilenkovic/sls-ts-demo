import {
    attribute,
    hashKey,
    rangeKey,
    table
} from "@aws/dynamodb-data-mapper-annotations";
import config from "../../config.json";
const tableName = config.PRIMO_EMPLOYEE_WORK_HOURS_TABLE;

@table(tableName)
export class EmployeeWorkHours {
    @hashKey()
    employeeId?: string;
    @rangeKey()
    startDate?: string;
    @attribute()
    endDate?: string;
    @attribute()
    dailyHours?: string;
}