import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './legal-prose.css';

type LegalMarkdownProps = {
  content: string;
};

export default function LegalMarkdown({ content }: LegalMarkdownProps) {
  return (
    <div className="legal-prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children, ...props }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
