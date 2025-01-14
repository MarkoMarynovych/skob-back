interface ISendInvitationPayload {
  scoutEmail: string
  inviteHash: string
  scoutName: string
  foremanName: string
}

export interface ISendInvitationService {
  sendInvitation(payload: ISendInvitationPayload): Promise<void>
}
