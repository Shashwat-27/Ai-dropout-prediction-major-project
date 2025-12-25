import bcrypt from "bcrypt";
import prisma from "../src/config/prisma.js";

async function main() {
  const role = process.argv[2];     // mentor / psychologist
  const userId = process.argv[3];   // mentor_id / psych_id
  const password = process.argv[4]; // plain password

  if (!role || !userId || !password) {
    console.log("Usage:");
    console.log("node scripts/createUser.js mentor Shashwat 12345678");
    process.exit(1);
  }

  const hash = await bcrypt.hash(password, 10);

  if (role === "mentor") {
    await prisma.mentor.create({
      data: {
        mentor_id: userId,
        password: hash,
      },
    });
  }

  if (role === "psychologist") {
    await prisma.psychologist.create({
      data: {
        psych_id: userId,
        password: hash,
      },
    });
  }

  console.log(`✅ ${role} created successfully`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
