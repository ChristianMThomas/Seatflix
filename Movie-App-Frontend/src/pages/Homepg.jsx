import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Billboard from "../components/Billboard";
import Row from "../components/Row";
import { tmdb, withType } from "../tmdb";

const rows = [
  { key: "popularMovies", title: "Popular Right Now", eyebrow: "Movies", path: "/movie/popular", type: "movie" },
  { key: "popularTv", title: "Binge-Worthy Series", eyebrow: "TV Shows", path: "/tv/popular", type: "tv" },
  { key: "nowPlaying", title: "Fresh in Theaters", eyebrow: "New releases", path: "/movie/now_playing", type: "movie" },
  { key: "topRated", title: "Critically Acclaimed", eyebrow: "All-time greats", path: "/movie/top_rated", type: "movie" },
  { key: "action", title: "Adrenaline Rush", eyebrow: "Action", path: "/discover/movie", params: { with_genres: 28, sort_by: "popularity.desc" }, type: "movie" },
  { key: "comedy", title: "Feel-Good Laughs", eyebrow: "Comedy", path: "/discover/movie", params: { with_genres: 35, sort_by: "popularity.desc" }, type: "movie" },
  { key: "topTv", title: "Prestige Television", eyebrow: "Top-rated series", path: "/tv/top_rated", type: "tv" },
  { key: "horror", title: "After Dark", eyebrow: "Horror", path: "/discover/movie", params: { with_genres: 27, sort_by: "popularity.desc" }, type: "movie" },
];

const Homepg = () => {
  const [trending, setTrending] = useState([]);
  const [rowData, setRowData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [trendingRes, ...rowRes] = await Promise.allSettled([
        tmdb("/trending/all/week"),
        ...rows.map(({ path, params }) => tmdb(path, params)),
      ]);

      if (trendingRes.status === "fulfilled") {
        setTrending(trendingRes.value.results.filter((item) => item.media_type !== "person"));
      }
      setRowData(
        Object.fromEntries(
          rows.map(({ key, type }, i) => [
            key,
            rowRes[i].status === "fulfilled" ? withType(rowRes[i].value.results, type) : [],
          ])
        )
      );
      setLoading(false);
    };
    load();
  }, []);

  const featured = trending.filter((item) => item.backdrop_path).slice(0, 6);

  return (
    <main className="relative overflow-hidden">
      <Billboard items={featured} />

      <div className="relative z-10 -mt-24 sm:-mt-28 pb-20 space-y-10 sm:space-y-14">
        <Row title="Top 10 This Week" eyebrow="Trending" items={trending} loading={loading} ranked />
        {rows.slice(0, 4).map(({ key, title, eyebrow }) => (
          <Row key={key} title={title} eyebrow={eyebrow} items={rowData[key]} loading={loading} />
        ))}

        {/* About band */}
        <section className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-14">
          <div className="relative overflow-hidden rounded-3xl border border-white/10">
            <img src="/hero-bg.png" alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/85 to-brand/20" />
            <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-brand/20 blur-3xl" />

            <div className="relative grid lg:grid-cols-[1.3fr_1fr] gap-8 p-8 sm:p-14 items-center">
              <div>
                <p className="eyebrow mb-4">An ITT original experience</p>
                <h2 className="font-display text-4xl sm:text-6xl font-normal leading-[1.05]">
                  Every seat is <em className="text-brand">the best seat</em> in the house.
                </h2>
                <p className="mt-5 text-light-200 text-base sm:text-lg leading-relaxed max-w-xl">
                  At <span className="text-white font-semibold">ITT (Infinite Tech Team)</span>, we're committed to a
                  safe, trustworthy streaming experience. Your privacy is safeguarded and your data is handled
                  responsibly, so all that's left is the show.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:items-end">
                <Link to="/Search" className="btn-primary text-lg px-8 py-4">
                  Explore the catalog
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
                  </svg>
                </Link>
                <p className="text-gray-100 text-sm">Thousands of films and series. One seat. Zero cost.</p>
              </div>
            </div>
          </div>
        </section>

        {rows.slice(4).map(({ key, title, eyebrow }) => (
          <Row key={key} title={title} eyebrow={eyebrow} items={rowData[key]} loading={loading} />
        ))}
      </div>
    </main>
  );
};

export default Homepg;
