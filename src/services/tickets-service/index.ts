import ticketsRepository from "@/repositories/tickets-repository";
import { notFoundError, badRequestError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import { TicketStatus } from "@prisma/client";

async function findTickestType() {
  const tickets = await ticketsRepository.findTicketTypes();

  if (!tickets) {
    throw notFoundError();
  }

  return tickets;
}
async function findTicketById(userId: number) {
  const userEnrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!userEnrollment) {
    throw notFoundError();
  }

  const userTicket = await ticketsRepository.findTicketByEnrollmentId(userEnrollment.id);

  if (!userTicket) {
    throw notFoundError();
  }

  return userTicket;
}

async function createTicket(userId: number, ticketTypeId: number) {
  const userEnrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  if(!userEnrollment) {
    throw notFoundError();
  }

  const ticketData = {
    ticketTypeId,
    enrollmentId: userEnrollment.id,
    status: TicketStatus.RESERVED
  };

  await ticketsRepository.createTicket(ticketData);

  const ticket = await ticketsRepository.findTicketByEnrollmentId(userEnrollment.id);

  return ticket;
}

const ticketsService = {
  findTickestType,
  findTicketById,
  createTicket
};
  
export default ticketsService;
