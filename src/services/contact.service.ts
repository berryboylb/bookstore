import prisma from "../prisma";

export type Contact = {
  fullname: string;
  email: string;
};

// READ
export const getAllContact = async (skip?: number, take?: number) => {
  const contacts = await prisma.contact.findMany({
    skip,
    take,
  });
  const totalCount = await prisma.contact.count();
  return { contacts, totalCount };
};

export const getOneContact = async (id: number) => {
  const contact = await prisma.contact.findUnique({
    where: { id },
  });
  return contact;
};

// CREATE
export const createContact = async (body: Contact) => {
  const contact = await prisma.contact.create({
    data: {
      ...body,
    },
  });
  return contact;
};

// UPDATE
export const updateContact = async (id: number, body: Contact) => {
  const contact = await prisma.contact.update({
    where: {
      id,
    },
    data: {
      ...body,
    },
  });
  return contact;
};

// HARD DELETE
export const deleteContact = async (id: number) => {
  const contact = await prisma.contact.delete({
    where: {
      id,
    },
  });
  return contact;
};
