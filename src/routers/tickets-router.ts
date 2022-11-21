import { Router } from "express";
import { postNewTicket } from "@/controllers";
import { authenticateToken } from "@/middlewares";

const ticketsRouter = Router();

ticketsRouter
    //.all("/*", authenticateToken)
    //.get("/types", getTicketTypes)
    //.get("/", getTicketData)
    .post("/", postNewTicket)

export { ticketsRouter };
