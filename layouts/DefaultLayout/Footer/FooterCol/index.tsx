import { Link } from "react-router-dom";

const FooterCol = ({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) => {
  return (
    <div className="col-span-12 md:col-span-3">
      <div className="text-sm font-semibold text-zinc-900">{title}</div>
      <ul className="mt-4 space-y-3 text-sm text-zinc-800">
        {links.map((l) => (
          <li key={l.label}>
            <Link to={l.href} className="hover:underline underline-offset-4">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default FooterCol;
