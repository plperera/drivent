import { Router } from "express";
import { getTicketsType, getTicket, createTicket } from "@/controllers";
import { authenticateToken } from "@/middlewares";

const ticketsRouter = Router();

ticketsRouter
  .all("/*", authenticateToken)
  .get("/types", getTicketsType)
  .get("", getTicket)
  .post("", createTicket);

export { ticketsRouter };
