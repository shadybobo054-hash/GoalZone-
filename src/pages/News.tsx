import { useEffect, useState } from "react";
import "./News.css";

type NewsArticle = {
  id: string;
  headline: string;
  description?: string;
  published?: string;
  image?: string;
  link?: string;
};

const NEWS_URL =
  "https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/news";

let newsCache: NewsArticle[] | null = null;
let newsRequest: Promise<NewsArticle[]> | null = null;

async function fetchNewsOnce(): Promise<NewsArticle[]> {
  if (newsCache !== null) {
    return newsCache;
  }

  if (newsRequest) {
    return newsRequest;
  }

  newsRequest = fetch(NEWS_URL)
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}`
        );
      }

      const data = await response.json();

      const articles: NewsArticle[] =
        (data.articles || []).map(
          (article: any, index: number) => ({
            id:
              article.id ||
              `news-${index}`,

            headline:
              article.headline ||
              "Football News",

            description:
              article.description ||
              "",

            published:
              article.published,

            image:
              article.images?.[0]?.url ||
              article.images?.[1]?.url ||
              "",

            link:
              article.links?.web?.href ||
              "",
          })
        );

      const uniqueNews = [
        ...new Map(
          articles.map((article) => [
            article.id,
            article,
          ])
        ).values(),
      ];

      newsCache = uniqueNews.slice(0, 30);

      return newsCache;
    })
    .finally(() => {
      newsRequest = null;
    });

  return newsRequest;
}

function News() {
  const [news, setNews] =
    useState<NewsArticle[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    let mounted = true;

    const loadNews = async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await fetchNewsOnce();

        if (mounted) {
          setNews(data);
        }
      } catch (err) {
        console.error(
          "News Error:",
          err
        );

        if (mounted) {
          setError(
            "تعذر تحميل الأخبار"
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadNews();

    return () => {
      mounted = false;
    };
  }, []);

  const formatDate = (
    date?: string
  ) => {
    if (!date) return "";

    return new Date(
      date
    ).toLocaleDateString(
      "ar-EG",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  };

  const retry = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await fetchNewsOnce();

      setNews(data);
    } catch (err) {
      console.error(
        "News Error:",
        err
      );

      setError(
        "تعذر تحميل الأخبار"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="news-page">

      <section className="news-hero">
        <div className="news-hero-bg" />

        <div className="news-hero-content">
          <span className="news-label">
            GOALZONE NEWS CENTER
          </span>

          <h1>
            FOOTBALL
            <strong>NEWS</strong>
          </h1>

          <p>
            أحدث أخبار كرة القدم من أكبر البطولات العالمية.
          </p>

          <div className="news-hero-stats">
            <div>
              <b>24/7</b>
              <span>UPDATES</span>
            </div>

            <div>
              <b>WORLD</b>
              <span>FOOTBALL</span>
            </div>

            <div>
              <b>LIVE</b>
              <span>NEWS</span>
            </div>
          </div>
        </div>

        <div className="transfers-ball">
          ⚽
        </div>
      </section>

      <section className="news-content">

        <div className="news-heading">
          <div>
            <span>
              LATEST STORIES
            </span>

            <h2>
              آخر الأخبار
            </h2>
          </div>

          <strong>
            {news.length} خبر
          </strong>
        </div>

        {loading && (
          <div className="news-state">
            <div className="news-loader" />

            <p>
              جاري تحميل الأخبار...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="news-state">
            <div className="news-error">
              !
            </div>

            <h3>
              {error}
            </h3>

            <button onClick={retry}>
              إعادة المحاولة
            </button>
          </div>
        )}

        {!loading &&
          !error &&
          news.length === 0 && (
            <div className="news-state">
              <div className="news-empty">
                📰
              </div>

              <h3>
                لا توجد أخبار
              </h3>

              <p>
                لم يتم العثور على أخبار حالياً.
              </p>
            </div>
          )}

        {!loading &&
          !error &&
          news.length > 0 && (
            <div className="news-grid">

              {news.map(
                (article) => (
                  <article
                    className="news-card"
                    key={article.id}
                  >

                    <div className="news-image">

                      {article.image ? (
                        <img
                          src={
                            article.image
                          }
                          alt={
                            article.headline
                          }
                          loading="lazy"
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

                    <div className="news-card-body">

                      <small>
                        {formatDate(
                          article.published
                        )}
                      </small>

                      <h3>
                        {
                          article.headline
                        }
                      </h3>

                      {article.description && (
                        <p>
                          {
                            article.description
                          }
                        </p>
                      )}

                      {article.link && (
                        <a
                          href={
                            article.link
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          اقرأ الخبر

                          <span>
                            →
                          </span>
                        </a>
                      )}

                    </div>

                  </article>
                )
              )}

            </div>
          )}

      </section>

    </main>
  );
}

export default News;