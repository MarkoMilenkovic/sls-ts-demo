import { mapper, client } from "../libs/dynamoDb";
import AppointmentService from "./appointment-service";
import ShopService from "./shop-service";
import { GeoDataManager, GeoDataManagerConfiguration } from 'dynamodb-geo';
import config from "../../config.json";
import PrimoServices from "./primo-services";

// const appointmentService = new AppointmentService(mapper);
const geoDataConfig = new GeoDataManagerConfiguration(client, config.PRIMO_SHOP_TABLE);
geoDataConfig.hashKeyLength = 5;

const myGeoTableManager = new GeoDataManager(geoDataConfig);
// const shopService = new ShopService(myGeoTableManager);

export const primoServices = new PrimoServices(mapper);
export const appointmentService = new AppointmentService(mapper, primoServices, client);
export const shopService = new ShopService(myGeoTableManager);