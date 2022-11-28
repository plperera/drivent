import { AuthenticatedRequest } from "@/middlewares";
import hotelService from "@/services/hotel-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const hotelsData = await hotelService.getHotels(Number(userId));

    return res.status(httpStatus.OK).send(hotelsData);
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

export async function getHotelWithRoomsByHotelId(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const hotelId = req.params?.hotelId;

  try {
    if(!hotelId) {
      res.sendStatus(httpStatus.NOT_FOUND);
    }

    const roomsData = await hotelService.getHotelWithRoomsByHotelId(Number(userId), Number(hotelId));

    if(!roomsData) {
      res.sendStatus(httpStatus.NOT_FOUND);
    }

    return res.status(httpStatus.OK).send(roomsData);
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
