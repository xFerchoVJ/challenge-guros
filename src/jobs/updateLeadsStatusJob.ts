import prismadb from "../lib/prismadb";

export const updateLeadStatusJob = async () => {
  try {
    const leadsToUpdate = await prismadb.lead.findMany({
      where: {
        status: "registered",
        createdAt: {
          lt: new Date(new Date().getTime() - 60 * 60 * 1000), // Leads creados hace más de una hora
        },
      },
    });

    if (leadsToUpdate.length > 0) {
      // Actualizar el status de los leads
      await prismadb.lead.updateMany({
        where: {
          id: { in: leadsToUpdate.map((lead) => lead.id) },
        },
        data: {
          status: "recovery_lead",
        },
      });

      console.log(
        `${leadsToUpdate.length} leads actualizados a recovery_lead.`
      );
    } else {
      console.log("No hay leads registrados para actualizar.");
    }
  } catch (error) {
    console.error("Error al actualizar los leads:", error);
  }
};
