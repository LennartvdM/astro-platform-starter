import React from 'react';
import ScrollSnap from '../components/ScrollSnap';
import SectionManager from '../components/SectionManager';
import HeroSection from '../components/sections/HeroSection';
import SkillsSection from '../components/sections/SkillsSection';
import ProjectsSection from '../components/sections/ProjectsSection';
import ContactSection from '../components/sections/ContactSection';
import MedicalSection from '../components/sections/MedicalSection';
import MedicalSectionV2 from '../components/sections/MedicalSectionV2';
import MedicalSectionV3 from '../components/sections/MedicalSectionV3';

const sections = [
  { name: 'one', component: HeroSection },
  { name: 'two', component: SkillsSection },
  { name: 'three', component: MedicalSection },
  { name: 'four', component: MedicalSectionV2 },
  { name: 'five', component: MedicalSectionV3 },
  { name: 'six', component: ProjectsSection },
  { name: 'seven', component: ContactSection },
];

const Home = () => {
  return (
    <ScrollSnap>
      <SectionManager sections={sections} />
    </ScrollSnap>
  );
};

export default Home; 