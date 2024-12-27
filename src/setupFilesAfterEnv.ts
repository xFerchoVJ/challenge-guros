import prismadb from "./lib/prismadb";

global.afterEach(async () => {
  await prismadb.vehicle.deleteMany();
  await prismadb.lead.deleteMany();
});
