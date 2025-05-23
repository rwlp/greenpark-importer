import { PrismaClient } from "@/config/prisma/generatedFiles";
import { Provider, Singleton } from "@/config/typeinject/decorators/decorators";

@Provider("PrismaInstance")
@Singleton()
export default class PrismaInstanceDAO {
    prismaInstance: PrismaClient;

    constructor() {
        this.prismaInstance = new PrismaClient();
    }
}