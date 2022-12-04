import { notFoundError, requestError } from "@/errors";
import hotelRepository from "@/repositories/hotel-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import { TicketStatus } from "@prisma/client";
import ticketRepository from "@/repositories/ticket-repository";
import paymentRepository from "@/repositories/payment-repository";
import httpStatus from "http-status";
import bookingRepository from "@/repositories/booking-repository";

async function getBooking(userId: number) {
  const bookingData = await bookingRepository.findBookingByUserId(userId);

  if (!bookingData) {
    throw notFoundError();
  }
  return bookingData;
}

const bookingService = {
  getBooking,
};

export default bookingService;
