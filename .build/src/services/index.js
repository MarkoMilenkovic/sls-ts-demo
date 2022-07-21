"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shopService = exports.appointmentService = exports.employeeWorkHoursService = exports.primoServices = void 0;
const dynamoDb_1 = require("../libs/dynamoDb");
const appointment_service_1 = __importDefault(require("./appointment-service"));
const shop_service_1 = __importDefault(require("./shop-service"));
const dynamodb_geo_1 = require("dynamodb-geo");
const config_json_1 = __importDefault(require("../../config.json"));
const primo_services_1 = __importDefault(require("./primo-services"));
const employee_work_hours_service_1 = __importDefault(require("./employee-work-hours-service"));
// const appointmentService = new AppointmentService(mapper);
const geoDataConfig = new dynamodb_geo_1.GeoDataManagerConfiguration(dynamoDb_1.client, config_json_1.default.PRIMO_SHOP_TABLE);
geoDataConfig.hashKeyLength = 5;
const myGeoTableManager = new dynamodb_geo_1.GeoDataManager(geoDataConfig);
// const shopService = new ShopService(myGeoTableManager);
exports.primoServices = new primo_services_1.default(dynamoDb_1.mapper);
exports.employeeWorkHoursService = new employee_work_hours_service_1.default(dynamoDb_1.mapper);
exports.appointmentService = new appointment_service_1.default(dynamoDb_1.mapper, exports.primoServices, exports.employeeWorkHoursService, dynamoDb_1.client);
exports.shopService = new shop_service_1.default(myGeoTableManager);
//# sourceMappingURL=index.js.map