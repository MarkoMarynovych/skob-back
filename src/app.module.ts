import { Module } from "@nestjs/common"
import { APP_GUARD } from "@nestjs/core"
import { CoreModule } from "~core/core.module"
import { AuthModule } from "~modules/auth/auth.module"
import { RolesGuard } from "~modules/common/guards/roles.guard"
import { GroupsModule } from "~modules/groups/groups.module"
import { InvitesModule } from "~modules/invites/invites.module"
import { KurinsModule } from "~modules/kurins/kurins.module"
import { MonitorModule } from "~modules/monitor/monitor.module"
import { ProbasModule } from "~modules/proba/probas.module"
import { ProbaNotesModule } from "~modules/proba_notes/proba-notes.module"
import { UsersModule } from "~modules/users/users.module"
import { SharedModule } from "~shared/shared.module"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"

@Module({
  imports: [CoreModule, MonitorModule, SharedModule, UsersModule, AuthModule, InvitesModule, KurinsModule, ProbasModule, GroupsModule, ProbaNotesModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useExisting: "AUTH_GUARD",
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
