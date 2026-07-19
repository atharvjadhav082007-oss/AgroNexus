import { Leaf, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 text-gray-400 pt-16 pb-8 border-t border-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Column 1: Branding & Intro */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-tr from-[#2E7D32] to-[#81C784]">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="text-white text-lg font-bold">KhetSeva</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Empowering farmers with AI-driven weather predictions, crop suggestions, and financial risk models to build a resilient agricultural ecosystem.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="hover:text-white transition-colors p-1.5 rounded-full bg-gray-900 hover:bg-[#2E7D32]">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z"/>
                </svg>
              </a>
              <a href="#" className="hover:text-white transition-colors p-1.5 rounded-full bg-gray-900 hover:bg-[#2E7D32]">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.95 4.57a10 10 0 01-2.82.77 4.96 4.96 0 002.16-2.72c-.95.57-2 .98-3.13 1.2a4.93 4.93 0 00-8.4 4.48c-4.1-.2-7.73-2.17-10.17-5.15a4.9 4.9 0 001.52 6.57c-.8-.03-1.57-.25-2.24-.62a4.93 4.93 0 003.95 4.83c-.7.2-1.47.23-2.2.08a4.93 4.93 0 004.6 3.42A9.9 9.9 0 010 19.54a13.94 13.94 0 007.55 2.21c9.05 0 14-7.5 14-14 0-.21 0-.43-.02-.65 1-.7 1.8-1.56 2.42-2.53z"/>
                </svg>
              </a>
              <a href="#" className="hover:text-white transition-colors p-1.5 rounded-full bg-gray-900 hover:bg-[#2E7D32]">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.22.41a4.87 4.87 0 011.77 1.15c.5.5.85 1.1 1.15 1.77.16.42.36 1.05.41 2.22.06 1.27.07 1.64.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.22a4.87 4.87 0 01-1.15 1.77c-.5.5-1.1.85-1.77 1.15-.42.16-1.05.36-2.22.41-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.22-.41a4.87 4.87 0 01-1.15-1.77c-.5-.5-.85-1.1-1.15-1.77-.16-.42-.36-1.05-.41-2.22C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.22.3-.67.65-1.27 1.15-1.77a4.87 4.87 0 011.77-1.15c.42-.16 1.05-.36 2.22-.41 1.27-.06 1.64-.07 4.85-.07M12 2C8.74 2 8.33 2.01 7.05 2.07c-1.27.06-2.14.26-2.9.56a7.25 7.25 0 00-2.62 1.7A7.25 7.25 0 00.17 6.95c-.3.76-.5 1.63-.56 2.9C0 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.14.56 2.9a7.25 7.25 0 001.7 2.62 7.25 7.25 0 002.62 1.7c.76.3 1.63.5 2.9.56 1.28.06 1.69.07 4.95.07s3.67-.01 4.95-.07c1.27-.06 2.14-.26 2.9-.56a7.25 7.25 0 002.62-1.7 7.25 7.25 0 001.7-2.62c.3-.76.5-1.63.56-2.9.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.14-.56-2.9a7.25 7.25 0 00-1.7-2.62 7.25 7.25 0 00-2.62-1.7c-.76-.3-1.63-.5-2.9-.56C15.67 2 15.26 2 12 2zm0 4.86c-2.84 0-5.14 2.3-5.14 5.14 0 2.84 2.3 5.14 5.14 5.14 2.84 0 5.14-2.3 5.14-5.14 0-2.84-2.3-5.14-5.14-5.14zm0 8.57c-1.9 0-3.43-1.53-3.43-3.43 0-1.9 1.53-3.43 3.43-3.43 1.9 0 3.43 1.53 3.43 3.43 0 1.9-1.53 3.43-3.43 3.43zm6.4-9.33c0-.68-.55-1.23-1.23-1.23-.68 0-1.23.55-1.23 1.23 0 .68.55 1.23 1.23 1.23.68 0 1.23-.55 1.23-1.23z"/>
                </svg>
              </a>
              <a href="#" className="hover:text-white transition-colors p-1.5 rounded-full bg-gray-900 hover:bg-[#2E7D32]">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#home" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#solutions" className="hover:text-white transition-colors">Solutions</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">Resources</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Mandi Prices</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Weather Forecasting</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Govt Schemes Portal</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pest Identification</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API Documentation</a></li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">Contact Us</h4>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="w-4.5 h-4.5 text-[#81C784] shrink-0 mt-0.5" />
                <span>Krishi Bhawan, New Delhi, India</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4.5 h-4.5 text-[#81C784] shrink-0" />
                <span>+91 1800-180-1551</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-4.5 h-4.5 text-[#81C784] shrink-0" />
                <span>support@khetseva.gov.in</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-gray-900 flex flex-col sm:flex-row justify-between items-center text-xs">
          <p>&copy; {currentYear} KhetSeva (AgroNexus). All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
