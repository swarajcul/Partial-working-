"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AWSAuthService = void 0;
const client_cognito_identity_provider_1 = require("@aws-sdk/client-cognito-identity-provider");
const aws_config_1 = require("./aws-config");
const cognitoClient = new client_cognito_identity_provider_1.CognitoIdentityProviderClient({
    region: aws_config_1.AWS_CONFIG.region,
});
class AWSAuthService {
    static login(credentials) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const command = new client_cognito_identity_provider_1.InitiateAuthCommand({
                    AuthFlow: "USER_PASSWORD_AUTH",
                    ClientId: aws_config_1.AWS_CONFIG.cognito.userPoolClientId,
                    AuthParameters: {
                        USERNAME: credentials.email,
                        PASSWORD: credentials.password,
                    },
                });
                const response = yield cognitoClient.send(command);
                if (!response.AuthenticationResult) {
                    throw new Error("Authentication failed");
                }
                const { AccessToken, RefreshToken, IdToken } = response.AuthenticationResult;
                if (!AccessToken || !RefreshToken || !IdToken) {
                    throw new Error("Invalid authentication response");
                }
                // Decode the ID token to get user info
                const userInfo = this.decodeJWT(IdToken);
                return {
                    id: userInfo.sub,
                    email: userInfo.email,
                    name: userInfo.name || userInfo.email.split("@")[0],
                    role: userInfo["custom:role"] || "player",
                    team: userInfo["custom:team"],
                    accessToken: AccessToken,
                    refreshToken: RefreshToken,
                    idToken: IdToken,
                };
            }
            catch (error) {
                console.error("AWS Cognito login error:", error);
                throw new Error("Login failed. Please check your credentials.");
            }
        });
    }
    static signup(credentials) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const command = new client_cognito_identity_provider_1.SignUpCommand({
                    ClientId: aws_config_1.AWS_CONFIG.cognito.userPoolClientId,
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
                });
                const response = yield cognitoClient.send(command);
                return {
                    userSub: response.UserSub || "",
                    codeDeliveryDetails: response.CodeDeliveryDetails,
                };
            }
            catch (error) {
                console.error("AWS Cognito signup error:", error);
                throw new Error("Signup failed. Please try again.");
            }
        });
    }
    static confirmSignup(email, confirmationCode) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const command = new client_cognito_identity_provider_1.ConfirmSignUpCommand({
                    ClientId: aws_config_1.AWS_CONFIG.cognito.userPoolClientId,
                    Username: email,
                    ConfirmationCode: confirmationCode,
                });
                yield cognitoClient.send(command);
            }
            catch (error) {
                console.error("AWS Cognito confirm signup error:", error);
                throw new Error("Email confirmation failed. Please check your code.");
            }
        });
    }
    static resendConfirmationCode(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const command = new client_cognito_identity_provider_1.ResendConfirmationCodeCommand({
                    ClientId: aws_config_1.AWS_CONFIG.cognito.userPoolClientId,
                    Username: email,
                });
                yield cognitoClient.send(command);
            }
            catch (error) {
                console.error("AWS Cognito resend confirmation error:", error);
                throw new Error("Failed to resend confirmation code.");
            }
        });
    }
    static decodeJWT(token) {
        try {
            const base64Url = token.split(".")[1];
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            const jsonPayload = Buffer.from(base64, "base64").toString("utf-8");
            return JSON.parse(jsonPayload);
        }
        catch (error) {
            console.error("JWT decode error:", error);
            return {};
        }
    }
    static refreshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const command = new client_cognito_identity_provider_1.InitiateAuthCommand({
                    AuthFlow: "REFRESH_TOKEN_AUTH",
                    ClientId: aws_config_1.AWS_CONFIG.cognito.userPoolClientId,
                    AuthParameters: {
                        REFRESH_TOKEN: refreshToken,
                    },
                });
                const response = yield cognitoClient.send(command);
                if (!((_a = response.AuthenticationResult) === null || _a === void 0 ? void 0 : _a.AccessToken) || !((_b = response.AuthenticationResult) === null || _b === void 0 ? void 0 : _b.IdToken)) {
                    throw new Error("Token refresh failed");
                }
                return {
                    accessToken: response.AuthenticationResult.AccessToken,
                    idToken: response.AuthenticationResult.IdToken,
                };
            }
            catch (error) {
                console.error("AWS Cognito token refresh error:", error);
                throw new Error("Token refresh failed");
            }
        });
    }
}
exports.AWSAuthService = AWSAuthService;
