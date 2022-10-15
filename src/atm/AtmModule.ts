import { Module } from "@nestjs/common";
import { AtmController } from "./api/AtmController";
import { atmProvider } from "./provider/AtmProvider";
import { AtmRepository } from "./repository/AtmRepository";
import { AtmService } from "./service/AtmService";

@Module({
  controllers: [AtmController],
  providers: [
    AtmService,
    AtmRepository,
    atmProvider,
  ]
})

export class AtmModule { }