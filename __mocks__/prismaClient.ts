const prismaMock = {
  lead: {
    create: jest.fn(),
    findFirst: jest.fn(),
    updateMany: jest.fn(),
    findMany: jest.fn(),
  },
  vehicle: {
    create: jest.fn(),
  },
};

const PrismaClientMock = jest.fn(() => prismaMock);

export { prismaMock, PrismaClientMock };
export default PrismaClientMock;
