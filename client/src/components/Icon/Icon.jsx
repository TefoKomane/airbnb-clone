// a single small component that renders one of a fixed set of inline SVG icons
// keeping icons as one component avoids importing dozens of separate files
const paths = {
  logo: (
    <path d="M16 6c-4 6-8 10.5-8 14.2C8 24 11.6 27 16 27s8-3 8-6.8C24 16.5 20 12 16 6z" />
  ),
  star: (
    <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.8L5.8 21l1.6-7L2 9.2l7.1-.6L12 2z" />
  ),
  heart: (
    <path d="M12 21s-7.5-4.6-10-9C.5 8.2 2.3 4 6.3 4c2.1 0 3.7 1.2 4.7 2.9C12 5.2 13.6 4 15.7 4c4 0 5.8 4.2 4.3 8-2.5 4.4-10 9-10 9z" />
  ),
  wifi: (
    <path d="M2 8.5a15 15 0 0120 0M5 12a10 10 0 0114 0M8.5 15.5a5 5 0 017 0M12 19.5h.01" />
  ),
  kitchen: (
    <path d="M4 3h16v6H4zM4 13h7v8H4zM13 13h7v8h-7zM8 16v2M17 16v2" />
  ),
  parking: (
    <path d="M4 4h12a5 5 0 010 10H10v6H4zM10 6.5h6a2.5 2.5 0 010 5h-6z" />
  ),
  search: <path d="M11 4a7 7 0 100 14 7 7 0 000-14zM21 21l-4.3-4.3" />,
  guest: (
    <path d="M12 12a4 4 0 100-8 4 4 0 000 8zM4 21a8 8 0 0116 0" />
  ),
  chevronDown: <path d="M6 9l6 6 6-6" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  menu: <path d="M3 6h18M3 12h18M3 18h18" />,
