import Grid from "@/components/layouts/Grid";

type Item = {
  id: string;
  badge?: string;
  title: string;
  subtitle?: string;
  price: string;
  image: string;
};

const items: Item[] = [
  {
    id: "1",
    badge: "NEW",
    title: "Hokusai.",
    subtitle: "Thirty-six Views of Mount Fuji",
    price: "US$ 80",
    image:
      "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "2",
    badge: "NEW",
    title: "Japanese Woodblock Prints",
    price: "US$ 150",
    image:
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "3",
    badge: "NEW",
    title: "Costume Jewelry",
    price: "US$ 125",
    image:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "4",
    badge: "NEW",
    title: "Sophia by Eisenstaedt",
    price: "US$ 1,000",
    image:
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "5",
    badge: "NEW",
    title: "Sophia by Eisenstaedt",
    price: "US$ 1,000",
    image:
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "6",
    badge: "NEW",
    title: "Sophia by Eisenstaedt",
    price: "US$ 1,000",
    image:
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=900&q=80",
  },
];
const Home = () => {
  return <Grid items={items} />;
};
export default Home;
