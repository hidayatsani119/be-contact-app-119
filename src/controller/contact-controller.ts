import { NextFunction, Request, Response } from "express";
import { ContactService } from "../service/contact-service";
import { UserRequest } from "../type/user-request";
import { UpdateContactRequest } from "../model/contact-model";

export class ContactController {
  static async create(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const response = await ContactService.create(req.user!, req.body);
      res.status(200).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }
  static async get(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const contactId = Number(req.params.contactId);
      const response = await ContactService.get(req.user!, contactId);
      res.status(200).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }
  static async update(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: UpdateContactRequest = req.body as UpdateContactRequest;
      request.id = Number(req.params.contactId);
      const response = await ContactService.update(req.user!, request);
      res.status(200).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }
  static async remove(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const contactId = Number(req.params.contactId);
      await ContactService.remove(req.user!, contactId);
      res.status(200).json({
        data: "OK",
      });
    } catch (error) {
      next(error);
    }
  }
  static async search(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request = {
        name: req.query.name as string,
        email: req.query.email as string,
        phone: req.query.phone as string,
        page: req.query.page ? Number(req.query.page) : 1,
        size: req.query.size ? Number(req.query.size) : 10,
      };
      const response = await ContactService.search(req.user!, request);
      res.status(200).json({
        data: response.data,
        paging: response.paging,
      });
    } catch (error) {
      next(error);
    }
  }
}
