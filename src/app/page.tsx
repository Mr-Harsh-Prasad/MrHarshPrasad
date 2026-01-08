import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Taekwondo from '@/components/sections/Taekwondo';
import Skills from '@/components/sections/Skills';
import Projects from '@/components/sections/Projects';
import Experience from '@/components/sections/Experience';
import Resume from '@/components/sections/Resume';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/sections/Footer';

/**
 * Home Page - Main portfolio page composing all sections
 */
export default function Home() {
  return (
    <main className="relative">
      {/* Hero Section - Full viewport intro */}
      <Hero />

      {/* About Section - Personal introduction */}
      <About />

      {/* Taekwondo Section - Martial arts showcase */}
      <Taekwondo />

      {/* Skills Section - Technologies and abilities */}
      <Skills />

      {/* Projects Section - Portfolio showcases */}
      <Projects />

      {/* Experience Section - Practical learning */}
      <Experience />

      {/* Resume Section - Download CTA */}
      <Resume />

      {/* Contact Section - Get in touch form */}
      <Contact />

      {/* Footer */}
      <Footer />
    </main>
  );
}

