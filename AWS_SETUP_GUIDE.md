# AWS Setup Guide for Esports Platform

This guide will help you set up the necessary AWS services for the esports platform. You can either follow these manual steps or use the provided automation scripts for a faster setup.

## Prerequisites

- An AWS Account (Free Tier is sufficient)
- AWS CLI installed and configured (`aws configure`)
- Node.js and npm installed locally
- `jq` command-line JSON processor installed (for parsing script outputs)

---

## Option 1: Automated Setup (Recommended)

This is the fastest way to get started. The `deploy-aws.sh` script uses AWS CloudFormation to provision all necessary resources automatically.

### **Step 1: Run the Deployment Script**

Execute the following command in your project's root directory:

\`\`\`bash
./scripts/deploy-aws.sh
\`\`\`

This script defaults to the `ap-south-1` region. If you need to deploy to a different region, you can specify it as the second argument: `./scripts/deploy-aws.sh dev us-west-2`

The script will:
1.  Prompt you for a secure database password.
2.  Deploy the CloudFormation stack defined in `aws-infrastructure.yml`. This will create your Cognito User Pool, RDS database, S3 bucket, and all necessary networking and permissions. This process can take 10-15 minutes.
3.  Generate a `.env.dev` file containing the outputs (like IDs, endpoints, and bucket names) from the deployed resources.

### **Step 2: Configure Local Environment**

1.  **Rename the environment file:**
    \`\`\`bash
    mv .env.dev .env.local
    \`\`\`
2.  **Update the domain:** Open the new `.env.local` file and replace `https://your-domain.com` for `NEXTAUTH_URL` with your actual application domain (or `http://localhost:3000` for local testing).

### **Step 3: Run Database Migrations**

This script connects to your new RDS database and creates the required tables.

\`\`\`bash
npm run db:migrate
\`\`\`

### **Step 4: Create Your First User in Cognito**

Your backend is live, but you need a user to log in.

1.  Navigate to the **Amazon Cognito** service in your AWS Console.
2.  Select the `dev-esports-user-pool`.
3.  Go to the **Users** tab and click **Create user**.
4.  Use `admin@esports.com` as the email and username, and set a temporary password.
5.  Log in to your application. You'll be prompted to set a new, permanent password.

**Your setup is complete!** Your application is now connected to a live AWS backend.

---

## Option 2: Manual Setup

Follow these steps if you prefer to create and configure each service manually through the AWS Console.

### **Step 1: Set Up AWS Cognito (User Authentication)**

1.  **Create User Pool**: In the Cognito console, create a new user pool. Use `email` for sign-in. Add custom attributes `role` and `team` (both strings).
2.  **Create App Client**: Within the user pool, create an app client. **Do not** generate a client secret.
3.  **Create Identity Pool**: In the Cognito console, create a new identity pool. Link it to the User Pool and App Client ID from the previous steps.

### **Step 2: Set Up RDS Database (PostgreSQL)**

1.  **Create Database**: In the RDS console, create a new PostgreSQL database. Use the "Free tier" template. Set a master username and password. Name the initial database `esports_platform`.
2.  **Enable Public Access**: For development, enable public access so you can connect from your local machine.
3.  **Configure Security Group**: Edit the database's security group to allow inbound traffic on port `5432` from your IP address.

### **Step 3: Set Up S3 Bucket (File Storage)**

1.  **Create S3 Bucket**: In the S3 console, create a new bucket with a unique name.
2.  **Configure CORS**: In the bucket's "Permissions" tab, add a CORS configuration to allow `GET`, `PUT`, `POST`, `DELETE` methods from your application's domain.

### **Step 4: Configure Environment Variables**

Manually create a `.env.local` file and populate it with the credentials and endpoints from the services you created in the steps above. You can use `.env.example` as a template.

---

## Security Best Practices

- In production, disable public access to the RDS database and have your application access it through a VPC.
- Use IAM roles with least-privilege permissions.
- Enable Multi-Factor Authentication (MFA) on your root AWS account.
\`\`\`

\`\`\`shellscript file="scripts/deploy-aws.sh"
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
# AWS Configuration
AWS_REGION=ap-south-1

# Cognito Configuration
AWS_COGNITO_USER_POOL_ID=ap-south-1_xxxxxxxxx
AWS_COGNITO_USER_POOL_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
AWS_COGNITO_IDENTITY_POOL_ID=ap-south-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
AWS_COGNITO_DOMAIN=https://your-domain.auth.ap-south-1.amazoncognito.com

# RDS Configuration
AWS_RDS_HOST=esports-platform-db.xxxxxxxxxx.ap-south-1.rds.amazonaws.com
AWS_RDS_PORT=5432
AWS_RDS_DATABASE=esports_platform
AWS_RDS_USERNAME=postgres
AWS_RDS_PASSWORD=your-strong-password

# S3 Configuration
AWS_S3_BUCKET=esports-platform-assets-xxxxxxxxx
AWS_S3_REGION=ap-south-1

# API Gateway (optional)
AWS_API_GATEWAY_URL=https://xxxxxxxxxx.execute-api.ap-south-1.amazonaws.com/prod
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
