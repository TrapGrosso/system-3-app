import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

export default function MarkdownScrollBox({ content, className = '' }) {
  return (
    <div
      className={`max-h-60 overflow-y-auto whitespace-pre-wrap break-words pr-2 ${className}`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        linkTarget="_blank"
        className="prose prose-sm dark:prose-invert"
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
