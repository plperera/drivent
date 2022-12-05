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
