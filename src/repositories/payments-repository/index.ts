import { prisma } from "@/config";
import { Payment } from "@prisma/client";
import ticketsRepository from "@/repositories/tickets-repository";

async function findPaymentByTicketId(ticketId: number) {
  const ticket = await prisma.payment.findFirst({
    where: { ticketId }
  });

  return ticket;
}

async function createPayment(ticketId: number, cardData: PaymentParams) {
  const payment = await prisma.payment.create({
    data: {
      ticketId,
      ...cardData
    }
  }); 
  return payment;
}

export type PaymentParams = Omit <Payment, "id" | "createdAt" | "updatedAt">

const paymentsRepository = {
  findPaymentByTicketId,
  createPayment
};
  
export default paymentsRepository;
