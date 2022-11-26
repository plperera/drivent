import { notFoundError, unauthorizedError } from "@/errors";
import paymentsRepository, { PaymentParams } from "@/repositories/payments-repository";
import ticketRepository from "@/repositories/tickets-repository";
import enrollementRepository from "@/repositories/enrollment-repository";

export async function verifyTicketAndEnrollment(userId: number, ticketId: number) {
  const ticket = await ticketRepository.findTicketByTicketId(ticketId);

  if(!ticket) {
    throw notFoundError();
  }

  const enrollment = await enrollementRepository.findByEnrollmentId(ticket.enrollmentId);

  if(enrollment.userId !== userId) {
    throw unauthorizedError();
  }
}

async function getPaymentsByTicketsId(ticketId: number, userId: number) {
  await verifyTicketAndEnrollment(userId, ticketId);

  const payment = await paymentsRepository.findPaymentByTicketId(ticketId);

  if (!payment) {
    throw notFoundError(); 
  }

  return payment;
}
async function createPayment(userId: number, ticketId: number, cardData: CardPaymentBody) {
  await verifyTicketAndEnrollment(userId, ticketId);

  const ticket = await ticketRepository.findPriceInTicketTypeById(ticketId);
  
  const paymentData = {
    ticketId,
    value: Number(ticket.TicketType.price),
    cardIssuer: cardData.issuer,
    cardLastDigits: cardData.number.toString().slice(-4),
  };

  const payment = await paymentsRepository.createPayment(ticketId, paymentData);

  await ticketRepository.updateTicketPaymentStatus(ticketId);

  return payment;
}

export type CardPaymentBody = {
	issuer: string,
  number: number,
  name: string,
  expirationDate: Date,
  cvv: number
}

const paymentsService = {
  getPaymentsByTicketsId,
  createPayment
};

export default paymentsService;
