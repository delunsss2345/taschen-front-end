import useTranslator from "@/hooks/use-translator";

const nav = [
  { key: "books", to: "/books" },
  { key: "limitedEditions", to: "/limited-editions" },
  { key: "gifts", to: "/gifts" },
  { key: "stores", to: "/stores" },
  { key: "about", to: "/about" },
];
const Nav = () => {
  const { t } = useTranslator();

  return (
    <nav className="flex gap-6">
      {nav.map((item) => (
        <a
          key={item.to}
          href={item.to}
          className="text-xs tracking-widest uppercase hover:opacity-70"
        >
          {t(`nav.${item.key}`)}
        </a>
      ))}
    </nav>
  );
};

export default Nav;
