import Grid from "@/components/layouts/Grid";
import useTranslator from "@/hooks/use-translator";
import Hero from "@/layouts/DefaultLayout/Hero";
import QuoteRandom from "@/layouts/DefaultLayout/QuoteRandom";

type Item = {
  id: string;
  badge?: string;
  title: string;
  subtitle?: string;
  price: string;
  image: string;
};

type ItemData = {
  id: string;
  badgeKey?: string;
  titleKey: string;
  subtitleKey?: string;
  priceKey: string;
  image: string;
};

const itemsData: ItemData[] = [
  {
    id: "1",
    badgeKey: "common.badge.new",
    titleKey: "home.items.1.title",
    subtitleKey: "home.items.1.subtitle",
    priceKey: "home.items.1.price",
    image:
      "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "2",
    badgeKey: "common.badge.new",
    titleKey: "home.items.2.title",
    priceKey: "home.items.2.price",
    image:
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "3",
    badgeKey: "common.badge.new",
    titleKey: "home.items.3.title",
    priceKey: "home.items.3.price",
    image:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "4",
    badgeKey: "common.badge.new",
    titleKey: "home.items.4.title",
    priceKey: "home.items.4.price",
    image:
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "5",
    badgeKey: "common.badge.new",
    titleKey: "home.items.5.title",
    priceKey: "home.items.5.price",
    image:
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "6",
    badgeKey: "common.badge.new",
    titleKey: "home.items.6.title",
    priceKey: "home.items.6.price",
    image:
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=900&q=80",
  },
];
const Home = () => {
  const { t } = useTranslator();
  const items: Item[] = itemsData.map((item) => ({
    id: item.id,
    badge: item.badgeKey ? t(item.badgeKey) : undefined,
    title: t(item.titleKey),
    subtitle: item.subtitleKey ? t(item.subtitleKey) : undefined,
    price: t(item.priceKey),
    image: item.image,
  }));

  return (
    <>
      <Hero />
      <Grid items={items} />;
      <QuoteRandom />
    </>
  );
};
export default Home;
