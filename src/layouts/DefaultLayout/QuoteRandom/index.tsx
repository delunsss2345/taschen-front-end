const QuoteRandom = () => {
  return (
    <section className="w-full bg-[#7f7690]">
      <div className="mx-auto grid max-w-[var(--container-main)] grid-cols-12 gap-8 px-10 py-20">
        <div className="col-span-12 flex flex-col justify-center md:col-span-7">
          <span className="mb-6 text-sm font-medium text-white">
            Costume Jewelry
          </span>

          <p className="max-w-[720px] text-2xl font-light leading-relaxed text-white md:text-3xl">
            “Don’t skimp – go big: the coolest jewels of the 20th century…
            TASCHEN has published a nine pound illustrated volume on the
            subject: <em>Costume Jewelry</em>.”
          </p>

          <cite className="mt-4 block text-lg italic text-white">Stern</cite>
        </div>

        <div className="col-span-12 flex justify-center md:col-span-5">
          <div className="flex flex-col items-center text-white">
            <img
              src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=500&q=80"
              alt="Costume Jewelry"
              className="mb-6 w-[560px] shadow-2xl"
            />

            <div className="text-sm font-semibold">NEW</div>
            <div className="mt-1 text-base font-medium">Costume Jewelry</div>
            <div className="mt-6 text-base font-semibold">US$ 125</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuoteRandom;
