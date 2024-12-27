import { Request, Response } from "express";
import prismadb from "../../lib/prismadb";
import { Status } from "@prisma/client";

beforeEach(() => {
  jest.clearAllMocks();
});

const createLead = async (req: Request, res: Response) => {
  try {
    const {
      phoneNumber,
      email,
      fullName,
      postalCode,
      birthDate,
      gender,
      vehicle,
    } = req.body;

    const leadExist = await prismadb.lead.findFirst({
      where: { phoneNumber },
    });

    if (leadExist) {
      return res
        .status(400)
        .json({ error: "Ya existe un lead con el mismo número de teléfono" });
    }

    const lead = await prismadb.lead.create({
      data: {
        phoneNumber,
        email,
        fullName,
        postalCode,
        birthDate: new Date(birthDate),
        gender,
        status: "registered",
        Vehicle: {
          create: vehicle,
        },
      },
    });

    return res.status(201).json(lead);
  } catch (error) {
    console.log(error);

    return res.status(500).json({ error: `Error al crear Lead: ${error}` });
  }
};

const getLead = async (req: Request, res: Response) => {
  try {
    const { identifier } = req.params;

    const lead = await prismadb.lead.findFirst({
      where: {
        OR: [{ phoneNumber: identifier }, { email: identifier }],
      },
      include: { Vehicle: true },
    });

    if (!lead) {
      return res.status(404).json({ message: "Lead no encontrado" });
    }

    return res.json(lead);
  } catch (error) {
    return res
      .status(400)
      .json({ error: `Error al obtener al Lead: ${error}` });
  }
};

const updateLeadStatus = async (req: Request, res: Response) => {
  try {
    const { identifier } = req.params;
    const { status } = req.body;

    const validStatuses: Status[] = [
      "registered",
      "quotation_unfinished",
      "emission_unfinished",
      "emission_succeeded",
      "recovery_lead",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Status inválido" });
    }

    const lead = await prismadb.lead.updateMany({
      where: {
        OR: [{ phoneNumber: identifier }, { email: identifier }],
      },
      data: { status },
    });

    if (lead.count === 0) {
      return res.status(404).json({ message: "Lead no encontrado" });
    }

    res.json({
      message: "Status actualizado correctamente",
      updatedLeadsCount: lead.count,
      status: status,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error al actualizar el status del Lead" });
  }
};

const getLeadsByStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;

    if (!status || !Object.values(Status).includes(status as Status)) {
      return res.status(400).json({ error: "Status inválido" });
    }

    const leads = await prismadb.lead.findMany({
      where: { status: status as Status },
      include: { Vehicle: true },
    });

    res.json(leads);
  } catch (error) {
    return res
      .status(400)
      .json({ error: `Error al obtener el listado de Leads: ${error}` });
  }
};

export { createLead, getLead, updateLeadStatus, getLeadsByStatus };
