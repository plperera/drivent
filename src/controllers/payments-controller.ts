import paymentsService from "@/services/payments-service";
import ticketsService from "@/services/tickets-service";

import { Response } from "express";
import { notFoundError, badRequestError } from "@/errors";
import { AuthenticatedRequest } from "@/middlewares";
import httpStatus from "http-status";

export async function getPaymentsByTicketsId(req: AuthenticatedRequest, res: Response) {
  try {
    const { ticketId } = req.query;
    const { userId } = req;

    if (!ticketId) {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }

    const payment = await paymentsService.getPaymentsByTicketsId(Number(ticketId), Number(userId));

    if (!payment) {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }

    return res.send(payment).status(httpStatus.OK);
  } catch (error) {
    if (error.name === "UnauthorizedError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    res.sendStatus(httpStatus.NOT_FOUND);
  }
}
export async function createPayment(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = req;
    const {
      ticketId,
      cardData
    } = req.body;

    if (!ticketId || !cardData) {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }

    const payment = await paymentsService.createPayment(userId, ticketId, cardData);

    if (!payment) {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }

    const paymentResult = {
      id: payment.id,
      ticketId,
      value: payment.value,
      cardIssuer: payment.cardIssuer,
      cardLastDigits: payment.cardLastDigits,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt
            
    };   

    return res.send(paymentResult).status(httpStatus.OK);
  } catch (error) {
    if (error.name === "UnauthorizedError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    res.sendStatus(httpStatus.NOT_FOUND);
  }
}

