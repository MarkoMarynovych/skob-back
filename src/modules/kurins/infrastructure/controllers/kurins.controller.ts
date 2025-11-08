import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, UsePipes, ValidationPipe, Inject } from "@nestjs/common"
import { ApiTags } from "@nestjs/swagger"
import { RolesGuard } from "~modules/common/guards/roles.guard"
import { KurinAccessGuard } from "~modules/common/guards/kurin-access.guard"
import { Roles } from "~modules/common/decorators/roles.decorator"
import { Role } from "~modules/users/application/enums/role.enum"
import { CreateKurinDto } from "~modules/kurins/application/dto/create-kurin.dto"
import { UpdateKurinDto } from "~modules/kurins/application/dto/update-kurin.dto"
import { CreateKurinUseCase } from "~modules/kurins/application/use-cases/create-kurin.use-case"
import { GetKurinsUseCase } from "~modules/kurins/application/use-cases/get-kurins.use-case"
import { GetKurinUseCase } from "~modules/kurins/application/use-cases/get-kurin.use-case"
import { UpdateKurinUseCase } from "~modules/kurins/application/use-cases/update-kurin.use-case"
import { DeleteKurinUseCase } from "~modules/kurins/application/use-cases/delete-kurin.use-case"

export const KurinDiTokens = {
  CREATE_KURIN_USE_CASE: Symbol("CREATE_KURIN_USE_CASE"),
  GET_KURINS_USE_CASE: Symbol("GET_KURINS_USE_CASE"),
  GET_KURIN_USE_CASE: Symbol("GET_KURIN_USE_CASE"),
  UPDATE_KURIN_USE_CASE: Symbol("UPDATE_KURIN_USE_CASE"),
  DELETE_KURIN_USE_CASE: Symbol("DELETE_KURIN_USE_CASE"),
}

@ApiTags("Kurins")
@Controller("kurins")
@UseGuards(RolesGuard)
@Roles(Role.ADMIN)
export class KurinsController {
  constructor(
    @Inject(KurinDiTokens.CREATE_KURIN_USE_CASE)
    private readonly createKurinUseCase: CreateKurinUseCase,
    @Inject(KurinDiTokens.GET_KURINS_USE_CASE)
    private readonly getKurinsUseCase: GetKurinsUseCase,
    @Inject(KurinDiTokens.GET_KURIN_USE_CASE)
    private readonly getKurinUseCase: GetKurinUseCase,
    @Inject(KurinDiTokens.UPDATE_KURIN_USE_CASE)
    private readonly updateKurinUseCase: UpdateKurinUseCase,
    @Inject(KurinDiTokens.DELETE_KURIN_USE_CASE)
    private readonly deleteKurinUseCase: DeleteKurinUseCase
  ) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() dto: CreateKurinDto) {
    return await this.createKurinUseCase.execute({ dto })
  }

  @Get()
  async findAll() {
    return await this.getKurinsUseCase.execute()
  }

  @Get(":id")
  @UseGuards(RolesGuard, KurinAccessGuard)
  @Roles(Role.ADMIN, Role.LIAISON)
  async findOne(@Param("id") id: string) {
    return await this.getKurinUseCase.execute({ kurinId: id })
  }

  @Patch(":id")
  @UsePipes(new ValidationPipe())
  async update(@Param("id") id: string, @Body() dto: UpdateKurinDto) {
    return await this.updateKurinUseCase.execute({ kurinId: id, dto })
  }

  @Delete(":id")
  async delete(@Param("id") id: string) {
    await this.deleteKurinUseCase.execute({ kurinId: id })
    return { message: "Kurin deleted successfully" }
  }
}
