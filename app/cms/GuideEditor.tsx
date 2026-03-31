/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "@/app/cms/cms.module.css";
import {
  estimateChapters,
  estimateReadingMinutes,
  getGuideCoverTheme,
  slugify,
} from "@/lib/cms/utils";
import { STANDARD_GUIDE_CATEGORIES } from "@/lib/cms/categories";
import type { GuidePost } from "@/lib/cms/types";

type SaveStatus = "idle" | "saving" | "success" | "error";
type EditorMode = "markdown" | "assisted";

type EditorState = {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  level: "Principiante" | "Intermedio" | "Avanzado";
  author_name: string;
  author_role: string;
  seo_title: string;
  seo_description: string;
  canonical_url: string;
  og_image_url: string;
  cover_icon: string;
  cover_gradient: string;
  tags: string;
  featured: boolean;
  status: "draft" | "published";
  content_markdown: string;
  cover_image_url: string;
  cover_image_path: string;
};

const initialContent = `## Introduccion\n\nEscribe aqui la introduccion de la guia.\n\n## Desarrollo\n\nIncluye comparativas, tablas y recomendaciones practicas.\n\n## Conclusiones\n\nCierra con una recomendacion accionable para el lector.`;

const INITIAL_CATEGORY = "Ahorro";
const initialCoverTheme = getGuideCoverTheme(INITIAL_CATEGORY);

const initialState: EditorState = {
  title: "",
  slug: "",
  excerpt: "",
  category: INITIAL_CATEGORY,
  level: "Principiante",
  author_name: "Equipo Editorial",
  author_role: "Analista Financiero",
  seo_title: "",
  seo_description: "",
  canonical_url: "",
  og_image_url: "",
  cover_icon: initialCoverTheme.icon,
  cover_gradient: initialCoverTheme.gradient,
  tags: "",
  featured: false,
  status: "draft",
  content_markdown: initialContent,
  cover_image_url: "",
  cover_image_path: "",
};

type GuideEditorProps = {
  canWrite?: boolean;
};

const CLIENT_POSTS_CACHE_TTL_MS = 20_000;

let clientPostsCache: {
  fetchedAt: number;
  posts: GuidePost[];
} | null = null;

function shouldSyncCoverWithCategory(category: string, icon: string, gradient: string) {
  const defaults = getGuideCoverTheme(category);
  return (
    !icon.trim() ||
    !gradient.trim() ||
    (icon.trim() === defaults.icon && gradient.trim() === defaults.gradient)
  );
}

function FieldBadge({ required }: { required: boolean }) {
  return (
    <span
      className={
        required ? styles.fieldRequiredBadge : styles.fieldOptionalBadge
      }
    >
      {required ? "Obligatorio" : "Opcional"}
    </span>
  );
}

