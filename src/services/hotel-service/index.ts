import { notFoundError, requestError } from "@/errors";
import hotelRepository from "@/repositories/hotel-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import { TicketStatus } from "@prisma/client";
import ticketRepository from "@/repositories/ticket-repository";
import paymentRepository from "@/repositories/payment-repository";
import httpStatus from "http-status";

async function verifyTicket(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!enrollment) {
    throw notFoundError();
  }

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket) {
    throw notFoundError();
  }

  if (ticket.status !== TicketStatus.PAID) {
    throw requestError(httpStatus.PAYMENT_REQUIRED, "PAYMENT_REQUIRED");
  }

  if (!ticket.TicketType.includesHotel || ticket.TicketType.isRemote) {
    throw requestError(httpStatus.FORBIDDEN, "FORBIDDEN");
  }
}

async function getHotels(userId: number) {
  await verifyTicket(userId);

  const hotelsData = await hotelRepository.findAllHotels();

  if (!hotelsData) {
    throw notFoundError();
  }
  return hotelsData;
}

async function getHotelWithRoomsByHotelId(userId: number, hotelId: number) {
  await verifyTicket(userId);

  const roomsData = await hotelRepository.findHotelWithRoomsByHotelId(hotelId);
  if (!roomsData) {
    throw notFoundError();
  }

  return roomsData;
}

const hotelService = {
  getHotels,
  getHotelWithRoomsByHotelId
};

export default hotelService;
