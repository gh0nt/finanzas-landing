import { newsList, newsMain } from "@/data/mockContent";

export function NewsSection() {
  return (
    <section className="section section--white" id="analisis">
      <div className="container stack">
        <div className="news-header">
          <div>
            <h2 className="section-title">Analisis Financiero</h2>
            <p className="section-subtitle">
              Noticias relevantes para su bolsillo.
            </p>
          </div>
          <a className="news-link" href="#">
            Ver todas las noticias
          </a>
        </div>
        <div className="news-grid">
          <article className="news-card">
            <div className="news-image">
              <img src={newsMain.image} alt={newsMain.alt} />
              <span className="badge badge--hero news-tag">{newsMain.tag}</span>
            </div>
            <h3>{newsMain.title}</h3>
            <p className="section-subtitle">{newsMain.summary}</p>
            <span className="news-meta">{newsMain.meta}</span>
          </article>
          <div className="news-list">
            {newsList.map((item) => (
              <article className="news-item" key={item.title}>
                <div className="news-thumb">
                  <img src={item.image} alt={item.alt} />
                </div>
                <div>
                  <span className="news-category">{item.category}</span>
                  <h4>{item.title}</h4>
                  <span className="news-meta">{item.time}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
