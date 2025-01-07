import { Module } from "@nestjs/common"
import { CoreModule } from "~core/core.module"
import { AuthModule } from "~modules/auth/auth.module"
import { UsersModule } from "~modules/users/users.module"
import { SharedModule } from "~shared/shared.module"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"

@Module({
  imports: [
    CoreModule,
    SharedModule,
    UsersModule,
    AuthModule,
    // ProbasModule,
    // AuthModule,
    // InvitesModule,
    // MonitorModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