export function GuideEditor({ canWrite = true }: GuideEditorProps) {
  const [state, setState] = useState<EditorState>(initialState);
  const [editorMode, setEditorMode] = useState<EditorMode>("markdown");
  const [showOptionalFields, setShowOptionalFields] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [message, setMessage] = useState("");
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isRemovingCover, setIsRemovingCover] = useState(false);
  const [coverUploadMessage, setCoverUploadMessage] = useState("");
  const [posts, setPosts] = useState<GuidePost[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [listError, setListError] = useState("");
  const contentRef = useRef<HTMLTextAreaElement | null>(null);

  const derivedSlug = useMemo(
    () => slugify(state.slug || state.title),
    [state.slug, state.title],
  );
  const readingMinutes = useMemo(
    () => estimateReadingMinutes(state.content_markdown),
    [state.content_markdown],
  );
  const chapters = useMemo(
    () => estimateChapters(state.content_markdown),
    [state.content_markdown],
  );
  const editingSlug = state.slug || derivedSlug;

  function updateField<K extends keyof EditorState>(
    field: K,
    value: EditorState[K],
  ) {
    setState((prev) => ({ ...prev, [field]: value }));
  }

  function applyToSelection(transform: (selected: string) => string) {
    const textarea = contentRef.current;
    if (!textarea) {
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const full = state.content_markdown;
    const selected = full.slice(start, end);
    const replacement = transform(selected);
    const next = full.slice(0, start) + replacement + full.slice(end);

    updateField("content_markdown", next);

    const cursor = start + replacement.length;
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(cursor, cursor);
    });
  }

  function wrapSelection(prefix: string, suffix = "", placeholder = "texto") {
    applyToSelection((selected) => {
      const value = selected || placeholder;
      return `${prefix}${value}${suffix}`;
    });
  }

  function insertHeading(level: 1 | 2) {
    const prefix = level === 1 ? "# " : "## ";
    applyToSelection((selected) => {
      const clean = selected.trim() || "Titulo";
      return `${prefix}${clean}`;
    });
  }

  function insertLink() {
    const href = window.prompt("URL del enlace", "https://");
    if (!href) {
      return;
    }

    applyToSelection((selected) => {
      const label = selected.trim() || "texto del enlace";
      return `[${label}](${href.trim()})`;
    });
  }

  function resetToNewPost() {
    setState(initialState);
    setCoverUploadMessage("");
    setMessage("Nuevo post listo para crear.");
    setSaveStatus("idle");
  }

  function loadPostForEditing(post: GuidePost) {
    const coverTheme = getGuideCoverTheme(post.category);
    setState({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      category: post.category,
      level: post.level,
      author_name: post.author_name,
      author_role: post.author_role ?? "",
      seo_title: post.seo_title,
      seo_description: post.seo_description,
      canonical_url: post.canonical_url ?? "",
      og_image_url: post.og_image_url ?? "",
      cover_icon: post.cover_icon || coverTheme.icon,
      cover_gradient: post.cover_gradient || coverTheme.gradient,
      tags: post.tags.join(", "),
      featured: post.featured,
      status: post.status,
      content_markdown: post.content_markdown,
      cover_image_url: post.og_image_url ?? "",
      cover_image_path: "",
    });
    setMessage(`Editando: ${post.title}`);
    setCoverUploadMessage("");
    setSaveStatus("idle");
  }

  function handleCategoryChange(value: string) {
    setState((prev) => {
      const nextTheme = getGuideCoverTheme(value);
      const syncCover = shouldSyncCoverWithCategory(
        prev.category,
        prev.cover_icon,
        prev.cover_gradient,
      );

      return {
        ...prev,
        category: value,
        cover_icon: syncCover ? nextTheme.icon : prev.cover_icon,
        cover_gradient: syncCover ? nextTheme.gradient : prev.cover_gradient,
      };
    });
  }

  async function fetchPosts(force = false) {
    if (
      !force &&
      clientPostsCache &&
      Date.now() - clientPostsCache.fetchedAt < CLIENT_POSTS_CACHE_TTL_MS
    ) {
      setPosts(clientPostsCache.posts);
      setIsLoadingPosts(false);
      return;
    }

    setIsLoadingPosts(true);
    setListError("");
    try {
      const response = await fetch("/api/cms/guides", {
        method: "GET",
        cache: "no-store",
      });

      const data = (await response.json()) as {
        error?: string;
        posts?: GuidePost[];
      };

      if (!response.ok || !Array.isArray(data.posts)) {
        setListError(data.error ?? "No se pudo cargar la lista de guias.");
        return;
      }

      setPosts(data.posts);
      clientPostsCache = {
        fetchedAt: Date.now(),
        posts: data.posts,
      };
    } catch {
      setListError("No se pudo cargar la lista de guias.");
    } finally {
      setIsLoadingPosts(false);
    }
  }

  async function handleCoverUpload(file: File) {
    setIsUploadingCover(true);
    setCoverUploadMessage("Subiendo imagen...");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("slug", derivedSlug || "post");

      const response = await fetch("/api/cms/upload-cover", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as {
        ok?: boolean;
        error?: string;
        url?: string;
        path?: string;
      };

      if (!response.ok || !data.ok || !data.url || !data.path) {
        setCoverUploadMessage(data.error ?? "No se pudo subir la imagen.");
        return;
      }

      setState((prev) => ({
        ...prev,
        cover_image_url: data.url ?? prev.cover_image_url,
        cover_image_path: data.path ?? prev.cover_image_path,
        og_image_url: prev.og_image_url || data.url || prev.og_image_url,
      }));
      setCoverUploadMessage("Imagen subida correctamente.");
    } catch {
      setCoverUploadMessage("Error de red subiendo la imagen.");
    } finally {
      setIsUploadingCover(false);
    }
  }

  async function handleCoverRemove() {
    if (!state.cover_image_url && !state.cover_image_path) {
      return;
    }

    setIsRemovingCover(true);
    setCoverUploadMessage("Eliminando imagen...");

    try {
      if (state.cover_image_path) {
        const response = await fetch("/api/cms/upload-cover", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ path: state.cover_image_path }),
        });

        const data = (await response.json()) as {
          ok?: boolean;
          error?: string;
        };

        if (!response.ok || !data.ok) {
          setCoverUploadMessage(data.error ?? "No se pudo eliminar la imagen.");
          return;
        }
      }

      setState((prev) => ({
        ...prev,
        cover_image_url: "",
        cover_image_path: "",
        og_image_url:
          prev.og_image_url === prev.cover_image_url ? "" : prev.og_image_url,
      }));
      setCoverUploadMessage("Imagen removida correctamente.");
    } catch {
      setCoverUploadMessage("Error de red eliminando la imagen.");
    } finally {
      setIsRemovingCover(false);
    }
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  async function save(targetStatus: "draft" | "published") {
    try {
      setSaveStatus("saving");
      setMessage(
        targetStatus === "published"
          ? "Publicando..."
          : "Guardando borrador...",
      );

      const response = await fetch("/api/cms/guides", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...state,
          slug: derivedSlug,
          status: targetStatus,
          tags: state.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
          reading_minutes: readingMinutes,
          chapters,
          published_at:
            targetStatus === "published" ? new Date().toISOString() : null,
          seo_title: state.seo_title || state.title,
          seo_description: state.seo_description || state.excerpt,
          og_image_url: state.og_image_url || state.cover_image_url,
        }),
      });

      const data = (await response.json()) as {
        ok?: boolean;
        error?: string;
        slug?: string;
      };

      if (!response.ok || !data.ok || !data.slug) {
        setSaveStatus("error");
        setMessage(data.error ?? "No se pudo guardar la guia.");
        return;
      }

      setSaveStatus("success");
      setMessage(
        targetStatus === "published"
          ? `Guia publicada: /guides/${data.slug}`
          : `Borrador guardado: /guides/${data.slug}`,
      );
      clientPostsCache = null;
      fetchPosts(true);
    } catch {
      setSaveStatus("error");
      setMessage("Ocurrio un error de red guardando la guia.");
    }
  }

  return (
    <div className={styles.editorShell}>
      <aside className={styles.sidebarPanel}>
        <div className={styles.postsListHeader}>
          <h3>Posts creados</h3>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={() => fetchPosts(true)}
          >
            Recargar
          </button>
        </div>

        <button
          type="button"
          className={styles.primaryButton}
          style={{ width: "100%", marginBottom: "0.65rem" }}
          onClick={resetToNewPost}
        >
          Nuevo post
        </button>

        {isLoadingPosts ? (
          <p className={styles.helperText}>Cargando guias...</p>
        ) : listError ? (
          <p className={`${styles.feedback} ${styles.feedbackError}`}>
            {listError}
          </p>
        ) : posts.length === 0 ? (
          <p className={styles.helperText}>No hay guias para editar.</p>
        ) : (
          <ul className={styles.postsList}>
            {posts.map((post) => (
              <li
                key={post.slug}
                className={`${styles.postListItem} ${
                  editingSlug === post.slug ? styles.postListItemActive : ""
                }`}
              >
                <button
                  type="button"
                  className={styles.postListButton}
                  onClick={() => loadPostForEditing(post)}
                >
                  <p className={styles.postListTitle}>{post.title}</p>
                  <p className={styles.postListMeta}>
                    {post.category} · {post.status}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        )}
      </aside>

      <section className={styles.editorPanel}>
        <div className={styles.sectionHeader}>
          <h2>Editor SEO</h2>
          <p>
            Crea una guia optimizada para buscadores y lista para publicarse en
            /guides.
          </p>
        </div>

        <div className={styles.fieldGrid}>
          <label className={styles.fieldLabel}>
            <span className={styles.fieldLabelRow}>
              Titulo <FieldBadge required />
            </span>
            <input
              className={styles.textField}
              value={state.title}
              onChange={(event) => updateField("title", event.target.value)}
              placeholder="Ej: Como invertir en CDTs en Colombia en 2026"
              required
            />
          </label>

          <label className={styles.fieldLabel}>
            <span className={styles.fieldLabelRow}>
              Slug <FieldBadge required={false} />
            </span>
            <input
              className={styles.textField}
              value={state.slug}
              onChange={(event) => updateField("slug", event.target.value)}
              placeholder="se-autogenera-si-lo-dejas-vacio"
            />
            <span className={styles.helperText}>
              Slug final: {derivedSlug || "(pendiente)"}
            </span>
          </label>

          <label className={styles.fieldLabel}>
            <span className={styles.fieldLabelRow}>
              Categoria <FieldBadge required />
            </span>
            <select
              className={styles.textField}
              value={state.category}
              onChange={(event) => handleCategoryChange(event.target.value)}
              required
            >
              {STANDARD_GUIDE_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.fieldLabel}>
            <span className={styles.fieldLabelRow}>
              Nivel <FieldBadge required />
            </span>
            <select
              className={styles.textField}
              value={state.level}
              onChange={(event) =>
                updateField("level", event.target.value as EditorState["level"])
              }
              required
            >
              <option value="Principiante">Principiante</option>
              <option value="Intermedio">Intermedio</option>
              <option value="Avanzado">Avanzado</option>
            </select>
          </label>

          <label className={styles.fieldLabel}>
            <span className={styles.fieldLabelRow}>
              Autor <FieldBadge required />
            </span>
            <input
              className={styles.textField}
              value={state.author_name}
              onChange={(event) =>
                updateField("author_name", event.target.value)
              }
              required
            />
          </label>
        </div>

        <label className={styles.fieldLabel}>
          <span className={styles.fieldLabelRow}>
            Excerpt <FieldBadge required />
          </span>
          <textarea
            className={styles.textArea}
            value={state.excerpt}
            onChange={(event) => updateField("excerpt", event.target.value)}
            rows={3}
            placeholder="Resumen corto con palabra clave principal"
            required
          />
        </label>

        <div className={styles.coverUploadBox}>
          <label className={styles.fieldLabel}>
            <span className={styles.fieldLabelRow}>
              Imagen de portada <FieldBadge required={false} />
            </span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/avif"
              className={styles.coverFileInput}
              disabled={!canWrite || isUploadingCover || isRemovingCover}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  handleCoverUpload(file);
                }
                event.currentTarget.value = "";
              }}
            />

            <span className={styles.coverDimensionHint}>
              Sugerencia: 1600x900 px (16:9). Minimo recomendado: 1200x675 px.
            </span>
          </label>

          {state.cover_image_url ? (
            <div className={styles.coverPreviewBox}>
              <img
                src={state.cover_image_url}
                alt={state.title || "Cover image"}
                className={styles.coverPreviewImage}
              />
              <a
                href={state.cover_image_url}
                target="_blank"
                rel="noreferrer"
                className={styles.coverPreviewLink}
              >
                Ver imagen
              </a>
              <button
                type="button"
                className={styles.coverRemoveButton}
                onClick={handleCoverRemove}
                disabled={!canWrite || isUploadingCover || isRemovingCover}
              >
                {isRemovingCover ? "Eliminando..." : "Remover imagen"}
              </button>
            </div>
          ) : (
            <div className={styles.coverPreviewBox}>
              <div
                className={styles.coverPreviewFallback}
                style={{ background: state.cover_gradient }}
              >
                <span
                  className={`material-icons-outlined ${styles.coverPreviewFallbackIcon}`}
                >
                  {state.cover_icon}
                </span>
              </div>
              <p className={styles.helperText}>
                Sin imagen subida. Se usara la portada automatica de la
                categoria.
              </p>
            </div>
          )}

          {coverUploadMessage ? (
            <p
              className={`${styles.feedback} ${
                coverUploadMessage.toLowerCase().includes("correctamente")
                  ? styles.feedbackOk
                  : styles.feedbackError
              }`}
            >
              {coverUploadMessage}
            </p>
          ) : null}
        </div>

        <div className={styles.optionalFieldsToggleRow}>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={() => setShowOptionalFields((prev) => !prev)}
          >
            {showOptionalFields
              ? "Ocultar opciones opcionales"
              : "Mostrar opciones opcionales"}
          </button>
        </div>

        {showOptionalFields ? (
          <div className={styles.optionalSection}>
            <div className={styles.fieldGrid}>
              <label className={styles.fieldLabel}>
                <span className={styles.fieldLabelRow}>
                  Cargo del autor <FieldBadge required={false} />
                </span>
                <input
                  className={styles.textField}
                  value={state.author_role}
                  onChange={(event) =>
                    updateField("author_role", event.target.value)
                  }
                />
              </label>
              <label className={styles.fieldLabel}>
                <span className={styles.fieldLabelRow}>
                  Cover icon (Material) <FieldBadge required={false} />
                </span>
                <input
                  className={styles.textField}
                  value={state.cover_icon}
                  onChange={(event) =>
                    updateField("cover_icon", event.target.value)
                  }
                  placeholder="menu_book"
                />
              </label>
              <label className={styles.fieldLabel}>
                <span className={styles.fieldLabelRow}>
                  Cover gradient <FieldBadge required={false} />
                </span>
                <input
                  className={styles.textField}
                  value={state.cover_gradient}
                  onChange={(event) =>
                    updateField("cover_gradient", event.target.value)
                  }
                  placeholder="linear-gradient(135deg,#1e3a8a,#1d4ed8)"
                />
              </label>
              <label className={styles.fieldLabel}>
                <span className={styles.fieldLabelRow}>
                  SEO title <FieldBadge required={false} />
                </span>
                <input
                  className={styles.textField}
                  value={state.seo_title}
                  onChange={(event) =>
                    updateField("seo_title", event.target.value)
                  }
                  placeholder="Si queda vacio usa el titulo"
                />
              </label>
              <label className={styles.fieldLabel}>
                <span className={styles.fieldLabelRow}>
                  SEO description <FieldBadge required={false} />
                </span>
                <input
                  className={styles.textField}
                  value={state.seo_description}
                  onChange={(event) =>
                    updateField("seo_description", event.target.value)
                  }
                  placeholder="Si queda vacio usa el excerpt"
                />
              </label>
              <label className={styles.fieldLabel}>
                <span className={styles.fieldLabelRow}>
                  Canonical URL <FieldBadge required={false} />
                </span>
                <input
                  className={styles.textField}
                  value={state.canonical_url}
                  onChange={(event) =>
                    updateField("canonical_url", event.target.value)
                  }
                  placeholder="https://..."
                />
              </label>
              <label className={styles.fieldLabel}>
                <span className={styles.fieldLabelRow}>
                  OG image URL <FieldBadge required={false} />
                </span>
                <input
                  className={styles.textField}
                  value={state.og_image_url}
                  onChange={(event) =>
                    updateField("og_image_url", event.target.value)
                  }
                  placeholder="https://..."
                />
              </label>
              <label className={styles.fieldLabel}>
                <span className={styles.fieldLabelRow}>
                  Tags (separadas por coma) <FieldBadge required={false} />
                </span>
                <input
                  className={styles.textField}
                  value={state.tags}
                  onChange={(event) => updateField("tags", event.target.value)}
                  placeholder="ahorro, inversion, trm"
                />
              </label>
            </div>

            <label className={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={state.featured}
                onChange={(event) =>
                  updateField("featured", event.target.checked)
                }
              />
              Marcar como guia destacada
            </label>
          </div>
        ) : null}

        <label className={styles.fieldLabel}>
          <span className={styles.fieldLabelRow}>
            Contenido <FieldBadge required />
          </span>

          <div className={styles.editorModeRow}>
            <button
              type="button"
              className={`${styles.editorModeButton} ${
                editorMode === "markdown" ? styles.editorModeButtonActive : ""
              }`}
              onClick={() => setEditorMode("markdown")}
            >
              Markdown
            </button>
            <button
              type="button"
              className={`${styles.editorModeButton} ${
                editorMode === "assisted" ? styles.editorModeButtonActive : ""
              }`}
              onClick={() => setEditorMode("assisted")}
            >
              Texto asistido
            </button>
          </div>

          {editorMode === "assisted" ? (
            <div className={styles.editorAssistBox}>
              <div className={styles.formatToolbar}>
                <button
                  type="button"
                  className={styles.formatButton}
                  onClick={() => wrapSelection("**", "**", "negrita")}
                >
                  Negrita
                </button>
                <button
                  type="button"
                  className={styles.formatButton}
                  onClick={() => insertHeading(1)}
                >
                  H1
                </button>
                <button
                  type="button"
                  className={styles.formatButton}
                  onClick={() => insertHeading(2)}
                >
                  H2
                </button>
                <button
                  type="button"
                  className={styles.formatButton}
                  onClick={insertLink}
                >
                  Link
                </button>
              </div>
              <p className={styles.formatHint}>
                Selecciona texto y usa los botones para insertar formato.
              </p>
              <textarea
                ref={contentRef}
                className={styles.editorArea}
                value={state.content_markdown}
                onChange={(event) =>
                  updateField("content_markdown", event.target.value)
                }
                rows={20}
                placeholder="Escribe el articulo y usa los botones para dar formato"
                required
              />
            </div>
          ) : (
            <textarea
              ref={contentRef}
              className={styles.editorArea}
              value={state.content_markdown}
              onChange={(event) =>
                updateField("content_markdown", event.target.value)
              }
              rows={20}
              placeholder="Escribe el post con H2, listas, tablas y enlaces"
              required
            />
          )}
        </label>

        <div className={styles.metricsRow}>
          <span>{readingMinutes} min lectura</span>
          <span>{chapters} capitulos detectados (##)</span>
        </div>

        <div className={styles.actionRow}>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={() => save("draft")}
            disabled={saveStatus === "saving" || !canWrite}
          >
            Guardar borrador
          </button>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={() => save("published")}
            disabled={saveStatus === "saving" || !canWrite}
          >
            Publicar en /guides
          </button>
        </div>

        {!canWrite ? (
          <p className={`${styles.feedback} ${styles.feedbackError}`}>
            No hay llave de escritura configurada para Supabase. Define
            SUPABASE_SERVICE_ROLE_KEY, o habilita policies RLS de insert/update
            para usar ANON/PUBLISHABLE key.
          </p>
        ) : null}

        <p
          className={`${styles.feedback} ${
            saveStatus === "error"
              ? styles.feedbackError
              : saveStatus === "success"
                ? styles.feedbackOk
                : ""
          }`}
        >
          {message || "Completa los campos y guarda."}
        </p>
      </section>

      <section className={styles.previewPanel}>
        <div className={styles.sectionHeader}>
          <h2>Vista previa</h2>
          <p>Render de markdown y metadatos SEO.</p>
        </div>

        <h3 className={styles.previewTitle}>
          {state.title || "Titulo de la guia"}
        </h3>
        <p className={styles.previewExcerpt}>
          {state.excerpt || "Tu resumen SEO aparecera aqui."}
        </p>

        <div className={styles.seoBox}>
          <p>
            <strong>Meta Title:</strong> {state.seo_title || state.title || "-"}
          </p>
          <p>
            <strong>Meta Description:</strong>{" "}
            {state.seo_description || state.excerpt || "-"}
          </p>
          <p>
            <strong>Slug:</strong> /guides/{derivedSlug || "..."}
          </p>
          {state.cover_image_url ? (
            <p>
              <strong>Cover:</strong> cargada
            </p>
          ) : null}
        </div>

        <article className={styles.previewBody}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {state.content_markdown}
          </ReactMarkdown>
        </article>
      </section>
    </div>
  );
}
