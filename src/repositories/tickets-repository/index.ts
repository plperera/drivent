import { prisma } from "@/config";
import { TicketType, Ticket, Enrollment,TicketStatus } from "@prisma/client";

async function findTicketById(userId: number): Promise<Ticket & { Enrollment: Enrollment, TicketType: TicketType }> {
    
    const ticket = await prisma.ticket.findFirst({
        where: { id: userId },
        include: {
            Enrollment: true,
            TicketType: true
        },
    });

    return ticket
}

async function findTicketTypes(userId: number): Promise<TicketType[]> {
    const ticket = await findTicketById(userId)

    return [ticket.TicketType]
}


async function upsertTicket(id: number, params  /*tipagem*/) {
    
  // return prisma.ticket.upsert({
  //   where: {
  //     id
  //   },
  //   create: params,
  //   update: {
  //     id,
  //     ...params
  //   }
  // });
}


const ticketsRepository = {
  findTicketTypes,
  findTicketById,
  upsertTicket,
};
  
export default ticketsRepository;