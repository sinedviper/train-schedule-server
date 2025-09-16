import { Module } from "@nestjs/common";
import { ConfigModule as NestConfigModule } from "@nestjs/config";
import { configuration } from "./configuration";
import { validationSchema } from "./validationSchema";

@Module({
  imports: [
    NestConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      validationSchema,
      expandVariables: true,
    }),
  ],
})
export class ConfigModule {}
