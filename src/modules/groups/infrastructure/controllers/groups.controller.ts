import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common"
import { JwtPayloadDto } from "~modules/auth/application/dto/jwtpayload.dto"
import { Roles } from "~modules/common/decorators/roles.decorator"
import { RolesGuard } from "~modules/common/guards/roles.guard"
import { KurinAccessGuard } from "~modules/common/guards/kurin-access.guard"
import { User } from "~modules/common/decorators/user.decorator"
import { AddMemberDto } from "~modules/groups/application/dto/add-member.dto"
import { CreateGroupDto } from "~modules/groups/application/dto/create-group.dto"
import { UpdateGroupDto } from "~modules/groups/application/dto/update-group.dto"
import { AddMemberUseCase } from "~modules/groups/application/use-cases/add-member.use-case"
import { RemoveMemberUseCase } from "~modules/groups/application/use-cases/remove-member.use-case"
import { CreateGroupUseCase } from "~modules/groups/application/use-cases/create-group.use-case"
import { UpdateGroupUseCase } from "~modules/groups/application/use-cases/update-group.use-case"
import { GetUserGroupsUseCase } from "~modules/groups/application/use-cases/get-user-groups.use-case"
import { GetInviteLinkUseCase } from "~modules/groups/application/use-cases/get-invite-link.use-case"
import { GetGroupDetailsUseCase } from "~modules/groups/application/use-cases/get-group-details.use-case"
import { Role } from "~modules/users/application/enums/role.enum"

export const GroupDiTokens = {
  CREATE_GROUP_USE_CASE: Symbol("CREATE_GROUP_USE_CASE"),
  ADD_MEMBER_USE_CASE: Symbol("ADD_MEMBER_USE_CASE"),
  REMOVE_MEMBER_USE_CASE: Symbol("REMOVE_MEMBER_USE_CASE"),
  UPDATE_GROUP_USE_CASE: Symbol("UPDATE_GROUP_USE_CASE"),
  GET_USER_GROUPS_USE_CASE: Symbol("GET_USER_GROUPS_USE_CASE"),
  GET_INVITE_LINK_USE_CASE: Symbol("GET_INVITE_LINK_USE_CASE"),
  GET_GROUP_DETAILS_USE_CASE: Symbol("GET_GROUP_DETAILS_USE_CASE"),
}

@Controller("groups")
export class GroupsController {
  constructor(
    @Inject(GroupDiTokens.CREATE_GROUP_USE_CASE)
    private readonly createGroupUseCase: CreateGroupUseCase,
    @Inject(GroupDiTokens.ADD_MEMBER_USE_CASE)
    private readonly addMemberUseCase: AddMemberUseCase,
    @Inject(GroupDiTokens.REMOVE_MEMBER_USE_CASE)
    private readonly removeMemberUseCase: RemoveMemberUseCase,
    @Inject(GroupDiTokens.UPDATE_GROUP_USE_CASE)
    private readonly updateGroupUseCase: UpdateGroupUseCase,
    @Inject(GroupDiTokens.GET_USER_GROUPS_USE_CASE)
    private readonly getUserGroupsUseCase: GetUserGroupsUseCase,
    @Inject(GroupDiTokens.GET_INVITE_LINK_USE_CASE)
    private readonly getInviteLinkUseCase: GetInviteLinkUseCase,
    @Inject(GroupDiTokens.GET_GROUP_DETAILS_USE_CASE)
    private readonly getGroupDetailsUseCase: GetGroupDetailsUseCase
  ) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.FOREMAN, Role.LIAISON, Role.ADMIN)
  @UsePipes(new ValidationPipe())
  async createGroup(@Body() createGroupDto: CreateGroupDto, @User() { sub: userId }: JwtPayloadDto) {
    return await this.createGroupUseCase.execute({
      dto: createGroupDto,
      ownerId: userId,
    })
  }

  @Patch(":groupId")
  @UseGuards(RolesGuard)
  @Roles(Role.FOREMAN, Role.LIAISON, Role.ADMIN)
  @UsePipes(new ValidationPipe())
  async updateGroup(@Param("groupId") groupId: string, @Body() updateGroupDto: UpdateGroupDto, @User() { sub: userId }: JwtPayloadDto) {
    await this.updateGroupUseCase.execute({
      groupId,
      userId,
      dto: updateGroupDto,
    })
    return { message: "Group updated successfully" }
  }

  @Get()
  async getUserGroups(@User() { sub: userId }: JwtPayloadDto) {
    return await this.getUserGroupsUseCase.execute({ userId })
  }

  @Post(":groupId/members")
  @UseGuards(RolesGuard)
  @Roles(Role.FOREMAN, Role.LIAISON, Role.ADMIN)
  @UsePipes(new ValidationPipe())
  async addMember(@Param("groupId") groupId: string, @Body() addMemberDto: AddMemberDto, @User() { sub: userId }: JwtPayloadDto) {
    await this.addMemberUseCase.execute({
      groupId,
      userIdToAdd: addMemberDto.userId,
      currentUserId: userId,
    })

    return { message: "Member added successfully" }
  }

  @Delete(":groupId/members/:userId")
  @UseGuards(RolesGuard)
  @Roles(Role.FOREMAN, Role.LIAISON, Role.ADMIN)
  async removeMember(@Param("groupId") groupId: string, @Param("userId") userId: string, @User() { sub: currentUserId }: JwtPayloadDto) {
    await this.removeMemberUseCase.execute({
      groupId,
      userIdToRemove: userId,
      currentUserId,
    })

    return { message: "Member removed successfully" }
  }

  @Get(":groupId/invite-link")
  async getInviteLink(@Param("groupId") groupId: string, @User() { sub: userId }: JwtPayloadDto) {
    return await this.getInviteLinkUseCase.execute({
      groupId,
      userId,
    })
  }

  @Get(":groupId/details")
  @UseGuards(RolesGuard, KurinAccessGuard)
  @Roles(Role.FOREMAN, Role.LIAISON, Role.ADMIN)
  async getGroupDetails(@Param("groupId") groupId: string) {
    return await this.getGroupDetailsUseCase.execute({ groupId })
  }
}
