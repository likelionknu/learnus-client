import type { Components } from "react-markdown";

export const markdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="text-ec-black mt-10 mb-4 text-3xl font-semibold">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-ec-black border-ec-outline text-markdown-h2 mt-8 mb-3 border-b pb-2 font-semibold md:text-2xl">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-ec-black border-ec-outline mt-6 mb-2 border-b pb-2 text-xl font-semibold">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="text-ec-black mb-4 leading-7">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="text-ec-black mb-4 list-disc pl-6">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="text-ec-black mb-4 list-decimal pl-6">{children}</ol>
  ),
  li: ({ children }) => <li className="text-ec-black leading-7">{children}</li>,
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-ec-blue underline hover:opacity-80"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  img: ({ src, alt }) => (
    <img
      src={src || ""}
      alt={alt || ""}
      className="rounded-ec-10 border-ec-outline my-6 border"
    />
  ),
  code: ({ children, className, ...props }) => {
    // let codeText = String(children);
    // codeText = codeText.replace(/`/g, "");

    const isBlockCode = Boolean(className?.includes("language-"));
    // || (typeof children === "string" && children.includes("\n"));
    // codeText.includes("\n");

    return isBlockCode ? (
      <code
        className={`text-sm before:content-none after:content-none ${className || ""}`}
        {...props}
      >
        {children}
      </code>
    ) : (
      <code
        className={`bg-ec-red text-ec-white rounded px-1.5 py-0.5 font-mono text-[0.875em] before:content-none after:content-none ${className || ""}`}
        {...props}
      >
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="dark:bg-ec-black bg-ec-outline dark:text-ec-white text-ec-black mb-4 overflow-x-auto rounded-lg p-4">
      {children}
    </pre>
  ),
  strong: ({ children }) => (
    <strong className="text-ec-black font-bold">{children}</strong>
  ),
  em: ({ children }) => <em className="text-ec-black italic">{children}</em>,
  del: ({ children }) => (
    <del className="text-ec-gray line-through">{children}</del>
  ),
  blockquote: ({ children }) => (
    <blockquote className="bg-ec-blue text-ec-white rounded-ec-10 [&>p]:text-ec-white border-none px-4 py-2 not-italic [&>p]:m-0 [&>p]:before:content-none [&>p]:after:content-none">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="border-ec-outline my-6" />,
  table: ({ children }) => (
    <table className="border-ec-gnb-white my-6 w-full border-collapse">
      {children}
    </table>
  ),
  thead: ({ children }) => (
    <thead className="bg-ec-gray-light">{children}</thead>
  ),
  tbody: ({ children }) => <tbody>{children}</tbody>,
  tr: ({ children }) => (
    <tr className="border-ec-outline border-b">{children}</tr>
  ),
  th: ({ children }) => (
    <th className="text-ec-black px-4 py-2 text-left font-semibold">
      {children}
    </th>
  ),
  td: ({ children }) => <td className="text-ec-black px-4 py-2">{children}</td>,
};
