import { motion, useTransform, useScroll } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";

const Carousel = () => {
  return (
    <div>
      <div className="flex my-10 items-center justify-center">
        <span className="font-semibold uppercase text-neutral-500">
          Explore Category Foods
        </span>
      </div>
      <HorizontalScrollCarousel />
      <div className="flex flex-col h-48 items-center justify-center gap-3">
        <h4 className="font-mono text-orange-600 text-2xl"> founder:<span className="text-red-600"> Shangesh S</span></h4>
        <span className="font-semibold uppercase text-neutral-500">
         © 2024 Mern_Food. All rights reserved.

        </span>
      </div>
    </div>
  );
};

const HorizontalScrollCarousel = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["1%", "-95%"]);

  return (
    <section ref={targetRef} className="relative h-[300vh] bg-orange-600 rounded-xl">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div style={{ x }} className="flex gap-5">
          {cards.map((card) => {
            return <Card card={card} key={card.id} />;
          })}
        </motion.div>
      </div>
    </section>
  );
};

const Card = ({ card }) => {
  return (
    <div
      key={card.id}
      className="group relative h-[450px] w-[450px] overflow-hidden bg-neutral-200 rounded-xl text-center font-mono"
    >
      <div
        style={{
          backgroundImage: `url(${card.url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          
        }}
        className="absolute inset-0 z-0 transition-transform duration-300 group-hover:scale-110"
      ></div>
      <div className="absolute inset-0 z-10 grid place-content-center mx-8">
        <Link to={card.to} className="bg-gradient-to-br from-white/20 to-white/0 p-8 text-6xl font-black uppercase text-white backdrop-blur-lg">
          {card.title}
        </Link>
      </div>
    </div>
  );
};

export default Carousel;

const cards = [
  {
    url: "https://img.freepik.com/free-photo/delicious-ice-cream-with-topping_23-2150735486.jpg?t=st=1725641818~exp=1725645418~hmac=26a70a4f9cc3b790dfa9002e53d77b16a002a275b1c8b8168dd3f306e5c396fe&w=826",
    title: "Ice Creame",
    id: 1,
    to:"/menu"
  },
  {
    url: "https://img.freepik.com/free-photo/top-view-fast-food-mix-mozzarella-sticks-club-sandwich-hamburger-mushroom-pizza-caesar-shrimp-salad-french-fries-ketchup-mayo-cheese-sauces-table_141793-3998.jpg?t=st=1725641859~exp=1725645459~hmac=47392b8ab7b968dabd5090aa94ccaa215bcbc9e34721bcdfa891bea7f4236f1c&w=1060",
    title: "Fast-Foods",
    id: 2,
    to:"/menu"
  },
  {
    url: "https://img.freepik.com/free-photo/selection-different-drinks-purple-background_1340-34872.jpg?uid=R148270219&ga=GA1.1.1905620689.1725260401&semt=ais_hybrid",
    title: "Fresh Juices",
    id: 3,
    to:"/menu"
  },
  {
    url: "https://img.freepik.com/free-photo/delicious-indian-food-tray_23-2148723505.jpg?t=st=1725641990~exp=1725645590~hmac=73c8b96723bb50dba049569eeb4186c997eacd49f44b840eb190c1b89128d593&w=996",
    title: "Indian Foods",
    id: 4,
    to:"/menu"
  },
  {
    url: "https://img.freepik.com/free-photo/set-italian-food_23-2147772120.jpg?t=st=1725642073~exp=1725645673~hmac=1953f22b52395c6283c45fa9470a2a9f85c19881939d04a3b80e2ac72122dff3&w=1060",
    title: "Italian Cuisine",
    id: 5,
    to:"/menu"
  },
  {
    url: "https://img.freepik.com/free-photo/delicious-vietnamese-food-including-pho-ga-noodles-spring-rolls-white-table_181624-34062.jpg?t=st=1725642124~exp=1725645724~hmac=74e2fbd37913d3d41a10e450be89eb5ba1d446e8f0a2415e89d5658e801c7797&w=1060",
    title: "Chinese Cuisine",
    id: 6,
    to:"/menu"
  },
  {
    url: "https://img.freepik.com/free-photo/birthday-cake_23-2150734952.jpg?uid=R148270219&ga=GA1.1.1905620689.1725260401&semt=ais_hybrid",
    title: "Ice Cake",
    id: 7,
    to:"/menu"
  },
  {
    url: "https://img.freepik.com/free-vector/choosing-healthy-unhealthy-food-illustration_23-2148559305.jpg?t=st=1725642345~exp=1725645945~hmac=28b8f94755ec87dcb4a6ee2b024adbb05e00ec9d6a65f0fe67bebbdcfa192de4&w=1060",
    title: "See Menu",
    id: 8,
    to:"/menu"
  },
];
