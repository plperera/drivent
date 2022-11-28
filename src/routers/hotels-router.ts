import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getHotels, getHotelWithRoomsByHotelId } from "@/controllers";

const hotelsRouter = Router();

hotelsRouter
  .all("/*", authenticateToken)
  .get("", getHotels)
  .get("/:hotelId", getHotelWithRoomsByHotelId);

export { hotelsRouter };
