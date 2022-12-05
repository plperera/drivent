import app, { init } from "@/app";
import { prisma } from "@/config";
import faker from "@faker-js/faker";
import { TicketStatus } from "@prisma/client";
import httpStatus from "http-status";
import * as jwt from "jsonwebtoken";
import supertest from "supertest";
import { createEnrollmentWithAddress, createUser, createTicketType, createTicket, createHotel, createRoom, createTicketTypeWithParams, createPayment, createRoomWithOneCapacity } from "../factories";
import { createBooking } from "../factories/booking-factory";
import { cleanDb, generateValidToken } from "../helpers";

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe("GET /booking", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/booking");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 404 when user doesnt have a booking yet", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 200 and with booking data", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      
      const hotel = await createHotel();
      const room = await createRoom(hotel.id);
      const booking = await createBooking(user.id, room.id);

      const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.OK);
      expect(response.body).toEqual({
        id: booking.id,
        Room: {
          id: room.id,
          name: room.name,
          capacity: room.capacity,
          hotelId: room.hotelId,
          createdAt: room.createdAt.toISOString(),
          updatedAt: room.updatedAt.toISOString()
        }
      });
    });
  });
});

describe("POST /booking", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.post("/booking");
  
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
  
  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();
  
    const response = await server.post("/booking").set("Authorization", `Bearer ${token}`);
  
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
  
  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
  
    const response = await server.post("/booking").set("Authorization", `Bearer ${token}`);
  
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
  /*
  describe("when ticket is invalid", () => {

    it("should respond with status 403 when user doesnt have a payd ticket yet", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const hotel = await createHotel();
      const room = await createRoom(hotel.id);
      const booking = await createBooking(user.id, room.id)

      const body = { roomId: room.id };

      const response = await server.put("/booking/"+booking.id).set("Authorization", `Bearer ${token}`).send(body);

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });
  
    it("should respond with status 404 when user doesnt have a ticket yet", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);

      const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 404 when user doesnt have a payd ticket yet", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

      const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it("should respond with status 403 when ticket doesnt include a hotel", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);

      const isRemote = false;
      const includesHotel = false;

      const ticketType = await createTicketTypeWithParams(isRemote, includesHotel);
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it("should respond with status 403 when ticket is remote", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);

      const isRemote = true;
      const includesHotel = false;

      const ticketType = await createTicketTypeWithParams(isRemote, includesHotel);
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });
  });
  */
  describe("when token is valid", () => {
    it("should respond with status 400 when body is empty", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const hotel = await createHotel();
      const room = await createRoom(hotel.id);

      const body = {};

      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send(body);

      expect(response.status).toEqual(httpStatus.BAD_REQUEST);
    });

    it("should respond with status 400 when body is a string", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const hotel = await createHotel();
      const room = await createRoom(hotel.id);

      const body = { roomId: "salve" };

      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send(body);

      expect(response.status).toEqual(httpStatus.BAD_REQUEST);
    });

    it("should respond with status 404 when roomId doesnt exist", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const hotel = await createHotel();
      const room = await createRoom(hotel.id);

      const body = { roomId: room.id + 1 };

      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send(body);
  
      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 403 when roomId doesnt have capacity", async () => {
      const user = await createUser();
      const anotherUser = await createUser();
      const token = await generateValidToken(user);

      const hotel = await createHotel();
      const room = await createRoomWithOneCapacity(hotel.id);
      const booking = await createBooking(anotherUser.id, room.id);

      const body = { roomId: room.id };

      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send(body);
  
      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it("should respond with status 403 when user already has a booking", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const hotel = await createHotel();
      const room = await createRoom(hotel.id);
      const booking = await createBooking(user.id, room.id);

      const body = { roomId: room.id };

      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send(body);
  
      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });
  
    it("should respond with status 200 and with booking data", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const hotel = await createHotel();
      const room = await createRoom(hotel.id);

      const body = { roomId: room.id };

      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send(body);
      const getBooking = await server.get("/booking").set("Authorization", `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.OK);
      expect(response.body).toEqual({
        bookingId: getBooking.body.id
      });
    });
  });
});

describe("PUT /booking/:bookingId", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.put("/booking/1");
    
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
    
  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();
    
    const response = await server.put("/booking/1").set("Authorization", `Bearer ${token}`);
    
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
    
  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    
    const response = await server.put("/booking/1").set("Authorization", `Bearer ${token}`);
    
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
  /*
      describe("when ticket is invalid", () => {
  
          it("should respond with status 404 when user doesnt have an enrollment yet", async () => {
              const token = await generateValidToken();
        
              const response = await server.post("/booking").set("Authorization", `Bearer ${token}`);
        
              expect(response.status).toEqual(httpStatus.NOT_FOUND);
            });
        
            it("should respond with status 404 when user doesnt have a ticket yet", async () => {
              const user = await createUser();
              const token = await generateValidToken(user);
              await createEnrollmentWithAddress(user);
        
              const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);
        
              expect(response.status).toEqual(httpStatus.NOT_FOUND);
            });
        
            it("should respond with status 404 when user doesnt have a payd ticket yet", async () => {
              const user = await createUser();
              const token = await generateValidToken(user);
              const enrollment = await createEnrollmentWithAddress(user);
              const ticketType = await createTicketType();
              const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
        
              const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);
        
              expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
            });
        
            it("should respond with status 403 when ticket doesnt include a hotel", async () => {
              const user = await createUser();
              const token = await generateValidToken(user);
              const enrollment = await createEnrollmentWithAddress(user);
        
              const isRemote = false;
              const includesHotel = false;
        
              const ticketType = await createTicketTypeWithParams(isRemote, includesHotel);
              const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        
              const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);
        
              expect(response.status).toEqual(httpStatus.FORBIDDEN);
            });
        
            it("should respond with status 403 when ticket is remote", async () => {
              const user = await createUser();
              const token = await generateValidToken(user);
              const enrollment = await createEnrollmentWithAddress(user);
        
              const isRemote = true;
              const includesHotel = false;
        
              const ticketType = await createTicketTypeWithParams(isRemote, includesHotel);
              const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        
              const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);
        
              expect(response.status).toEqual(httpStatus.FORBIDDEN);
            });
      });
      */
  describe("when token is valid", () => {
    it("should respond with status 400 when body is empty", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
  
      const hotel = await createHotel();
      const room = await createRoom(hotel.id);
  
      const body = {};
  
      const response = await server.put("/booking/1").set("Authorization", `Bearer ${token}`).send(body);
  
      expect(response.status).toEqual(httpStatus.BAD_REQUEST);
    });
  
    it("should respond with status 400 when body is a string", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
  
      const hotel = await createHotel();
      const room = await createRoom(hotel.id);
      const booking = await createBooking(user.id, room.id);
  
      const body = { roomId: "salve" };
  
      const response = await server.put("/booking/"+booking.id).set("Authorization", `Bearer ${token}`).send(body);
  
      expect(response.status).toEqual(httpStatus.BAD_REQUEST);
    });
  
    it("should respond with status 404 when roomId doesnt exist", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
  
      const hotel = await createHotel();
      const room = await createRoom(hotel.id);
      const booking = await createBooking(user.id, room.id);
  
      const body = { roomId: room.id + 1 };
  
      const response = await server.put("/booking/"+booking.id).set("Authorization", `Bearer ${token}`).send(body);
    
      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });
  
    it("should respond with status 403 when roomId doesnt have capacity", async () => {
      const user = await createUser();
      const anotherUser = await createUser();
      const token = await generateValidToken(user);
  
      const hotel = await createHotel();
      const room = await createRoomWithOneCapacity(hotel.id);
      const booking = await createBooking(anotherUser.id, room.id);
  
      const body = { roomId: room.id };
  
      const response = await server.put("/booking/"+booking.id).set("Authorization", `Bearer ${token}`).send(body);
    
      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });
  
    it("should respond with status 401 when booking does not belong the user or not exist", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
  
      const hotel = await createHotel();
      const room = await createRoom(hotel.id);
      const booking = await createBooking(user.id, room.id);
  
      const body = { roomId: room.id };
  
      const response = await server.put("/booking/999999999999999999999999999").set("Authorization", `Bearer ${token}`).send(body);
    
      expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
    });
    
    it("should respond with status 200 and with booking data", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
  
      const hotel = await createHotel();
      const room = await createRoom(hotel.id);
      const booking = await createBooking(user.id, room.id);
  
      const body = { roomId: room.id };
  
      const response = await server.put("/booking/"+booking.id).set("Authorization", `Bearer ${token}`).send(body);
      const getBooking = await server.get("/booking").set("Authorization", `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.OK);
      expect(response.body).toEqual({
        bookingId: getBooking.body.id
      });
    });
  });
});

