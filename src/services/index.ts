import { mapper } from "../libs/dynamoDb";
import AppointmentService from "./appointment-service";

const appointmentService = new AppointmentService(mapper);

export default appointmentService;