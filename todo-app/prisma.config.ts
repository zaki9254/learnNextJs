import path from "node:path";
import { defineConfig } from "prisma/config";

export default defineConfig({
  earlyAccess: true,
  schema: path.join("prisma", "schema.prisma"),
  datasource: {
    url: "postgresql://postgres:8349@localhost:5432/tododb",
  },
  migrate: {
    async adapter() {
      const { PrismaPg } = await import("@prisma/adapter-pg");
      return new PrismaPg({
        connectionString: "postgresql://postgres:8349@localhost:5432/tododb",
      });
    },
  },
});