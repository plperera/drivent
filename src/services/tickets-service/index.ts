import ticketsRepository from "@/repositories/tickets-repository";
import { notFoundError, badRequestError} from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";

async function getTicketType(userId: number){

  const ticket = await ticketsRepository.findTicketTypes(userId);

  return ticket;
}
async function getTicketData(userId: number){

  const ticket = await ticketsRepository.findTicketById(userId);

  if (!ticket) {
    throw notFoundError();
  }  
  
  return ticket;
}

async function setTicket(ticketParams: newTicketParams){

}


export type newTicketParams = {
  userId: number,
  ticketTypeId: number
}

const ticketsService = {
  getTicketType,
  getTicketData,
  setTicket
};
  
export default ticketsService;