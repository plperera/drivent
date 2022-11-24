import ticketsService from "@/services/tickets-service";
import { Response } from "express";
import { notFoundError, badRequestError } from "@/errors";
import { AuthenticatedRequest } from "@/middlewares";
import httpStatus from "http-status";

export async function getTicketsType(req: AuthenticatedRequest, res: Response) {
  try {
    const tickets = await ticketsService.findTickestType();

    res.send(tickets).status(httpStatus.CREATED);
  } catch (error) {
    res.sendStatus(httpStatus.NO_CONTENT);
  }
}
export async function getTicket(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = req;

    const ticket = await ticketsService.findTicketById(userId);

    res.send(ticket).status(httpStatus.OK);
  } catch (error) {
    res.sendStatus(httpStatus.NOT_FOUND);
  }
}
export async function createTicket(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = req;
    const { ticketTypeId } = req.body;

    if(!ticketTypeId) {
      return res.sendStatus(httpStatus.BAD_REQUEST); 
    }
        
    const ticket = await ticketsService.createTicket(userId, ticketTypeId);

    res.status(httpStatus.CREATED).send(ticket);
  } catch (error) {
    res.sendStatus(httpStatus.NOT_FOUND);
  }
}
