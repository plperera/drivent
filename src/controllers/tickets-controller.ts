import ticketsService from "@/services/tickets-service";
import { Response } from "express";
import { notFoundError, badRequestError} from "@/errors";
import { AuthenticatedRequest } from "@/middlewares";

export async function postNewTicket(req: AuthenticatedRequest, res: Response) {

    const ticketTypeId = req.body.ticketTypeId as number;
    
    const ticketParams= { 
        userId: req.userId, 
        ticketTypeId 
    }

    if (ticketParams.ticketTypeId){
        throw badRequestError()
    }
  
    try {
        const ticket = await ticketsService.setTicket(ticketParams);
        return res.status(201).send(ticket);
    } catch (error) {
        return res.sendStatus(500);
      
    }
}
