import { PassportStrategy } from "@nestjs/passport"
import { Strategy, VerifyCallback } from "passport-google-oauth20"

import { Injectable } from "@nestjs/common"
import { UserSchema } from "~shared/infrastructure/database/postgres/schemas/user.schema"

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor() {
    super({
      clientID: process.env.GOOGLE_AUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_AUTH_CALLBACK_URL,
      scope: ["email", "profile"],
    })
  }

  async validate(_accessToken: string, _refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const { emails, photos, name } = profile
    const user = new UserSchema({
      email: emails[0].value,
      name: `${name.givenName} ${name.familyName}`,
      // picture: photos[0].value,
      // roles: Role.SCOUT,
      is_guide_complete: false,
      // provider: "google",
    })
    done(null, user)
  }
}
