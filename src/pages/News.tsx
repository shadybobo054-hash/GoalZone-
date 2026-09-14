import { useEffect, useState } from "react";
import "./News.css";

type NewsItem = {
  id: number | string;
  title: string;
  description?: string;
  image?: string;
  published_at?: string;
};

const API_URL = "http://127.0.0.1:5174/api/news";

export default function News() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadNews() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Server Error ${response.status}`);
        }

        const data = await response.json();

        if (Array.isArray(data.news)) {
          setNews(data.news);
        } else {
          setNews([]);
        }
      } catch (err) {
        console.error("News error:", err);
        setError("Unable to load news.");
      } finally {
        setLoading(false);
      }
    }

    loadNews();
  }, []);

  function timeAgo(value?: string) {
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

  function openStory(url?: string) {
    if (url) {
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
              {loading
                ? "LOADING NEWS"
                : "FOOTBALL MEDIA"}
            </span>

            <h2>
              Latest <b>News</b>
            </h2>
          </div>

          <strong>
            {news.length} STORIES
          </strong>

        </div>

        {loading && (
          <div className="news-state">
            Loading news...
          </div>
        )}

        {!loading && error && (
          <div className="news-state">
            ⚠ {error}
          </div>
        )}

        {!loading &&
          !error &&
          news.length === 0 && (
            <div className="news-state">
              <h3>No news available</h3>
            </div>
          )}

        {!loading &&
          !error &&
          news.length > 0 && (
            <>
              <article
                className="featured-news"
                onClick={() =>
                  openStory(news[0].image)
                }
              >
                {news[0].image && (
                  <img
                    src={news[0].image}
                    alt={news[0].title}
                  />
                )}

                <div className="featured-overlay">

                  <small>
                    FOOTBALL
                  </small>

                  <h2>
                    {news[0].title}
                  </h2>

                  <p>
                    NEWS •{" "}
                    {timeAgo(
                      news[0].published_at
                    )}
                  </p>

                </div>
              </article>

              <div className="news-grid">

                {news.slice(1).map((item) => (
                  <article
                    className="news-card"
                    key={item.id}
                  >

                    <div className="news-image">

                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                        />
                      ) : (
                        <div className="news-image-placeholder">
                          ⚽
                        </div>
                      )}

                      <span>
                        FOOTBALL
                      </span>

                    </div>

                    <div className="news-card-content">

                      <small>
                        NEWS •{" "}
                        {timeAgo(
                          item.published_at
                        )}
                      </small>

                      <h3>
                        {item.title}
                      </h3>

                      <p>
                        {item.description ||
                          "Latest football news and updates."}
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          openStory(undefined)
                        }
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