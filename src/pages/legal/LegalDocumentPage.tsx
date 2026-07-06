import FooterSections from '../../components/FooterSections';
import LanguageMenu from '../../components/LanguageMenu';
import LegalDocumentView from '@legal/LegalDocumentView';

export default function LegalDocumentPage() {
  return <LegalDocumentView Footer={FooterSections} LanguageMenu={LanguageMenu} />;
}
