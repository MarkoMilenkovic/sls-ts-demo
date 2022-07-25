import { mapper, client } from "../libs/dynamoDb";
import AppointmentService from "./appointment-service";
import ShopService from "./shop-service";
import { GeoDataManager, GeoDataManagerConfiguration } from 'dynamodb-geo';
import config from "../../config.json";
import PrimoServices from "./primo-services";
import EmployeeWorkHoursService from "./employee-work-hours-service";
import CategoryService from "./category-service";
import {s3Client} from "../libs/s3"

const geoDataConfig = new GeoDataManagerConfiguration(client, config.PRIMO_SHOP_TABLE);
geoDataConfig.hashKeyLength = 5;
geoDataConfig.rangeKeyAttributeName = "id";

const myGeoTableManager = new GeoDataManager(geoDataConfig);

export const primoServices = new PrimoServices(mapper);
export const categoryService = new CategoryService(mapper,s3Client);
export const employeeWorkHoursService = new EmployeeWorkHoursService(mapper);
export const appointmentService = new AppointmentService(mapper, primoServices, employeeWorkHoursService, client);
export const shopService = new ShopService(mapper, myGeoTableManager, categoryService);