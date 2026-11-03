import { useTranslation } from 'react-i18next';
import site from '../../config/site';
import { whatsappLink } from '../../lib/whatsapp';
import { WhatsAppIcon, PhoneIcon } from '../ui/icons';

// Always-visible direct contact: WhatsApp and call, fixed to the end side
// of the viewport (mirrors automatically in RTL).
export default function FloatingContact() {
  const { t } = useTranslation();

  return (
    <div className="fixed bottom-5 end-4 z-40 flex flex-col gap-2.5">
      <a
        href={whatsappLink(t('home.waGeneric'))}
        target="_blank"
        rel="noopener"
        aria-label={t('actions.whatsapp')}
        title={t('actions.whatsapp')}
        className="flex h-13 w-13 items-center justify-center rounded-full bg-[#1DA851] text-white shadow-card hover:bg-[#178f44] transition-colors duration-150"
        style={{ height: '52px', width: '52px' }}
      >
        <WhatsAppIcon className="h-6 w-6" />
      </a>
      <a
        href={`tel:${site.phone}`}
        aria-label={`${t('actions.call')} ${site.phone}`}
        title={`${t('actions.call')} ${site.phone}`}
        className="flex items-center justify-center rounded-full bg-accent text-white shadow-card hover:bg-accent-2 transition-colors duration-150"
        style={{ height: '52px', width: '52px' }}
      >
        <PhoneIcon className="h-5 w-5" />
      </a>
    </div>
  );
}
