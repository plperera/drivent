import { prisma } from "@/config";

async function findBookingByUserId(userId: number) {
  return prisma.booking.findFirst({
    where: { userId },
    include: {
      Room: true
    }
  });
}

async function findRoomById(roomId: number) {
  return prisma.room.findMany({
    where: { id: roomId }
  });
}

async function createBooking(userId: number, roomId: number) {
  return prisma.booking.create({
    data: {
      userId,
      roomId
    }
  });
}

async function updateBooking(bookingId: number, userId: number, roomId: number) {
  return prisma.booking.update({
    where: { id: bookingId },
    data: {
      roomId,
    }
  });
}

const bookingRepository = {
  findBookingByUserId,
  findRoomById,
  createBooking,
  updateBooking
};

export default bookingRepository;
