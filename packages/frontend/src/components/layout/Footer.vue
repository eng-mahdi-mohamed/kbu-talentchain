<template>
  <footer class="bg-gray-800 text-white py-12 mt-auto">
    <div class="container mx-auto px-4">
      <div class="grid md:grid-cols-4 gap-8">
        <!-- Brand -->
        <div class="md:col-span-1">
          <div class="flex items-center space-x-3 mb-4">
            <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <span class="text-xl font-bold">TalentChain</span>
          </div>
          <p class="text-gray-400 text-sm">
            Decentralized verification platform for academic and professional certificates using Web3 and DID technology.
          </p>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="font-semibold mb-4">Platform</h3>
          <ul class="space-y-2 text-sm">
            <li>
              <router-link to="/verify" class="text-gray-400 hover:text-white transition-colors">
                Verify Certificate
              </router-link>
            </li>
            <li>
              <router-link to="/auth" class="text-gray-400 hover:text-white transition-colors">
                Connect Wallet
              </router-link>
            </li>
            <li>
              <router-link to="/dashboard" class="text-gray-400 hover:text-white transition-colors">
                Dashboard
              </router-link>
            </li>
            <li>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                Documentation
              </a>
            </li>
          </ul>
        </div>

        <!-- Technology -->
        <div>
          <h3 class="font-semibold mb-4">Technology</h3>
          <ul class="space-y-2 text-sm">
            <li>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                Blockchain
              </a>
            </li>
            <li>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                IPFS Storage
              </a>
            </li>
            <li>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                DID Integration
              </a>
            </li>
            <li>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                AI Features
              </a>
            </li>
          </ul>
        </div>

        <!-- Support -->
        <div>
          <h3 class="font-semibold mb-4">Support</h3>
          <ul class="space-y-2 text-sm">
            <li>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                Help Center
              </a>
            </li>
            <li>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                Contact Us
              </a>
            </li>
            <li>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
        <p>&copy; 2024 KBU TalentChain. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.container {
  max-width: 1200px;
}
</style>