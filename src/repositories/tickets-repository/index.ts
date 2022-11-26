import { prisma } from "@/config";
import { Ticket, TicketStatus } from "@prisma/client";

async function findTicketTypes() {
  const ticket = await prisma.ticketType.findMany();

  return ticket;
}
async function findPriceInTicketTypeById(ticketId: number) {
  const ticket = await prisma.ticket.findFirst({
    where: { id: ticketId },
    include: {
      TicketType: true,
    }
  });
  return ticket;
}

async function findTicketByTicketId(ticketId: number) {
  const ticket = await prisma.ticket.findFirst({
    where: { id: ticketId },
    include: {
      Enrollment: true,
    }
  });
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

async function updateTicketPaymentStatus(ticketId: number) {
  const ticket = prisma.ticket.update({
    where: { id: ticketId },
    data: {
      status: TicketStatus.PAID
    }
  });
  return ticket;
}

export type CreateTicketParams = Omit<Ticket, "id" | "createdAt" | "updatedAt">

const ticketsRepository = {
  findTicketTypes,
  findTicketByEnrollmentId,
  createTicket,
  findTicketByTicketId,
  findPriceInTicketTypeById,
  updateTicketPaymentStatus
};
  
export default ticketsRepository;
