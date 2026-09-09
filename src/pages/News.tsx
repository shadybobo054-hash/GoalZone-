import { useEffect, useState } from "react";
import "./News.css";

type NewsItem = {
  id: string;
  headline: string;
  description: string;
  image: string;
  category: string;
  published: string;
  url: string;
};

const DEMO_NEWS: NewsItem[] = [
  {
    id: "1",
    headline: "Arsenal prepare for another big Premier League challenge",
    description:
      "The Gunners continue their preparations as the new league campaign heats up.",
    image:
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=85",
    category: "PREMIER LEAGUE",
    published: new Date(Date.now() - 15 * 60000).toISOString(),
    url: "#",
  },
  {
    id: "2",
    headline: "Barcelona look ahead to a new chapter",
    description:
      "Barcelona are preparing for another exciting season with big ambitions.",
    image:
      "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=1000&q=85",
    category: "LA LIGA",
    published: new Date(Date.now() - 45 * 60000).toISOString(),
    url: "#",
  },
  {
    id: "3",
    headline: "Champions League race begins to take shape",
    description:
      "Europe's biggest clubs are ready for another dramatic Champions League campaign.",
    image:
      "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1000&q=85",
    category: "CHAMPIONS LEAGUE",
    published: new Date(Date.now() - 2 * 3600000).toISOString(),
    url: "#",
  },
  {
    id: "4",
    headline: "Major transfer stories dominate football headlines",
    description:
      "Clubs across Europe continue to work on their squads ahead of the new season.",
    image:
      "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?auto=format&fit=crop&w=1000&q=85",
    category: "TRANSFERS",
    published: new Date(Date.now() - 4 * 3600000).toISOString(),
    url: "#",
  },
  {
    id: "5",
    headline: "Premier League clubs ready for another exciting weekend",
    description:
      "Fans are getting ready for another round of intense domestic football.",
    image:
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1000&q=85",
    category: "PREMIER LEAGUE",
    published: new Date(Date.now() - 6 * 3600000).toISOString(),
    url: "#",
  },
  {
    id: "6",
    headline: "European football returns with huge expectations",
    description:
      "The biggest teams are preparing for another season of unforgettable football.",
    image:
      "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=1000&q=85",
    category: "FOOTBALL",
    published: new Date(Date.now() - 10 * 3600000).toISOString(),
    url: "#",
  },
];

export default function News() {
  const [news, setNews] = useState<NewsItem[]>(DEMO_NEWS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://site.api.espn.com/apis/site/v2/sports/soccer/news")
      .then((res) => {
        if (!res.ok) throw new Error("API Error");
        return res.json();
      })
      .then((data) => {
        const articles = data.articles || [];

        if (!articles.length) return;

        const formatted = articles
          .slice(0, 30)
          .map((item: any, index: number) => ({
            id: String(item.id || index),
            headline:
              item.headline ||
              item.title ||
              "Football News",
            description:
              item.description ||
              item.summary ||
              "",
            image:
              item.images?.[0]?.url ||
              item.image?.url ||
              "",
            category: getCategory(
              `${item.headline || ""} ${
                item.description || ""
              }`
            ),
            published:
              item.published ||
              item.date ||
              "",
            url:
              item.links?.web?.href ||
              item.link ||
              "",
          }));

        setNews(formatted);
      })
      .catch(() => {
        // لو API فشل نستخدم أخبار الديمو
        setNews(DEMO_NEWS);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  function getCategory(text: string) {
    const value = text.toLowerCase();

    if (
      value.includes("transfer") ||
      value.includes("signing")
    )
      return "TRANSFERS";

    if (
      value.includes("champions league") ||
      value.includes("ucl")
    )
      return "CHAMPIONS LEAGUE";

    if (
      value.includes("premier league") ||
      value.includes("arsenal") ||
      value.includes("chelsea") ||
      value.includes("liverpool") ||
      value.includes("manchester")
    )
      return "PREMIER LEAGUE";

    if (
      value.includes("la liga") ||
      value.includes("barcelona") ||
      value.includes("real madrid")
    )
      return "LA LIGA";

    if (
      value.includes("bundesliga") ||
      value.includes("bayern")
    )
      return "BUNDESLIGA";

    return "FOOTBALL";
  }

  function timeAgo(value: string) {
    if (!value) return "RECENTLY";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "RECENTLY";
    }

    const minutes = Math.floor(
      (Date.now() - date.getTime()) / 60000
    );

    if (minutes < 1) return "JUST NOW";
    if (minutes < 60) return `${minutes} MIN AGO`;

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
      return `${hours} HOURS AGO`;
    }

    return `${Math.floor(hours / 24)} DAYS AGO`;
  }

  function openStory(url: string) {
    if (url && url !== "#") {
      window.open(url, "_blank");
    }
  }

  return (
    <main className="news-page">
      <section className="news-hero">
        <div className="news-hero-content">
          <span>GOALZONE • FOOTBALL MEDIA</span>

          <h1>
            FOOTBALL <b>NEWS</b>
          </h1>

          <p>
            The latest football stories, breaking news
            and updates from around the world.
          </p>
        </div>
      </section>

      <section className="news-section">
        <div className="news-heading">
          <div>
            <span>
              {loading ? "LOADING API" : "FOOTBALL MEDIA"}
            </span>

            <h2>
              Latest <b>News</b>
            </h2>
          </div>

          <strong>
            {news.length} STORIES
          </strong>
        </div>

        {news.length > 0 && (
          <>
            <article
              className="featured-news"
              onClick={() =>
                openStory(news[0].url)
              }
            >
              <img
                src={news[0].image}
                alt={news[0].headline}
              />

              <div className="featured-overlay">
                <small>
                  {news[0].category}
                </small>

                <h2>
                  {news[0].headline}
                </h2>

                <p>
                  ESPN •{" "}
                  {timeAgo(news[0].published)}
                </p>
              </div>
            </article>

            <div className="news-grid">
              {news.slice(1).map((item) => (
                <article
                  className="news-card"
                  key={item.id}
                  onClick={() =>
                    openStory(item.url)
                  }
                >
                  <div className="news-image">
                    <img
                      src={item.image}
                      alt={item.headline}
                    />

                    <span>
                      {item.category}
                    </span>
                  </div>

                  <div className="news-card-content">
                    <small>
                      ESPN •{" "}
                      {timeAgo(item.published)}
                    </small>

                    <h3>
                      {item.headline}
                    </h3>

                    <p>
                      {item.description}
                    </p>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openStory(item.url);
                      }}
                    >
                      READ STORY →
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}