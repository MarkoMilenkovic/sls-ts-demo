"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dynamoDb_1 = require("../libs/dynamoDb");
const appointment_service_1 = __importDefault(require("./appointment-service"));
const appointmentService = new appointment_service_1.default(dynamoDb_1.mapper);
exports.default = appointmentService;
//# sourceMappingURL=index.js.map