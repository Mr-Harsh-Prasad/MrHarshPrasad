import Hero from '@/components/sections/Hero';
import Education from '@/components/sections/Education';
import Achievements from '@/components/sections/Achievements';
import Skills from '@/components/sections/Skills';
import Projects from '@/components/sections/Projects';
import Certifications from '@/components/sections/Experience';
import ProfessionalExperience from '@/components/sections/ProfessionalExperience';
import Resume from '@/components/sections/Resume';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/sections/Footer';
import GlowingSeparator from '@/components/ui/GlowingSeparator';

/**
 * Home Page - Main portfolio page composing all sections
 */
export default function Home() {
  return (
    <main className="relative bg-black text-white">
      {/* Hero Section */}
      <Hero />
      <GlowingSeparator />

      {/* Education Section */}
      <Education />
      <GlowingSeparator />

      {/* Achievements Section */}
      <Achievements />
      <GlowingSeparator />

      {/* Skills Section - Technologies and abilities */}
      <Skills />
      <GlowingSeparator />

      {/* Projects Section - Portfolio showcases */}
      <Projects />
      <GlowingSeparator />

      {/* Professional Experience Section */}
      <ProfessionalExperience />
      <GlowingSeparator />

      {/* Certifications Section */}
      <Certifications />
      <GlowingSeparator />

      {/* Resume Section - Download CTA */}
      <Resume />
      <GlowingSeparator />

      {/* Contact Section - Get in touch form */}
      <Contact />

      {/* Footer */}
      <Footer />
    </main>
  );
}
