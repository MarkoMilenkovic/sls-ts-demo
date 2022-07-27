"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const array_helper_1 = __importDefault(require("../libs/array-helper"));
const primoService_1 = require("../models/primoService");
const servicePerShop_1 = require("../models/servicePerShop");
class PrimoServices {
    constructor(mapper) {
        this.mapper = mapper;
    }
    async createServices(names) {
        if (!names || names.length === 0) {
            throw {
                code: "ClientError",
                message: "Missing required parameters!"
            };
        }
        const services = [];
        names.map(name => {
            const serviceToSave = new primoService_1.PrimoService();
            serviceToSave.serviceName = name;
            services.push(serviceToSave);
        });
        return await (0, array_helper_1.default)(this.mapper.batchPut(services));
    }
    async getServices() {
        return await (0, array_helper_1.default)(this.mapper.scan(primoService_1.PrimoService));
    }
    async addServicesToShop(shopId, services) {
        if (!shopId || !services || !Array.isArray(services) || services.length === 0) {
            throw {
                code: "ClientError",
                message: "Missing required parameters!"
            };
        }
        if (services.filter(e => !e.durationInMinutes || !e.price).length > 0) {
            throw {
                code: "ClientError",
                message: "Duration and price are mandatory"
            };
        }
        const servicesPerShop = [];
        services.map(service => {
            const servicePerShop = new servicePerShop_1.ServicePerShop();
            servicePerShop.serviceId = service.serviceId;
            servicePerShop.shopId = shopId;
            servicePerShop.durationInMinutes = service.durationInMinutes;
            servicePerShop.price = service.price;
            servicesPerShop.push(servicePerShop);
        });
        return await (0, array_helper_1.default)(this.mapper.batchPut(servicesPerShop));
    }
    async getServicesForShop(shopId) {
        const options = {
            indexName: "shopId-index"
        };
        return await (0, array_helper_1.default)(this.mapper.query(servicePerShop_1.ServicePerShop, { shopId }, options));
    }
    async getServiceForShop(shopId, serviceId) {
        const servicePerShop = new servicePerShop_1.ServicePerShop();
        servicePerShop.serviceId = serviceId;
        servicePerShop.shopId = shopId;
        return await this.mapper.get(servicePerShop);
    }
}
exports.default = PrimoServices;
//# sourceMappingURL=primo-services.js.map