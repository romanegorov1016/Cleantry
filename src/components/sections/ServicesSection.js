"use client";

import { ServiceOptionCard } from "@/components/services/ServiceOptionCard";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { getServicesSectionContent } from "@/config/services";
import { navigateToCalculatorWithSelection } from "@/lib/calculatorPrefill";
import { SECTION_IDS, SECTION_PADDING, SECTION_SCROLL_MARGIN } from "@/lib/constants";

export function ServicesSection({ content, onSelect } = {}) {
  const sectionContent = content ?? getServicesSectionContent();
  const {
    eyebrow,
    title,
    description,
    ctaLabel,
    propertyTypes,
    cleaningFormats,
    extrasNote,
  } = sectionContent;

  const handleSelect =
    onSelect ??
    ((selection) => {
      navigateToCalculatorWithSelection(selection);
    });

  return (
    <section
      id={SECTION_IDS.services}
      className={`bg-white ${SECTION_PADDING} ${SECTION_SCROLL_MARGIN}`}
    >
      <Container>
        <SectionHeader
          eyebrow={eyebrow}
          title={title}
          description={description}
        />

        <div className="mt-14 space-y-12">
          <ServicesBlock
            id={propertyTypes.id}
            title={propertyTypes.title}
            items={propertyTypes.items}
            ctaLabel={ctaLabel}
            onSelect={handleSelect}
          />

          <ServicesBlock
            id={cleaningFormats.id}
            title={cleaningFormats.title}
            items={cleaningFormats.items}
            ctaLabel={ctaLabel}
            onSelect={handleSelect}
          />

          {extrasNote && (
            <aside
              data-testid="services-extras-note"
              className="rounded-3xl border border-emerald-100 bg-emerald-50/60 px-6 py-5 text-sm leading-relaxed text-slate-600"
            >
              <p>
                <span className="font-semibold text-emerald-800">
                  {extrasNote.label}
                </span>
                {" — "}
                {extrasNote.description}
              </p>
            </aside>
          )}
        </div>
      </Container>
    </section>
  );
}

/**
 * @param {{
 *   id: string,
 *   title: string,
 *   items: Array<{
 *     id: string,
 *     title: string,
 *     description: string,
 *     icon: string,
 *     kind: 'propertyType' | 'cleaningFormat',
 *     sourceId: string,
 *   }>,
 *   ctaLabel: string,
 *   onSelect: (selection: {
 *     kind: 'propertyType' | 'cleaningFormat',
 *     id: string,
 *     sourceId: string,
 *   }) => void,
 * }} props
 */
function ServicesBlock({ id, title, items, ctaLabel, onSelect }) {
  return (
    <section aria-labelledby={`${id}-heading`} className="space-y-6">
      <h3
        id={`${id}-heading`}
        className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl"
      >
        {title}
      </h3>
      <ul className="grid list-none gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.id} className="h-full">
            <ServiceOptionCard
              item={item}
              ctaLabel={ctaLabel}
              onSelect={onSelect}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
