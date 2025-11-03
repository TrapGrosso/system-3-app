import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

export default function MarkdownScrollBox({ content, className = '', dense = false, linkClassName = '' }) {
  const denseClasses = dense ? '[&_p]:leading-[1.1] [&_li]:leading-[1.1] [&_p]:my-0 [&_li]:my-0 [&_ul]:my-0 [&_ol]:my-0 [&_pre]:whitespace-pre [&_h1]:my-0 [&_h2]:my-0 [&_h3]:my-0 [&_h4]:my-0 [&_blockquote]:my-0' : '';
  
  const defaultLinkClasses = 'text-blue-600 hover:underline dark:text-blue-400 underline-offset-2 visited:text-purple-600';
  const linkClasses = linkClassName || defaultLinkClasses;
  
  const components = {
    a: ({ node, ...props }) => (
      <a
        {...props}
        className={linkClasses}
        target="_blank"
        rel="noopener noreferrer"
      />
    )
  };
  
  return (
    <div
      className={`max-h-60 overflow-y-auto whitespace-pre-line break-words pr-2 ${className} ${denseClasses}`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        linkTarget="_blank"
        className="prose prose-sm dark:prose-invert prose-p:my-0 prose-ul:my-0 prose-ol:my-0 prose-h1:my-0 prose-h2:my-0 prose-h3:my-0 prose-h4:my-0 prose-headings:leading-tight"
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
