// AWS Configuration for Esports Platform
export const AWS_CONFIG = {
  // AWS Region
  region: process.env.AWS_REGION || "ap-south-1",

  // Cognito Configuration
  cognito: {
    userPoolId: process.env.AWS_COGNITO_USER_POOL_ID || "",
    userPoolClientId: process.env.AWS_COGNITO_USER_POOL_CLIENT_ID || "",
    identityPoolId: process.env.AWS_COGNITO_IDENTITY_POOL_ID || "",
    domain: process.env.AWS_COGNITO_DOMAIN || "",
  },

  // RDS Configuration
  rds: {
    host: process.env.AWS_RDS_HOST || "localhost",
    port: Number.parseInt(process.env.AWS_RDS_PORT || "5432"),
    database: process.env.AWS_RDS_DATABASE || "esports_platform",
    username: process.env.AWS_RDS_USERNAME || "postgres",
    password: process.env.AWS_RDS_PASSWORD || "password",
  },

  // S3 Configuration
  s3: {
    bucket: process.env.AWS_S3_BUCKET || "esports-platform-assets",
    region: process.env.AWS_S3_REGION || "ap-south-1",
  },

  // API Gateway
  apiGateway: {
    url: process.env.AWS_API_GATEWAY_URL || "http://localhost:3000/api",
  },
}

// Check if AWS is configured
export const isAWSConfigured = () => {
  return !!(AWS_CONFIG.cognito.userPoolId && AWS_CONFIG.cognito.userPoolClientId && AWS_CONFIG.rds.host !== "localhost")
}

// Development mode check
export const isDevelopmentMode = () => {
  return process.env.NODE_ENV === "development" || !isAWSConfigured()
}

// Validate AWS configuration
export const validateAWSConfig = () => {
  const required = [
    "AWS_COGNITO_USER_POOL_ID",
    "AWS_COGNITO_USER_POOL_CLIENT_ID",
    "AWS_RDS_HOST",
    "AWS_RDS_USERNAME",
    "AWS_RDS_PASSWORD",
  ]

  const missing = required.filter((key) => !process.env[key])

  if (missing.length > 0) {
    console.warn(`Missing AWS environment variables: ${missing.join(", ")}`)
    return false
  }
  return true
}
