import { useState } from "react";
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import Hero from "../components/Hero";
import Recomend from "../components/Recomend";

// coursel
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Pagination, Autoplay } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { motion } from "framer-motion";
import Layout from "../components/Layout";

export default function Home({ data, dataRecomend }) {
  const [initialData, setInitialData] = useState(data);
  const [currentIndex, setCurrentIndex] = useState(2);

  async function handleNext() {
    const res = await fetch(
      `https://kusonime-scrapper.glitch.me/api/page/${currentIndex}`
    );
    const result = await res.json();
    setInitialData([...initialData, ...result]);
    setCurrentIndex(currentIndex + 1);
  }

  function limit(string = "", limit = 30) {
    return string.substring(0, limit) + "...";
  }

  return (
    <Layout>
      <Head>
      <meta
          name="description"
          content="bugnime adalah situs download anime batch sub indo terlengkap dan terupdate dengan kualitas terbaik."
        />
        <link rel="icon" href="/favicon.ico" />
        <meta name="author" content="Sujaruu" />
        <meta
          name="keywords"
          content="Bugnime | Download Anime Batch Sub Indo"
        />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="Indonesia" />
        <meta name="revisit-after" content="7 days" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content="Bugnime" />
      </Head>
      
      <div className="w-full text-center text-slate-300 ">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <main className="max-w-[800px] mx-auto pt-28">
            <Hero />

            {/* recomend anime */}
            <section>
              <h1 className="text-2xl text-left font-semibold mb-5">
                Trending Now
              </h1>
              <Swiper
                slidesPerView={1}
                spaceBetween={30}
                loop={true}
                pagination={{
                  clickable: true,
                }}
                autoplay={{
                  delay: 2500,
                  disableOnInteraction: false,
                }}
                modules={[Autoplay, Pagination]}
                className="mySwiper"
              >
                {dataRecomend.map((r, index) => {
                  return (
                    <>
                      <SwiperSlide>
                        <Recomend
                          key={index}
                          title={r.title}
                          thumbnail={r.link.thumbnail}
                          endpoint={r.link.endpoint}
                        />
                      </SwiperSlide>
                    </>
                  );
                })}
              </Swiper>
            </section>

            {/* batch anime */}
            <section className="grid grid-cols-3 gap-5 pt-20 ">
              {initialData.map((a, index) => {
                return (
                  <Link href={`/detailAnime/${a.link.endpoint}`} key={index}>
                    <a>
                      <div className="h-56 flex flex-col bg-[#282828] pb-5 rounded-lg">
                        <Image
                          src={a.link.thumbnail}
                          alt={a.title}
                          width={300}
                          height={150}
                          className="rounded-t-lg object-cover"
                        />
                        <div className="mt-2">
                          <h1 className="text-md text-slate-300 font-semibold px-2">
                            {limit(a.title)}
                          </h1>
                          <p className="text-[#34b27b] text-xs">{a.release}</p>
                        </div>
                      </div>
                    </a>
                  </Link>
                );
              })}
            </section>
            <button
              onClick={handleNext}
              className="mt-10 px-6 py-1 text-slate-300 bg-[#34b27b] hover:bg-[#3b8666] rounded-md"
            >
              Load more
            </button>
          </main>
        </motion.div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  const res = await fetch(`https://kusonime-scrapper.glitch.me/api/page/1`);
  const resRecomend = await fetch(
    "https://kusonime-scrapper.glitch.me/api/rekomendasi"
  );

  const data = await res.json();
  const dataRecomend = await resRecomend.json();

  return {
    props: {
      data,
      dataRecomend,
    },
  };
}
