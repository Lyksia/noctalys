import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import rehypeHighlight from "rehype-highlight";
import Image from "next/image";
import type { Components } from "react-markdown";

const components: Components = {
  // Headings with custom styling
  h1: ({ children, ...props }) => (
    <h1 className="text-heading-1 text-moon-50 mt-8 mb-6 font-serif font-semibold" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2 className="text-heading-2 text-moon-100 mt-6 mb-4 font-serif font-semibold" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="text-heading-3 text-moon-200 mt-5 mb-3 font-serif font-semibold" {...props}>
      {children}
    </h3>
  ),

  // Paragraphs
  p: ({ children, ...props }) => (
    <p className="text-body text-moon-300 mb-4 leading-relaxed" {...props}>
      {children}
    </p>
  ),

  // Links - open external links in new tab
  a: ({ href, children, ...props }) => {
    const isExternal = href?.startsWith("http");
    return (
      <a
        href={href}
        className="text-accent-primary hover:text-accent-primary-hover decoration-accent-primary/40 underline transition-colors"
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        {...props}
      >
        {children}
      </a>
    );
  },

  // Lists
  ul: ({ children, ...props }) => (
    <ul className="text-moon-300 mb-4 flex list-inside list-disc flex-col gap-2" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="text-moon-300 mb-4 flex list-inside list-decimal flex-col gap-2" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="text-body" {...props}>
      {children}
    </li>
  ),

  // Blockquotes
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="border-accent-primary/40 bg-moon-900/50 text-moon-300 mb-4 border-l-4 py-3 pr-4 pl-6 italic"
      {...props}
    >
      {children}
    </blockquote>
  ),

  // Code blocks
  code: ({ inline, className, children, ...props }: any) => {
    if (inline) {
      return (
        <code
          className="bg-moon-900 text-accent-glow rounded px-1.5 py-0.5 font-mono text-sm"
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <code className={`${className} font-mono text-sm`} {...props}>
        {children}
      </code>
    );
  },
  pre: ({ children, ...props }) => (
    <pre
      className="bg-moon-900 border-moon-700 mb-4 overflow-x-auto rounded-lg border p-4"
      {...props}
    >
      {children}
    </pre>
  ),

  // Tables
  table: ({ children, ...props }) => (
    <div className="mb-4 overflow-x-auto">
      <table className="border-moon-700 w-full border-collapse border" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }) => (
    <thead className="bg-moon-900" {...props}>
      {children}
    </thead>
  ),
  tbody: ({ children, ...props }) => <tbody {...props}>{children}</tbody>,
  tr: ({ children, ...props }) => (
    <tr className="border-moon-700 border-b" {...props}>
      {children}
    </tr>
  ),
  th: ({ children, ...props }) => (
    <th className="text-moon-100 px-4 py-2 text-left font-semibold" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td className="text-moon-300 px-4 py-2" {...props}>
      {children}
    </td>
  ),

  // Horizontal rule
  hr: (props) => <hr className="border-moon-700 my-8" {...props} />,

  // Images
  img: ({ src, alt }) => {
    if (!src || typeof src !== "string") return null;
    return (
      <span className="border-moon-700 relative my-4 block overflow-hidden rounded-lg border">
        <Image
          src={src}
          alt={alt || ""}
          width={800}
          height={600}
          className="h-auto w-full"
          sizes="(max-width: 768px) 100vw, 800px"
        />
      </span>
    );
  },
};

interface MarkdownProps {
  children: string;
  className?: string;
}

export function Markdown({ children, className = "" }: MarkdownProps) {
  return (
    <div className={`prose prose-noctalys ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize, rehypeHighlight]}
        components={components}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
