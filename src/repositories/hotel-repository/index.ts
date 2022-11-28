import { prisma } from "@/config";
import { Ticket, TicketStatus } from "@prisma/client";

async function findAllHotels() {
  return prisma.hotel.findMany();
}

async function findHotelWithRoomsByHotelId(hotelId: number) {
  return prisma.hotel.findFirst({
    where: { id: hotelId },
    include: {
      Rooms: true
    }
  });
}

const hotelRepository = {
  findAllHotels,
  findHotelWithRoomsByHotelId
};

export default hotelRepository;
