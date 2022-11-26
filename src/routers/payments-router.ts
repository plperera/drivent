import { Router } from "express";
import { getPaymentsByTicketsId, createPayment } from "@/controllers";
import { authenticateToken } from "@/middlewares";

const paymentsRouter = Router();

paymentsRouter
  .all("*", authenticateToken)
  .get("/", getPaymentsByTicketsId)
  .post("/process", createPayment);

export { paymentsRouter }; 
