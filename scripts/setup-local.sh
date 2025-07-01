#!/bin/bash

echo "🚀 Setting up Esports Platform..."

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cat > .env.local << EOL
# Development Configuration
NODE_ENV=development

# AWS Configuration (Leave empty for local development)
AWS_REGION=us-east-1
AWS_COGNITO_USER_POOL_ID=
AWS_COGNITO_USER_POOL_CLIENT_ID=
AWS_COGNITO_IDENTITY_POOL_ID=
AWS_COGNITO_DOMAIN=
AWS_RDS_HOST=localhost
AWS_RDS_PORT=5432
AWS_RDS_DATABASE=esports_platform
AWS_RDS_USERNAME=postgres
AWS_RDS_PASSWORD=password
AWS_S3_BUCKET=
AWS_S3_REGION=us-east-1
AWS_API_GATEWAY_URL=http://localhost:3000/api

# Development Mode (enables mock data)
DEVELOPMENT_MODE=true
EOL
    echo "✅ Created .env.local with development settings"
else
    echo "✅ .env.local already exists"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo "🎮 Setup complete!"
echo ""
echo "🔥 Quick Start:"
echo "1. Run 'npm run dev' to start the development server"
echo "2. Open http://localhost:3000 in your browser"
echo "3. Login with: admin@esports.com / password123"
echo ""
echo "👥 Test Accounts:"
echo "• Admin: admin@esports.com / password123"
echo "• Manager: manager@esports.com / password123"
echo "• Coach: coach@esports.com / password123"
echo "• Analyst: analyst@esports.com / password123"
echo "• Player: player@esports.com / password123"
echo ""
echo "📚 For AWS setup, see AWS_SETUP_GUIDE.md"
echo ""
echo "🚀 Ready to go! Run 'npm run dev' to start!"
