import { useTranslation } from 'react-i18next';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { Label, Input, Select, Textarea } from '../components/ui/Field';
import PropertyCard from '../components/property/PropertyCard';
import site from '../config/site';

// Dev-only page: the design system on one screen for client approval.

const colors = [
  ['paper', '#FFFFFF', 'page background'],
  ['paper-2', '#F3F5F8', 'recessed areas, hover fills'],
  ['ink', '#19222D', 'text'],
  ['ink-soft', '#5C6675', 'secondary text'],
  ['green', '#16375C', 'headings, prices, footer navy'],
  ['accent', '#1A6FE8', 'primary action only'],
  ['line', '#E3E7EC', 'borders'],
  ['white', '#FFFFFF', 'cards, inputs'],
];

// Clearly-labelled sample data; wiped before launch. Photos are placeholders.
const sampleProperties = [
  {
    title: { en: 'SAMPLE — 7 Marla house, Street 12' },
    slug: 'style-guide-sample-1',
    area: 'Hayatabad Phase 3',
    city: site.city,
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=640&q=60',
      },
    ],
    price: 32_500_000,
    areaSqFt: 7 * site.marlaSqFt,
    bedrooms: 5,
    bathrooms: 4,
    status: 'available',
    purpose: 'buy',
    type: 'house',
    isFeatured: true,
  },
  {
    title: { en: 'SAMPLE — 10 Marla upper portion' },
    slug: 'style-guide-sample-2',
    area: 'University Town',
    city: site.city,
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=640&q=60',
      },
    ],
    priceOnCall: true,
    areaSqFt: 10 * site.marlaSqFt,
    bedrooms: 3,
    bathrooms: 2,
    status: 'rented',
    purpose: 'rent',
    type: 'house',
  },
];

function Section({ title, children }) {
  return (
    <section className="mt-12">
      <h2 className="text-2xl text-green border-b border-line pb-2 mb-6">{title}</h2>
      {children}
    </section>
  );
}

export default function StyleGuide() {
  const { i18n } = useTranslation();
  const lang = i18n.resolvedLanguage;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-ink-soft">{site.businessName} · design system</p>
          <h1 className="text-4xl mt-1">Style guide</h1>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => i18n.changeLanguage(lang === 'en' ? 'ur' : 'en')}
        >
          {lang === 'en' ? 'اردو' : 'English'}
        </Button>
      </header>

      <Section title="Colors">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {colors.map(([name, hex, use]) => (
            <div key={name}>
              <div
                className="h-16 rounded-card border border-line"
                style={{ backgroundColor: hex }}
              />
              <p className="mt-1.5 text-sm font-medium">{name}</p>
              <p className="text-xs text-ink-soft">
                {hex} — {use}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Typography">
        <div className="space-y-5">
          <div>
            <p className="text-xs text-ink-soft mb-1">Heading / Inter semibold (Urdu: Noto Nastaliq Urdu)</p>
            <p className="text-4xl font-semibold tracking-tight">Three-bed house near Ring Road</p>
          </div>
          <div>
            <p className="text-xs text-ink-soft mb-1">Section heading</p>
            <p className="text-2xl font-semibold tracking-tight text-green">Recent listings in Peshawar</p>
          </div>
          <div>
            <p className="text-xs text-ink-soft mb-1">Body / Inter (Urdu: Noto Naskh Arabic)</p>
            <p className="max-w-prose text-[15px] leading-relaxed">
              Plot sizes, street width, and transfer status are stated as provided by the
              owner. Visit before you decide; we will arrange the visit and answer every
              question on the phone or in person.
            </p>
          </div>
          <div dir="rtl">
            <p dir="ltr" className="text-xs text-ink-soft mb-1">Urdu sample (RTL) — [UR REVIEW]</p>
            <p className="text-3xl font-urdu-heading leading-loose">رنگ روڈ کے قریب تین کمروں کا مکان</p>
            <p className="max-w-prose font-urdu-body mt-2">
              پلاٹ کا سائز، گلی کی چوڑائی اور انتقال کی صورتحال مالک کے بتائے مطابق درج ہے۔
              فیصلے سے پہلے وزٹ کریں؛ وزٹ کا انتظام ہم کریں گے۔
            </p>
          </div>
          <div>
            <p className="text-xs text-ink-soft mb-1">Price display</p>
            <p className="text-3xl font-bold tracking-tight text-green">1.25 Crore <span className="text-ink-soft text-lg font-normal">· 85 Lakh · Price on call</span></p>
          </div>
        </div>
      </Section>

      <Section title="Buttons">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="whatsapp">Ask on WhatsApp</Button>
          <Button>0315 9924831</Button>
          <Button variant="secondary">View details</Button>
          <Button size="sm">Search</Button>
          <Button disabled>Sending…</Button>
        </div>
        <p className="mt-3 text-sm text-ink-soft">
          One accent button per view. Tab onto any button to see the focus ring.
        </p>
      </Section>

      <Section title="Badges">
        <div className="flex flex-wrap gap-2">
          <Badge variant="available">Available</Badge>
          <Badge variant="sold">Sold</Badge>
          <Badge variant="rented">Rented</Badge>
          <Badge variant="featured">Featured</Badge>
          <Badge>For sale · House</Badge>
        </div>
      </Section>

      <Section title="Forms">
        <form className="grid gap-4 sm:grid-cols-2 max-w-2xl" onSubmit={(e) => e.preventDefault()}>
          <div>
            <Label htmlFor="sg-name">Name</Label>
            <Input id="sg-name" placeholder="Your name" />
          </div>
          <div>
            <Label htmlFor="sg-type">Property type</Label>
            <Select id="sg-type" defaultValue="house">
              {site.propertyTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </Select>
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="sg-msg">Message</Label>
            <Textarea id="sg-msg" placeholder="I want to ask about…" />
          </div>
          <div>
            <Button type="submit">Send</Button>
          </div>
        </form>
      </Section>

      <Section title="Property card">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sampleProperties.map((p) => (
            <PropertyCard key={p.slug} property={p} />
          ))}
        </div>
        <p className="mt-3 text-sm text-ink-soft">
          Sample data, marked SAMPLE. Photos are temporary placeholders until real
          listing photos are provided.
        </p>
      </Section>
    </div>
  );
}
