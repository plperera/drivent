import { AuthenticatedRequest } from "@/middlewares";
import bookingService from "@/services/booking-service";
import hotelService from "@/services/hotel-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const bookingData = await bookingService.getBooking(Number(userId));

    return res.status(httpStatus.OK).send({
      id: bookingData.id, 
      Room: bookingData.Room
    });
  } catch (error) {
    if(error.name === "RequestError") {
      res.sendStatus(error.status);
    }
    if (error.name === "NotFoundError") {
      return res.status(httpStatus.NOT_FOUND).send(error);
    }
    if (error.name === "ForbiddenError") {
      return res.status(httpStatus.FORBIDDEN).send(error);
    }
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function postBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const roomId = req.body.roomId as number;

  if (!roomId || roomId * 0 !== 0) {
    res.sendStatus(httpStatus.BAD_REQUEST);
  }

  try {
    const booking = await bookingService.postBooking(userId, roomId);
    return res.status(httpStatus.OK).send({ bookingId: booking.id });
  } catch (error) {
    if(error.name === "RequestError") {
      res.sendStatus(error.status);
    }
    if (error.name === "NotFoundError") {
      return res.status(httpStatus.NOT_FOUND).send(error);
    }
    if (error.name === "ForbiddenError") {
      return res.status(httpStatus.FORBIDDEN).send(error);
    }
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function putBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const bookingId = Number(req.params.bookingId);
  const roomId = req.body.roomId as number;

  if (!roomId || roomId * 0 !== 0) {
    res.sendStatus(httpStatus.BAD_REQUEST);
  }

  try {
    const newBooking = await bookingService.putBooking(userId, bookingId, roomId);
    
    return res.status(httpStatus.OK).send({ bookingId: newBooking.id });
  } catch (error) {
    if(error.name === "RequestError") {
      res.sendStatus(error.status);
    }
    if(error.name === "UnauthorizedError") {
      res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    if (error.name === "NotFoundError") {
      return res.status(httpStatus.NOT_FOUND).send(error);
    }
    if (error.name === "ForbiddenError") {
      return res.status(httpStatus.FORBIDDEN).send(error);
    }
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
