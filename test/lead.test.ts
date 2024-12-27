import request from "supertest";
import app from "../src/app";
import prismadb from "../src/lib/prismadb";
import { Status } from "@prisma/client";

// Datos comunes para la creación de un lead
const newLead = {
  phoneNumber: "1234567890",
  email: "test@example.com",
  fullName: "John Doe",
  status: "registered",
  postalCode: "12345",
  birthDate: "2000-01-01",
  gender: "male",
  vehicle: {
    brand: "Toyota",
    model: "Corolla",
    year: 2020,
  },
};

const newLeadGet = {
  phoneNumber: "1234567890",
  email: "test@example.com",
  fullName: "John Doe",
  status: "registered",
  postalCode: "12345",
  birthDate: "2000-01-01",
  gender: "male",
  Vehicle: {
    brand: "Toyota",
    model: "Corolla",
    year: 2020,
  },
};

// Función para realizar el POST de un lead
const createLead = async (leadData = newLead) => {
  return await request(app)
    .post("/api/v1/leads")
    .send(leadData)
    .set("Accept", "application/json");
};

describe("API Leads", () => {
  describe("POST /leads Cread Leads", () => {
    it("should not create a lead if one with the same number exists", async () => {
      // Crear el primer lead
      await createLead();

      // Intentar crear un segundo lead con el mismo número de teléfono
      const res = await createLead();

      // Verificar que el mensaje de error sea el esperado
      expect(res.body).toHaveProperty(
        "error",
        "Ya existe un lead con el mismo número de teléfono"
      );
      expect(res.status).toBe(400);
    });

    it("should create a new lead", async () => {
      const res = await createLead();

      // Verificar que el código de estado es 201 (creado)
      expect(res.status).toBe(201);

      // Verificar que el cuerpo de la respuesta contiene los campos correctos
      expect(res.body).toHaveProperty("phoneNumber", "1234567890");
      expect(res.body).toHaveProperty("email", "test@example.com");
    });
  });

  describe("GET /lead/:identifier Get Lead By Identifier", () => {
    beforeEach(async () => {
      await createLead();
    });

    it("should return lead details by phone number", async () => {
      const res = await request(app)
        .get("/api/v1/leads/1234567890")
        .set("Accept", "application/json");

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("phoneNumber", "1234567890");
      expect(res.body).toHaveProperty("email", "test@example.com");
      expect(res.body).toHaveProperty("fullName", "John Doe");
    });

    it("should return lead details by email", async () => {
      const res = await request(app)
        .get("/api/v1/leads/test@example.com")
        .set("Accept", "application/json");

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("phoneNumber", "1234567890");
      expect(res.body).toHaveProperty("email", "test@example.com");
    });

    it("should return 404 if lead is not found", async () => {
      const res = await request(app)
        .get("/api/v1/leads/nonexistent@example.com")
        .set("Accept", "application/json");

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message", "Lead no encontrado");
    });
  });

  describe("GET /leads - Get Leads by Status", () => {
    const createLeadStatus = async (leadData: any) => {
      return await request(app)
        .post("/api/v1/leads")
        .send(leadData)
        .set("Accept", "application/json");
    };

    it("should return registered leads", async () => {
      const payload = {
        ...newLead,
        status: "registered" as Status,
      };
      await createLeadStatus(payload);

      const res = await request(app)
        .get("/api/v1/leads?status=registered")
        .set("Accept", "application/json");

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0]).toHaveProperty("status", "registered");
    });

    it("should return quotation_unfinished leads", async () => {
      await prismadb.lead.create({
        data: {
          ...newLeadGet,
          status: "quotation_unfinished",
          birthDate: new Date(newLeadGet.birthDate),
          Vehicle: {
            create: {
              ...newLeadGet.Vehicle,
            },
          },
        },
      });
      const res = await request(app)
        .get("/api/v1/leads?status=quotation_unfinished")
        .set("Accept", "application/json");

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0]).toHaveProperty("status", "quotation_unfinished");
    });

    it("should return emission_unfinished leads", async () => {
      await prismadb.lead.create({
        data: {
          ...newLeadGet,
          status: "emission_unfinished",
          birthDate: new Date(newLeadGet.birthDate),
          Vehicle: {
            create: {
              ...newLeadGet.Vehicle,
            },
          },
        },
      });

      const res = await request(app)
        .get("/api/v1/leads?status=emission_unfinished")
        .set("Accept", "application/json");

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0]).toHaveProperty("status", "emission_unfinished");
    });

    it("should return emission_succeeded leads", async () => {
      await prismadb.lead.create({
        data: {
          ...newLeadGet,
          status: "emission_succeeded",
          birthDate: new Date(newLeadGet.birthDate),
          Vehicle: {
            create: {
              ...newLeadGet.Vehicle,
            },
          },
        },
      });

      const res = await request(app)
        .get("/api/v1/leads?status=emission_succeeded")
        .set("Accept", "application/json");

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0]).toHaveProperty("status", "emission_succeeded");
    });

    it("should return recovery_lead leads", async () => {
      await prismadb.lead.create({
        data: {
          ...newLeadGet,
          status: "recovery_lead",
          birthDate: new Date(newLeadGet.birthDate),
          Vehicle: {
            create: {
              ...newLeadGet.Vehicle,
            },
          },
        },
      });

      const res = await request(app)
        .get("/api/v1/leads?status=recovery_lead")
        .set("Accept", "application/json");

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0]).toHaveProperty("status", "recovery_lead");
    });

    it("should return an empty array if no leads match the status", async () => {
      const res = await request(app)
        .get("/api/v1/leads?status=nonexistentstatus")
        .set("Accept", "application/json");

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error", "Status inválido");
    });
  });

  describe("PUT /leads/:identifier/status - Update Lead Status", () => {
    const updateLeadStatus = async (identifier: string, status: string) => {
      return await request(app)
        .patch(`/api/v1/leads/${identifier}`)
        .send({ status })
        .set("Accept", "application/json");
    };

    // Simulación de lead
    const leadData = {
      phoneNumber: "1234567890",
      email: "test@example.com",
      status: "registered" as Status,
      fullName: "John Doe",
      postalCode: "12345",
      birthDate: new Date("2000-01-01"),
      gender: "male",
    };

    // Crear un lead de prueba antes de los tests
    beforeEach(async () => {
      await prismadb.lead.create({
        data: {
          ...leadData,
          Vehicle: {
            create: {
              brand: "Toyota",
              model: "Corolla",
              year: 2020,
            },
          },
        },
      });
    });

    it("should update the status of the lead successfully", async () => {
      const res = await updateLeadStatus("1234567890", "emission_succeeded");

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Status actualizado correctamente");
      expect(res.body.updatedLeadsCount).toBe(1);
      expect(res.body.status).toBe("emission_succeeded");
    });

    it("should return 404 if no lead is found", async () => {
      const res = await updateLeadStatus(
        "nonexistentidentifier",
        "emission_succeeded"
      );

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Lead no encontrado");
    });

    it("should return 400 if the status is invalid", async () => {
      const res = await updateLeadStatus("1234567890", "nonexistentstatus");

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Status inválido");
    });

    it("should return 400 if no status is provided", async () => {
      const res = await request(app)
        .put("/api/v1/leads/1234567890/status")
        .send({})
        .set("Accept", "application/json");

      expect(res.status).toBe(404);
    });

    it("should return 500 if there's a server error", async () => {
      // Simula un error en la base de datos
      jest
        .spyOn(prismadb.lead, "updateMany")
        .mockRejectedValueOnce(new Error("Database error"));

      const res = await updateLeadStatus("1234567890", "emission_succeeded");

      expect(res.status).toBe(500);
      expect(res.body.error).toBe("Error al actualizar el status del Lead");
    });
  });
});
