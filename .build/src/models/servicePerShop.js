"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicePerShop = void 0;
const dynamodb_data_mapper_annotations_1 = require("@aws/dynamodb-data-mapper-annotations");
const config_json_1 = __importDefault(require("../../config.json"));
const tableName = config_json_1.default.PRIMO_SERVICES_PER_SHOP_TABLE;
let ServicePerShop = class ServicePerShop {
};
__decorate([
    (0, dynamodb_data_mapper_annotations_1.hashKey)(),
    __metadata("design:type", String)
], ServicePerShop.prototype, "serviceId", void 0);
__decorate([
    (0, dynamodb_data_mapper_annotations_1.rangeKey)(),
    __metadata("design:type", String)
], ServicePerShop.prototype, "shopId", void 0);
__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    __metadata("design:type", Number)
], ServicePerShop.prototype, "durationInMinutes", void 0);
__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    __metadata("design:type", String)
], ServicePerShop.prototype, "price", void 0);
ServicePerShop = __decorate([
    (0, dynamodb_data_mapper_annotations_1.table)(tableName)
], ServicePerShop);
exports.ServicePerShop = ServicePerShop;
//# sourceMappingURL=servicePerShop.js.map