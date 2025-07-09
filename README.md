# KBU TalentChain

A decentralized verification platform for academic and professional certificates using Web3 and DID technology. KBU TalentChain enables educational institutions and employers to issue NFT-based certificates and verify them publicly via blockchain, offering job seekers a secure and verifiable credential ecosystem.

## 🚀 Features

- **Decentralized Identity (DID)**: Wallet-based authentication using Ethereum
- **NFT Certificates**: Tamper-proof certificates minted as NFTs on blockchain
- **IPFS Storage**: Decentralized metadata storage for certificate data
- **AI-Powered**: GPT-4 integration for certificate extraction and verification queries
- **Reputation System**: Community-driven trust scoring
- **Multi-Role Support**: Users, Institutions, Employers, and Administrators
- **Real-time Verification**: Instant certificate validation via blockchain

## 🏗️ Architecture

### Tech Stack

- **Backend**: NestJS with TypeScript
- **Frontend**: Vue 3 + TypeScript + Vite
- **Database**: PostgreSQL with Prisma ORM
- **Blockchain**: Custom Web3 integration with ethers.js
- **Storage**: IPFS for decentralized file storage
- **AI**: OpenAI GPT-4 for smart features
- **Authentication**: DID-based wallet authentication

### Project Structure

```
kbu-talentchain/
├── packages/
│   ├── backend/                 # NestJS API server
│   │   ├── src/
│   │   │   ├── auth/           # Authentication module
│   │   │   ├── users/          # User management
│   │   │   ├── certificates/   # Certificate operations
│   │   │   ├── institutions/   # Institution management
│   │   │   ├── employers/      # Employer management
│   │   │   ├── verification/   # Certificate verification
│   │   │   ├── reputation/     # Reputation system
│   │   │   ├── ai/            # AI-powered features
│   │   │   ├── blockchain/     # Web3 integration
│   │   │   ├── ipfs/          # IPFS integration
│   │   │   └── prisma/        # Database layer
│   │   └── prisma/
│   │       └── schema.prisma   # Database schema
│   ├── frontend/               # Vue.js application
│   │   ├── src/
│   │   │   ├── components/     # Reusable components
│   │   │   ├── views/         # Page components
│   │   │   ├── stores/        # Pinia state management
│   │   │   ├── services/      # API and wallet services
│   │   │   ├── types/         # TypeScript definitions
│   │   │   └── assets/        # Static assets
│   │   └── public/
│   └── shared/                 # Shared utilities and types
├── package.json               # Root workspace configuration
└── README.md
```

## 📊 Database Schema

### Core Entities

- **Users**: DID-based user accounts with role-based access
- **Institutions**: Educational institutions issuing academic certificates  
- **Employers**: Companies issuing experience certificates
- **Certificates**: NFT-based certificates with blockchain verification
- **VerificationLogs**: Public record of verification events
- **Reputation**: Community trust scoring system

## 🔐 Authentication Flow

1. User connects Web3 wallet (MetaMask)
2. Generate DID from wallet address
3. Sign authentication message with wallet
4. Backend verifies signature and issues JWT
5. Automatic user registration for new DIDs

## 🎯 User Flows

### Certificate Issuance
1. Institution/Employer creates certificate with metadata
2. System generates unique hash of certificate content
3. Metadata uploaded to IPFS for decentralized storage
4. NFT minted on blockchain with IPFS metadata URI
5. Certificate stored in database with blockchain reference

### Certificate Verification  
1. Verifier provides certificate hash or holder DID
2. System queries blockchain for certificate validity
3. Verification result logged publicly
4. Certificate details and history displayed

### AI Features
- **Smart Certificate Assistant**: Extract data from uploaded documents
- **Natural Verification Chat**: Query certificates using natural language

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login` - DID-based login
- `GET /api/auth/nonce` - Get signing nonce
- `GET /api/auth/message` - Get login message

### Certificates
- `GET /api/certificates` - List certificates
- `POST /api/certificates` - Issue new certificate
- `GET /api/certificates/:id` - Get certificate details
- `POST /api/verification/verify` - Verify certificate

### Users & Entities
- `GET /api/users` - List users (admin)
- `POST /api/institutions` - Register institution
- `POST /api/employers` - Register employer

## 🎨 Frontend Pages

- **Home** (`/`) - Landing page with platform overview
- **Auth** (`/auth`) - Wallet connection and DID binding
- **User Dashboard** (`/dashboard`) - Personal certificate management
- **Institution Dashboard** (`/institution`) - Certificate issuance for institutions
- **Employer Dashboard** (`/employer`) - Experience certificate management
- **Admin Panel** (`/admin`) - System administration
- **Verification** (`/verify`) - Public certificate verification

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- IPFS node (optional - uses mock mode)
- Web3 wallet (MetaMask)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kbu-talentchain
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   # Backend (.env in packages/backend/)
   DATABASE_URL="postgresql://username:password@localhost:5432/kbu_talentchain"
   JWT_SECRET="your-super-secret-jwt-key"
   OPENAI_API_KEY="your-openai-api-key"
   BLOCKCHAIN_RPC_URL="http://localhost:8545"
   IPFS_HOST="localhost"
   ```

4. **Setup database**
   ```bash
   npm run setup:backend
   ```

5. **Start development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend API: http://localhost:3001
   - Frontend App: http://localhost:3000
   - API Documentation: http://localhost:3001/api/docs

## 🔧 Configuration

### Blockchain Setup
- Configure your custom Web3 network in environment variables
- Deploy the certificate NFT contract
- Update contract address in configuration

### IPFS Setup
- Install and run local IPFS node, or
- Use a hosted IPFS service
- System falls back to mock mode if IPFS is unavailable

### AI Features
- Add OpenAI API key for GPT-4 integration
- Configure certificate extraction prompts
- Set up natural language query processing

## 📱 Mobile Support

The platform includes responsive design for mobile devices and can be extended with the planned Flutter mobile application for:
- Mobile certificate viewing
- QR code scanning for verification
- Push notifications for certificate updates

## 🛡️ Security Features

- **DID-based Authentication**: No traditional passwords
- **Blockchain Verification**: Tamper-proof certificate storage
- **Signature Validation**: Cryptographic proof of authenticity
- **Role-based Access Control**: Granular permissions
- **Rate Limiting**: API protection against abuse

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Links

- [API Documentation](http://localhost:3001/api/docs)
- [Frontend Application](http://localhost:3000)
- [Project Repository](https://github.com/kbu-university/talentchain)

## � Support

For support and questions:
- Email: support@kbu.edu
- Documentation: [docs.talentchain.kbu.edu]
- Community: [community.talentchain.kbu.edu]