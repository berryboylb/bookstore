import { Request, Response, NextFunction } from "express";
import {
  createContact,
  getAllContact,
  getOneContact,
  Contact,
  updateContact,
  deleteContact,
} from "../services/contact.service";
import { success } from "../utils";
import AppError from "../utils/error";
const objectIdRegExp = /^[0-9a-fA-F]{24}$/;
export const createNew = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sqlResponse = await createContact(req.body);
    return success(res, sqlResponse, "Success");
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const findAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { page, pageSize } = req.query;
  const parsedPage = parseInt(page as string) || 1;
  const parsedPageSize = parseInt(pageSize as string) || 10;
  try {
    const skip = (parsedPage - 1) * parsedPageSize;
    const { contacts: sqlContact, totalCount: sqlTotalCount } =
      await getAllContact(skip, parsedPageSize);
    const sql_total_pages = Math.ceil(sqlTotalCount / parsedPageSize);
    const sql_current_page = parsedPage;
    const sql_previous_page =
      sql_current_page > 1 ? sql_current_page - 1 : null;
    const sql_next_page =
      sql_current_page < sql_total_pages ? sql_current_page + 1 : null;
    return success(
      res,

      {
        current_page: sql_current_page,
        total_pages: sql_total_pages,
        previous_page: sql_previous_page,
        next_page: sql_next_page,
        data: sqlContact,
      },

      "Success"
    );
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const getSingle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const response = await getOneContact(Number(id));
    console.log(response);
    if (!response) throw new AppError(400, "record not found");
    return success(
      res,
      response,
      "Successfully fetched from mysql"
    );
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const updateOne = async (
  req: Request<{ id: string }, {}, Contact, {}>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const response = await getOneContact(Number(id));
    console.log(response);
    if (!response) throw new AppError(400, "record not found");
    const updated = await updateContact(Number(id), {
      fullname: req.body.fullname,
      email: req.body.email,
    });
    return success(
      res, updated,
      "Successfully fetched from mysql"
    );
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const deleteRecord = async (
  req: Request<{ id: string }, {}, Contact, {}>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const response = await getOneContact(Number(id));
    console.log(response);
    if (!response) throw new AppError(400, "record not found");
    const updated = await deleteContact(Number(id));
    return success(
      res, updated,
      "Successfully Deleted from mysql"
    );
  } catch (err) {
    console.log(err);
    next(err);
  }
};
