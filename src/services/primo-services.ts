import { DataMapper } from "@aws/dynamodb-data-mapper";
import gen2array from "../libs/array-helper";
import { PrimoService } from "../models/primoService";
import { ServicePerShop } from "../models/servicePerShop";
import { QueryOptions } from "@aws/dynamodb-data-mapper";

class PrimoServices {
    constructor(
        private readonly mapper: DataMapper
    ) { }

    async createServices(names: string[]): Promise<PrimoService[]> {
        const services: PrimoService[] = [];
        names.map(name => {
            const serviceToSave = new PrimoService();
            serviceToSave.serviceName = name;
            services.push(serviceToSave);
        })
        return await gen2array(this.mapper.batchPut(services));
    }

    async getServices(): Promise<PrimoService[]> {
        return await gen2array(this.mapper.scan(PrimoService));
    }

    async addServicesToShop(shopId: string, services: ServicePerShop[]): Promise<ServicePerShop[]> {
        const servicesPerShop: ServicePerShop[] = [];
        services.map(service => {
            const servicePerShop = new ServicePerShop();
            servicePerShop.serviceId = service.serviceId;
            servicePerShop.shopId = shopId;
            servicePerShop.durationInMinutes = service.durationInMinutes;
            servicePerShop.price = service.price;
            servicesPerShop.push(servicePerShop);
        })
        return await gen2array(this.mapper.batchPut(servicesPerShop));
    }

    async getServicesForShop(shopId: string): Promise<ServicePerShop[]> {
        const options: QueryOptions = {
            indexName: "shopId-index"
        }
        return await gen2array(this.mapper.query(ServicePerShop, { shopId }, options));
    }

    async getServiceForShop(shopId: string, serviceId: string): Promise<ServicePerShop> {
        const servicePerShop = new ServicePerShop();
        servicePerShop.serviceId = serviceId;
        servicePerShop.shopId = shopId;
        return await this.mapper.get(servicePerShop); 
    }

}

export default PrimoServices;
