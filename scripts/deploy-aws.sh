#!/bin/bash

# AWS Deployment Script for Esports Platform
set -e

# Configuration
ENVIRONMENT=${1:-dev}
REGION=${2:-us-east-1}
STACK_NAME="esports-platform-${ENVIRONMENT}"

echo "🚀 Deploying Esports Platform to AWS..."
echo "Environment: ${ENVIRONMENT}"
echo "Region: ${REGION}"
echo "Stack Name: ${STACK_NAME}"

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
  echo "❌ AWS CLI is not installed. Please install it first."
  exit 1
fi

# Check if jq is installed
if ! command -v jq &> /dev/null; then
  echo "❌ jq is not installed. Please install it first."
  exit 1
fi

# Check if user is authenticated
if ! aws sts get-caller-identity &> /dev/null; then
  echo "❌ AWS credentials not configured. Please run 'aws configure' first."
  exit 1
fi

# Prompt for database password
read -s -p "Enter database password (min 8 characters): " DB_PASSWORD
echo

if [ ${#DB_PASSWORD} -lt 8 ]; then
  echo "❌ Password must be at least 8 characters long."
  exit 1
fi

# Deploy CloudFormation stack
echo "📦 Deploying CloudFormation stack... (This may take 10-15 minutes)"
aws cloudformation deploy \
  --template-file aws-infrastructure.yml \
  --stack-name ${STACK_NAME} \
  --parameter-overrides \
      Environment=${ENVIRONMENT} \
      DBPassword=${DB_PASSWORD} \
  --capabilities CAPABILITY_IAM \
  --region ${REGION}

# Get stack outputs
echo "📋 Getting stack outputs..."
OUTPUTS=$(aws cloudformation describe-stacks \
  --stack-name ${STACK_NAME} \
  --region ${REGION} \
  --query 'Stacks[0].Outputs')

USER_POOL_ID=$(echo $OUTPUTS | jq -r '.[] | select(.OutputKey=="UserPoolId") | .OutputValue')
USER_POOL_CLIENT_ID=$(echo $OUTPUTS | jq -r '.[] | select(.OutputKey=="UserPoolClientId") | .OutputValue')
IDENTITY_POOL_ID=$(echo $OUTPUTS | jq -r '.[] | select(.OutputKey=="IdentityPoolId") | .OutputValue')
DATABASE_ENDPOINT=$(echo $OUTPUTS | jq -r '.[] | select(.OutputKey=="DatabaseEndpoint") | .OutputValue')
DATABASE_PORT=$(echo $OUTPUTS | jq -r '.[] | select(.OutputKey=="DatabasePort") | .OutputValue')
S3_BUCKET=$(echo $OUTPUTS | jq -r '.[] | select(.OutputKey=="S3BucketName") | .OutputValue')

# Create environment file
echo "📝 Creating environment configuration file: .env.${ENVIRONMENT}"
cat > .env.${ENVIRONMENT} &lt;&lt; EOF
# AWS Configuration for ${ENVIRONMENT} environment
AWS_REGION=${REGION}

# Cognito Configuration
AWS_COGNITO_USER_POOL_ID=${USER_POOL_ID}
AWS_COGNITO_USER_POOL_CLIENT_ID=${USER_POOL_CLIENT_ID}
AWS_COGNITO_IDENTITY_POOL_ID=${IDENTITY_POOL_ID}

# RDS Configuration
AWS_RDS_HOST=${DATABASE_ENDPOINT}
AWS_RDS_PORT=${DATABASE_PORT}
AWS_RDS_DATABASE=esports_platform
AWS_RDS_USERNAME=esports_admin
AWS_RDS_PASSWORD=${DB_PASSWORD}

# S3 Configuration
AWS_S3_BUCKET=${S3_BUCKET}
AWS_S3_REGION=${REGION}

# Next.js Configuration
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=$(openssl rand -base64 32)
EOF

echo "✅ AWS infrastructure deployed successfully!"
echo ""
echo "📋 Configuration Summary:"
echo "User Pool ID: ${USER_POOL_ID}"
echo "User Pool Client ID: ${USER_POOL_CLIENT_ID}"
echo "Database Endpoint: ${DATABASE_ENDPOINT}"
echo "S3 Bucket: ${S3_BUCKET}"
echo ""
echo "🔧 Next Steps:"
echo "1. Rename .env.${ENVIRONMENT} to .env.local: mv .env.${ENVIRONMENT} .env.local"
echo "2. Update your domain in the .env.local file"
echo "3. Run database migrations: npm run db:migrate"
echo "4. Create a user in your new Cognito User Pool"
echo "5. Run the app locally: npm run dev"
echo ""
echo "🎉 Deployment complete!"
