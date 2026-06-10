import type { ReactNode } from "react";

type CardProps = { children: ReactNode; className?: string };

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`bg-surface border border-border rounded-xl shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function Header({ children, className = "" }: CardProps) {
  return (
    <div className={`border-b border-border px-5 py-4 font-semibold ${className}`}>
      {children}
    </div>
  );
}

function Body({ children, className = "" }: CardProps) {
  return <div className={`px-5 py-4 ${className}`}>{children}</div>;
}

function Footer({ children, className = "" }: CardProps) {
  return (
    <div className={`border-t border-border px-5 py-4 flex items-center gap-3 ${className}`}>
      {children}
    </div>
  );
}

Card.Header = Header;
Card.Body = Body;
Card.Footer = Footer;
