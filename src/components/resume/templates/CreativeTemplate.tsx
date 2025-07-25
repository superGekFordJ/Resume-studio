'use client';

import { RenderableResume, RenderableSection } from '@/types/schema';
import { Mail, Phone, Linkedin, Github, Globe, MapPin } from 'lucide-react';
import { BadgeListComponent } from '../rendering/BadgeListComponent';
import { TitledBlockComponent } from '../rendering/TitledBlockComponent';
import { SimpleListComponent } from '../rendering/SimpleListComponent';
import { SingleTextComponent } from '../rendering/SingleTextComponent';
import { ProjectItemComponent } from '../rendering/ProjectItemComponent';
import { CertificationItemComponent } from '../rendering/CertificationItemComponent';
import { AdvancedSkillsComponent } from '../rendering/AdvancedSkillsComponent';
import { CoverLetterComponent } from '../rendering/CoverLetterComponent';
import { SchemaRegistry } from '@/lib/schemaRegistry';
import Image from 'next/image';

interface CreativeTemplateProps {
  resume: RenderableResume;
}

// Reusable rendering dispatcher - uses default or template override
const renderSectionByRenderType = (section: RenderableSection) => {
  // Creative template's layout preferences
  const templateLayoutMap: Record<string, string> = {
    // Creative template uses default layouts but with custom styling
    projects: 'project-list',
    certifications: 'certification-list',
    'advanced-skills': 'advanced-skills-list',
  };

  // Get role map for this section synchronously
  const schemaRegistry = SchemaRegistry.getInstance();
  const roleMap = schemaRegistry.getRoleMap(section.schemaId);

  // Use template override if exists, otherwise use schema default
  const finalRenderType =
    templateLayoutMap[section.schemaId] ||
    section.defaultRenderType ||
    'default';

  switch (finalRenderType) {
    case 'simple-list':
      return <SimpleListComponent section={section} roleMap={roleMap} />;
    case 'badge-list':
      return <BadgeListComponent section={section} roleMap={roleMap} />;
    case 'timeline':
      return section.items.map((item) => (
        <TitledBlockComponent key={item.id} item={item} roleMap={roleMap} />
      ));
    case 'single-text':
      return <SingleTextComponent items={section.items} roleMap={roleMap} />;
    case 'project-list':
      return section.items.map((item) => (
        <ProjectItemComponent key={item.id} item={item} roleMap={roleMap} />
      ));
    case 'certification-list':
      return section.items.map((item) => (
        <CertificationItemComponent
          key={item.id}
          item={item}
          roleMap={roleMap}
        />
      ));
    case 'advanced-skills-list':
      return section.items.map((item) => (
        <AdvancedSkillsComponent key={item.id} item={item} roleMap={roleMap} />
      ));
    case 'cover-letter':
      return <CoverLetterComponent section={section} roleMap={roleMap} />;
    default:
      // Generic fallback rendering
      return section.items.map((item) => (
        <div key={item.id} className="mb-2">
          {item.fields.map((field) => (
            <div key={field.key}>
              {Array.isArray(field.value) ? (
                <span>{field.value.join(', ')}</span>
              ) : (
                <span>{field.value}</span>
              )}
            </div>
          ))}
        </div>
      ));
  }
};

const CreativeTemplate = ({ resume }: CreativeTemplateProps) => {
  const { personalDetails, sections } = resume;

  const hasCoverLetter = sections.some((s) => s.schemaId === 'cover-letter');

  // Define which sections go into which column
  const sidebarSections = [
    'skills',
    'advanced-skills',
    'languages',
    'certifications',
  ];

  const mainColumnSections = sections.filter(
    (s) => !sidebarSections.includes(s.schemaId)
  );
  const sideColumnSections = sections.filter((s) =>
    sidebarSections.includes(s.schemaId)
  );

  const coverLetterSection = sections.find(
    (s) => s.schemaId === 'cover-letter'
  );

  return (
    <div className="text-[11px] leading-[1.4] h-full flex gap-0">
      {/* Sidebar Column - Left */}
      <div className="w-1/3 bg-gray-50 p-4 border-r border-gray-200">
        {/* Avatar and Basic Info */}
        <div className="text-center mb-6">
          {personalDetails.avatar && (
            <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-3 border-4 border-primary/20">
              <Image
                src={personalDetails.avatar}
                alt={personalDetails.fullName}
                className="w-full h-full object-cover"
                width={96}
                height={96}
              />
            </div>
          )}
          <h1 className="font-bold text-lg mb-1 text-gray-800">
            {personalDetails.fullName}
          </h1>
          <p className="text-sm text-primary font-medium">
            {personalDetails.jobTitle}
          </p>
        </div>

        {/* Contact Info */}
        <div className="mb-6 space-y-2">
          <h3 className="font-semibold text-xs uppercase tracking-wider text-gray-600 mb-3">
            Contact
          </h3>
          {personalDetails.email && (
            <div className="flex items-center gap-2 text-[10px]">
              <Mail size={12} className="text-gray-400" />
              <span className="text-gray-700">{personalDetails.email}</span>
            </div>
          )}
          {personalDetails.phone && (
            <div className="flex items-center gap-2 text-[10px]">
              <Phone size={12} className="text-gray-400" />
              <span className="text-gray-700">{personalDetails.phone}</span>
            </div>
          )}
          {personalDetails.linkedin && (
            <div className="flex items-center gap-2 text-[10px]">
              <Linkedin size={12} className="text-gray-400" />
              <span className="text-gray-700">{personalDetails.linkedin}</span>
            </div>
          )}
          {personalDetails.github && (
            <div className="flex items-center gap-2 text-[10px]">
              <Github size={12} className="text-gray-400" />
              <span className="text-gray-700">{personalDetails.github}</span>
            </div>
          )}
          {personalDetails.portfolio && (
            <div className="flex items-center gap-2 text-[10px]">
              <Globe size={12} className="text-gray-400" />
              <span className="text-gray-700">{personalDetails.portfolio}</span>
            </div>
          )}
          {personalDetails.address && (
            <div className="flex items-center gap-2 text-[10px]">
              <MapPin size={12} className="text-gray-400" />
              <span className="text-gray-700">{personalDetails.address}</span>
            </div>
          )}
        </div>

        {/* Sidebar Sections */}
        {!hasCoverLetter &&
          sideColumnSections.map((section) => (
            <div key={section.id} className="mb-6">
              <h3 className="font-semibold text-xs uppercase tracking-wider text-gray-600 mb-3">
                {section.title}
              </h3>
              <div className="text-[10px]">
                {renderSectionByRenderType(section)}
              </div>
            </div>
          ))}
      </div>

      {/* Main Column - Right */}
      <div className="flex-1 p-6">
        {hasCoverLetter && coverLetterSection ? (
          <div className="mb-6">
            <h2 className="font-bold text-base text-primary border-b-2 border-primary pb-1 mb-3">
              {coverLetterSection.title || 'Cover Letter'}
            </h2>
            {renderSectionByRenderType(coverLetterSection)}
          </div>
        ) : (
          mainColumnSections.map((section) => (
            <div key={section.id} className="mb-6">
              <h2 className="font-bold text-base text-primary border-b-2 border-primary pb-1 mb-3">
                {section.title}
              </h2>
              {renderSectionByRenderType(section)}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CreativeTemplate;
