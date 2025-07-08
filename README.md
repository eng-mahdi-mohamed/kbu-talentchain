# KBU TalentChain

**KBU TalentChain** is a comprehensive decentralized employment platform that enables educational institutions and employers to issue, verify, and manage professional certificates and work experience securely and transparently using Web3 and blockchain technologies.

---

## Table of Contents

- [About](#about)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [How It Works](#how-it-works)
- [Getting Started](#getting-started)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## About

In today’s competitive job market, verifying academic and professional credentials is critical for trust and transparency.  
**KBU TalentChain** leverages blockchain technology to provide tamper-proof, easily verifiable digital certificates (NFTs) and professional records, bridging the gap between job seekers, educational institutions, and employers.

---

## Features

- **Institution Registration & Accreditation**  
  Educational and professional institutions can register and get accredited to issue verified digital certificates.

- **Certificate Issuance as NFTs**  
  Certificates are issued as blockchain NFTs ensuring immutability and privacy (no personal data stored on-chain).

- **User Profile & Certificate Management**  
  Job seekers upload their certificates and link them to verified NFTs on the blockchain.

- **Employer Verification & Reputation System**  
  Employers can verify candidate credentials instantly and endorse their skills, contributing to a reputation score.

- **Multi-Platform Support**  
  - Web frontend built with Vue.js  
  - Mobile applications developed in Flutter  
  - Backend API powered by Nest.js and Prisma

- **Decentralized Identity & Security**  
  Integrates Web3 protocols to maintain secure decentralized identities and trust.

---

## Technology Stack

| Layer          | Technology           |
|----------------|----------------------|
| Backend API    | Nest.js, Prisma ORM  |
| Database       | PostgreSQL           |
| Frontend Web   | Vue.js               |
| Mobile Apps    | Flutter              |
| Blockchain     | Ethereum-based NFTs  |
| DevOps & CI/CD | Docker, GitHub Actions |

---

## How It Works

1. **Institution Onboarding**  
   Institutions submit registration requests and are verified by platform admins.

2. **Certificate Issuance**  
   Verified institutions issue certificates as NFTs linked to their profiles.

3. **User Upload**  
   Job seekers upload their certificates files and link NFT hashes.

4. **Verification**  
   Employers query the platform to verify authenticity via on-chain data.

5. **Reputation & Endorsement**  
   Employers can endorse candidates’ certificates, improving their reputation score.

---

## Getting Started

### Prerequisites

- Node.js (v16+)
- PostgreSQL
- Flutter SDK (for mobile development)
- Docker (optional for local dev environment)

### Installation

```bash
# Clone the repo
git clone https://github.com/your-org/kbu-talentchain.git
cd kbu-talentchain

# Install backend dependencies
cd apps/backend
npm install

# Setup database
npx prisma migrate dev

# Run backend server
npm run start:dev

# For frontend (in new terminal)
cd ../web
npm install
npm run serve

# For mobile app
cd ../mobile
flutter pub get
flutter run
```

---

## Contributing

We welcome contributions from the community! Whether it's a bug fix, new feature, or improvement to documentation,
please feel free to open a pull request or an issue.

To contribute:
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a pull request

Please refer to [CONTRIBUTING.md](CONTRIBUTING.md) for detailed contribution guidelines.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Contact

For support, questions, or feedback:
- 📧 Email: support@kbutalentchain.com
- 🌐 Website: [https://kbutalentchain.com](https://kbutalentchain.com)
- 🐙 GitHub: [github.com/Kbunet/kbu-talentchain](https://github.com/Kbunet/kbu-talentchain)