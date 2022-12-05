import { forbiddenError, notFoundError, requestError, unauthorizedError } from "@/errors";
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

async function postBooking(userId: number, roomId: number) {
  const hasBooking = await bookingRepository.findBookingByUserId(userId);

  if (hasBooking) {
    throw forbiddenError();
  }
  
  const room = await bookingRepository.findRoomById(roomId);

  if (!room) {
    throw notFoundError();
  }
  if (room.length === room[0].capacity) {
    throw forbiddenError();
  }

  const booking = await bookingRepository.createBooking(userId, roomId);
  
  return booking;
}

async function putBooking(userId: number, bookingId: number, roomId: number) {
  const booking = await bookingRepository.findBookingByUserId(userId);

  if (!booking) {
    throw forbiddenError();
  }
  
  if ( booking.id !== bookingId ) {
    throw unauthorizedError();
  }

  const verifyRoom = await bookingRepository.findRoomById(roomId);

  if (!verifyRoom) {
    throw notFoundError();
  }
  if (verifyRoom.length === verifyRoom[0].capacity) {
    throw forbiddenError();
  }

  const newBooking = await bookingRepository.updateBooking(bookingId, userId, roomId);
  
  return newBooking;
}

const bookingService = {
  getBooking,
  postBooking,
  putBooking
};

export default bookingService;
