import FooterSections from '../../components/FooterSections';
import LanguageMenu from '../../components/LanguageMenu';
import LegalIndexView from '@legal/LegalIndexView';

export default function LegalIndexPage() {
  return <LegalIndexView Footer={FooterSections} LanguageMenu={LanguageMenu} />;
}
