import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {/* Procom Info */}
        <div>
          <h2 className="text-xl font-bold">PROCOM</h2>
          <p className="mt-2 text-sm text-gray-400">
            Since 1998, PROCOM has been one of the most prestigious and long-standing events at FAST Karachi. 
            It bridges students and the professional world through annual job fairs, panel discussions, competitions, and startup showcases.
          </p>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-lg font-semibold">Categories</h3>
          <ul className="mt-2 space-y-1 text-gray-400">
            {["Computer Science", "Electrical Engineering", "Artificial Intelligence", "Business", "General", "Gaming"].map((category) => (
              <li key={category} className="hover:text-white transition">
                {category}
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold">Quick Links</h3>
          <ul className="mt-2 space-y-1 text-gray-400">
            {["Home", "About Us", "Register", "Modules", "Sponsors", "Contact Us"].map((link) => (
              <li key={link}>
                <Link href={`/${link.toLowerCase().replace(/\s/g, "-")}`} className="hover:text-white transition">
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold">Contact</h3>
          <ul className="mt-2 space-y-1 text-gray-400">
            {[
              { name: "Parshant, Participant Relations", phone: "+92 332 2598600" },
              { name: "Abdullah, Participant Relations", phone: "+92 334 2945871" },
              { name: "Sareem, Director Marketing", phone: "+92 315 2098191" },
              { name: "Mubin, Director Computing", phone: "+92 335 2958201" },
            ].map((contact) => (
              <li key={contact.phone} className="hover:text-white transition">
                {contact.name}: <a href={`tel:${contact.phone}`} className="underline">{contact.phone}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-12 border-t border-gray-700 text-center py-4 text-gray-400 text-sm">
        <p>FAST National University, Karachi</p>
        <p>Procom'25 | All rights reserved</p>
      </div>
    </footer>
  );
}
