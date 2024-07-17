// @ts-check

const { PrismaClient } = require("@prisma/client");
const { scryptPassword } = require("../lib/index.js");

const prisma = new PrismaClient();

async function main() {
  if (!process.env.SALT) throw [process.env.SALT];
  const password = scryptPassword("password", process.env.SALT);
  const alice = await prisma.user.upsert({
    where: { email: "alice@prisma.io" },
    update: {},
    create: {
      email: "alice@prisma.io",
      name: "Alice",
      Password: { create: { password } },
    },
  });
  const bob = await prisma.user.upsert({
    where: { email: "bob@prisma.io" },
    update: {},
    create: {
      email: "bob@prisma.io",
      name: "Bob",
      Password: { create: { password } },
    },
  });
  console.log({ alice, bob });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
