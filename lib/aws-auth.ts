import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  SignUpCommand,
  ConfirmSignUpCommand,
  ResendConfirmationCodeCommand,
} from "@aws-sdk/client-cognito-identity-provider"
import { AWS_CONFIG } from "./aws-config"

const cognitoClient = new CognitoIdentityProviderClient({
  region: awsConfig.region,
})

export interface AuthUser {
  id: string
  email: string
  name: string
  role: string
  team?: string
  accessToken: string
  refreshToken: string
  idToken: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupCredentials {
  email: string
  password: string
  name: string
  role?: string
}

export class AWSAuthService {
  static async login(credentials: LoginCredentials): Promise<AuthUser> {
    try {
      const command = new InitiateAuthCommand({
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: awsConfig.cognito.userPoolClientId,
        AuthParameters: {
          USERNAME: credentials.email,
          PASSWORD: credentials.password,
        },
      })

      const response = await cognitoClient.send(command)

      if (!response.AuthenticationResult) {
        throw new Error("Authentication failed")
      }

      const { AccessToken, RefreshToken, IdToken } = response.AuthenticationResult

      if (!AccessToken || !RefreshToken || !IdToken) {
        throw new Error("Invalid authentication response")
      }

      // Decode the ID token to get user info
      const userInfo = this.decodeJWT(IdToken)

      return {
        id: userInfo.sub,
        email: userInfo.email,
        name: userInfo.name || userInfo.email.split("@")[0],
        role: userInfo["custom:role"] || "player",
        team: userInfo["custom:team"],
        accessToken: AccessToken,
        refreshToken: RefreshToken,
        idToken: IdToken,
      }
    } catch (error) {
      console.error("AWS Cognito login error:", error)
      throw new Error("Login failed. Please check your credentials.")
    }
  }

  static async signup(credentials: SignupCredentials): Promise<{ userSub: string; codeDeliveryDetails: any }> {
    try {
      const command = new SignUpCommand({
        ClientId: awsConfig.cognito.userPoolClientId,
        Username: credentials.email,
        Password: credentials.password,
        UserAttributes: [
          {
            Name: "email",
            Value: credentials.email,
          },
          {
            Name: "name",
            Value: credentials.name,
          },
          {
            Name: "custom:role",
            Value: credentials.role || "player",
          },
        ],
      })

      const response = await cognitoClient.send(command)

      return {
        userSub: response.UserSub || "",
        codeDeliveryDetails: response.CodeDeliveryDetails,
      }
    } catch (error) {
      console.error("AWS Cognito signup error:", error)
      throw new Error("Signup failed. Please try again.")
    }
  }

  static async confirmSignup(email: string, confirmationCode: string): Promise<void> {
    try {
      const command = new ConfirmSignUpCommand({
        ClientId: awsConfig.cognito.userPoolClientId,
        Username: email,
        ConfirmationCode: confirmationCode,
      })

      await cognitoClient.send(command)
    } catch (error) {
      console.error("AWS Cognito confirm signup error:", error)
      throw new Error("Email confirmation failed. Please check your code.")
    }
  }

  static async resendConfirmationCode(email: string): Promise<void> {
    try {
      const command = new ResendConfirmationCodeCommand({
        ClientId: awsConfig.cognito.userPoolClientId,
        Username: email,
      })

      await cognitoClient.send(command)
    } catch (error) {
      console.error("AWS Cognito resend confirmation error:", error)
      throw new Error("Failed to resend confirmation code.")
    }
  }

  private static decodeJWT(token: string): any {
    try {
      const base64Url = token.split(".")[1]
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      )
      return JSON.parse(jsonPayload)
    } catch (error) {
      console.error("JWT decode error:", error)
      return {}
    }
  }

  static async refreshToken(refreshToken: string): Promise<{ accessToken: string; idToken: string }> {
    try {
      const command = new InitiateAuthCommand({
        AuthFlow: "REFRESH_TOKEN_AUTH",
        ClientId: awsConfig.cognito.userPoolClientId,
        AuthParameters: {
          REFRESH_TOKEN: refreshToken,
        },
      })

      const response = await cognitoClient.send(command)

      if (!response.AuthenticationResult?.AccessToken || !response.AuthenticationResult?.IdToken) {
        throw new Error("Token refresh failed")
      }

      return {
        accessToken: response.AuthenticationResult.AccessToken,
        idToken: response.AuthenticationResult.IdToken,
      }
    } catch (error) {
      console.error("AWS Cognito token refresh error:", error)
      throw new Error("Token refresh failed")
    }
  }
}
