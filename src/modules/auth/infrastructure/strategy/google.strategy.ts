import { Injectable } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { InjectRepository } from "@nestjs/typeorm"
import { Strategy, VerifyCallback } from "passport-google-oauth20"
import { Repository } from "typeorm"
import { UserSchema } from "~shared/infrastructure/database/postgres/schemas/user.schema"

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor(
    @InjectRepository(UserSchema)
    private readonly userRepository: Repository<UserSchema>
  ) {
    super({
      clientID: process.env.GOOGLE_AUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_AUTH_CALLBACK_URL,
      scope: ["email", "profile"],
    })
  }

  async validate(_accessToken: string, _refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    try {
      const { emails, name } = profile

      let user = await this.userRepository.findOne({
        where: { email: emails[0].value },
      })

      if (!user) {
        user = await this.userRepository.save({
          email: emails[0].value,
          name: `${name.givenName} ${name.familyName}`,
          is_guide_complete: false,
        })
        console.log("Created new user:", user.id)
      }

      done(null, user)
    } catch (error) {
      console.error("Error in validate:", error)
      done(error as Error, undefined)
    }
  }
}
