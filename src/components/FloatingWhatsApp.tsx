import React from 'react';

interface FloatingWhatsAppProps {
  phoneNumber?: string;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({
  phoneNumber = '+8801674451806',
}) => {
  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}`;

  return (
    <aside aria-label="WhatsApp Quick Contact">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Top Spark Digital on WhatsApp"
        className="fixed bottom-6 left-6 sm:bottom-8 sm:left-8 z-40 group flex items-center justify-center w-14 h-14 sm:w-15 sm:h-15 rounded-full bg-[#25D366] text-white shadow-lg shadow-emerald-950/50 hover:bg-[#20bd5a] hover:scale-105 active:scale-95 transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-400/50"
      >
        {/* Crisp Official WhatsApp Phone SVG Icon */}
        <svg
          viewBox="0 0 32 32"
          className="w-7 h-7 sm:w-8 sm:h-8 fill-current drop-shadow-sm transition-transform duration-300 group-hover:scale-110"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M16 2C8.268 2 2 8.268 2 16c0 2.668.749 5.23 2.164 7.457L2.086 29.23a1 1 0 0 0 1.229 1.229l5.773-2.078A13.916 13.916 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.6c-2.332 0-4.577-.662-6.52-1.916a1 1 0 0 0-.672-.125l-4.227 1.522 1.522-4.227a1 1 0 0 0-.125-.672A11.554 11.554 0 0 1 4.4 16C4.4 9.604 9.604 4.4 16 4.4S27.6 9.604 27.6 16 22.396 27.6 16 27.6zm6.398-8.797c-.352-.176-2.082-1.027-2.404-1.145-.322-.117-.557-.176-.791.176-.234.352-.908 1.145-1.113 1.379-.205.234-.41.264-.762.088-.352-.176-1.484-.547-2.828-1.746-1.047-.934-1.754-2.086-1.959-2.438-.205-.352-.022-.541.154-.717.158-.158.352-.41.527-.615.176-.205.234-.352.352-.586.117-.234.059-.44-.029-.615-.088-.176-.791-1.906-1.084-2.61-.285-.684-.574-.59-.791-.602l-.674-.012c-.234 0-.615.088-.938.44-.322.352-1.23 1.201-1.23 2.93 0 1.729 1.258 3.398 1.434 3.633.176.234 2.479 3.785 6.004 5.307.838.363 1.492.58 2.002.742.842.268 1.609.23 2.215.14.676-.102 2.082-.852 2.375-1.672.293-.82.293-1.523.205-1.672-.088-.148-.322-.234-.674-.41z" />
        </svg>

        {/* Tooltip on Desktop hover (positioned to the right of the button) */}
        <span className="hidden sm:inline-block pointer-events-none absolute left-full ml-3.5 px-3 py-1.5 rounded-lg bg-[#0E1017] text-white text-xs font-semibold whitespace-nowrap border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-xl">
          Chat with us on WhatsApp
        </span>
      </a>
    </aside>
  );
};
