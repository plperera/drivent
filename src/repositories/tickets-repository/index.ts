import { prisma } from "@/config";
import { Ticket } from "@prisma/client";

async function findTicketTypes() {
  const ticket = await prisma.ticketType.findMany();

  return ticket;
}

async function findTicketByEnrollmentId(enrollmentId: number) {
  const userTicket = await prisma.ticket.findFirst({
    where: {
      enrollmentId,
    },
    include: {
      TicketType: true,
    }
  });

  return userTicket;
}

async function createTicket(ticketData: CreateTicketParams) {
  return await prisma.ticket.create({
    data: {
      ...ticketData
    }
  });
}

export type CreateTicketParams = Omit<Ticket, "id" | "createdAt" | "updatedAt">

const ticketsRepository = {
  findTicketTypes,
  findTicketByEnrollmentId,
  createTicket
};
  
export default ticketsRepository;
