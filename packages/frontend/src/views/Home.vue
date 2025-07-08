<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white py-20">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-5xl md:text-6xl font-bold mb-6">
          KBU TalentChain
        </h1>
        <p class="text-xl md:text-2xl mb-8 opacity-90">
          Decentralized Verification Platform for Academic and Professional Certificates
        </p>
        <p class="text-lg mb-10 max-w-3xl mx-auto opacity-80">
          Secure, verifiable, and tamper-proof certificates using Web3 technology and 
          Decentralized Identity (DID). Issue, verify, and manage credentials with complete trust.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link 
            to="/auth" 
            class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Get Started
          </router-link>
          <router-link 
            to="/verify" 
            class="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
          >
            Verify Certificate
          </router-link>
        </div>
      </div>
    </section>

    <!-- Explanation Cards -->
    <section class="py-16 bg-gray-50">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12 text-gray-800">
          How TalentChain Works
        </h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div class="bg-white p-8 rounded-xl shadow-lg text-center">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-4 text-gray-800">Secure Issuance</h3>
            <p class="text-gray-600">
              Educational institutions and employers can issue tamper-proof digital certificates 
              stored as NFTs on the blockchain with IPFS metadata storage.
            </p>
          </div>

          <div class="bg-white p-8 rounded-xl shadow-lg text-center">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-4 text-gray-800">Instant Verification</h3>
            <p class="text-gray-600">
              Anyone can verify certificates instantly by checking the blockchain. 
              No need to contact issuing institutions for verification.
            </p>
          </div>

          <div class="bg-white p-8 rounded-xl shadow-lg text-center">
            <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-4 text-gray-800">AI-Powered</h3>
            <p class="text-gray-600">
              Smart certificate extraction from documents and natural language verification 
              queries powered by GPT-4 for enhanced user experience.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12 text-gray-800">
          Platform Features
        </h2>
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="text-center p-6">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-3a1 1 0 011-1h2.586l6.982-6.982a6 6 0 010-8.486z"></path>
              </svg>
            </div>
            <h4 class="font-semibold mb-2">DID Authentication</h4>
            <p class="text-sm text-gray-600">Secure wallet-based authentication using Decentralized Identity</p>
          </div>

          <div class="text-center p-6">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
            </div>
            <h4 class="font-semibold mb-2">NFT Certificates</h4>
            <p class="text-sm text-gray-600">Certificates minted as NFTs for true ownership and transferability</p>
          </div>

          <div class="text-center p-6">
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <h4 class="font-semibold mb-2">Reputation System</h4>
            <p class="text-sm text-gray-600">Community-driven reputation scoring for enhanced trust</p>
          </div>

          <div class="text-center p-6">
            <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 4v10a2 2 0 002 2h6a2 2 0 002-2V8M7 8h10M9 12h6M9 16h6"></path>
              </svg>
            </div>
            <h4 class="font-semibold mb-2">IPFS Storage</h4>
            <p class="text-sm text-gray-600">Decentralized metadata storage ensuring data permanence</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="py-16 bg-gray-800 text-white">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold mb-6">Ready to Get Started?</h2>
        <p class="text-xl mb-8 opacity-90">
          Join the future of credential verification with blockchain technology
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link 
            to="/auth" 
            class="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Connect Wallet
          </router-link>
          <a 
            href="#" 
            class="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-800 transition-colors"
          >
            Learn More
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// No additional logic needed for this component
</script>

<style scoped>
.hero {
  background-image: 
    radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3), transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3), transparent 50%),
    radial-gradient(circle at 40% 80%, rgba(120, 219, 255, 0.3), transparent 50%);
}

.container {
  max-width: 1200px;
}
</style>