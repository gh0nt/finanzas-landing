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
type ToastState = {
  message: string;
  tone: "success" | "error";
} | null;

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
  const [toast, setToast] = useState<ToastState>(null);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isRemovingCover, setIsRemovingCover] = useState(false);
  const [isDeletingSlug, setIsDeletingSlug] = useState<string | null>(null);
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

  function notify(message: string, tone: "success" | "error") {
    setToast({ message, tone });
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

  function isFallbackPost(post: GuidePost) {
    return post.id.startsWith("fallback-");
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

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setToast(null);
    }, 4200);

    return () => window.clearTimeout(timeoutId);
  }, [toast]);

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
        const errorMessage = data.error ?? "No se pudo guardar la guia.";
        setSaveStatus("error");
        setMessage(errorMessage);
        notify(errorMessage, "error");
        return;
      }

      const successMessage =
        targetStatus === "published"
          ? `Guia publicada: /guides/${data.slug}`
          : `Borrador guardado: /guides/${data.slug}`;

      setSaveStatus("success");
      setMessage(successMessage);
      notify(successMessage, "success");
      clientPostsCache = null;
      fetchPosts(true);
    } catch {
      const errorMessage = "Ocurrio un error de red guardando la guia.";
      setSaveStatus("error");
      setMessage(errorMessage);
      notify(errorMessage, "error");
    }
  }

  async function deletePost(post: GuidePost) {
    if (isFallbackPost(post)) {
      setSaveStatus("error");
      setMessage("La guia base no se puede eliminar desde el CMS.");
      notify("La guia base no se puede eliminar desde el CMS.", "error");
      return;
    }

    const confirmed = window.confirm(
      `Eliminar "${post.title}"? Esta accion no se puede deshacer.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setIsDeletingSlug(post.slug);
      setSaveStatus("saving");
      setMessage(`Eliminando: ${post.title}...`);

      const response = await fetch("/api/cms/guides", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ slug: post.slug }),
      });

      const data = (await response.json()) as {
        ok?: boolean;
        error?: string;
        slug?: string;
      };

      if (!response.ok || !data.ok) {
        const errorMessage = data.error ?? "No se pudo eliminar la guia.";
        setSaveStatus("error");
        setMessage(errorMessage);
        notify(errorMessage, "error");
        return;
      }

      if (editingSlug === post.slug) {
        setState(initialState);
        setCoverUploadMessage("");
      }

      setSaveStatus("success");
      setMessage(`Guia eliminada: /guides/${post.slug}`);
      notify(`Guia eliminada: /guides/${post.slug}`, "success");
      clientPostsCache = null;
      await fetchPosts(true);
    } catch {
      const errorMessage = "Ocurrio un error de red eliminando la guia.";
      setSaveStatus("error");
      setMessage(errorMessage);
      notify(errorMessage, "error");
    } finally {
      setIsDeletingSlug(null);
    }
  }

  const parsedTags = state.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
  const saveDisabled = saveStatus === "saving" || !canWrite;
  const seoPreviewTitle = state.seo_title || state.title || "Post Title";
  const seoPreviewDescription =
    state.seo_description ||
    state.excerpt ||
    "The search snippet will appear here once you provide a meta description above.";

  return (
    <div className={styles.editorShell}>
      {toast ? (
        <div
          className={`${styles.toast} ${
            toast.tone === "success" ? styles.toastSuccess : styles.toastError
          }`}
          role="status"
          aria-live="polite"
        >
          <span
            className={`material-icons-outlined ${styles.toastIcon}`}
            aria-hidden="true"
          >
            {toast.tone === "success" ? "check_circle" : "error"}
          </span>
          <p>{toast.message}</p>
          <button
            type="button"
          className={styles.toastClose}
          onClick={() => setToast(null)}
          aria-label="Cerrar notificacion"
        >
            <span
              className={`material-icons-outlined ${styles.toastCloseIcon}`}
              aria-hidden="true"
            >
              close
            </span>
          </button>
        </div>
      ) : null}

      <main className={styles.editorCanvas}>
        <header className={styles.editorTopbar}>
          <div className={styles.editorBrand}>
            <span className={styles.editorLogo} aria-hidden="true">
              <svg viewBox="0 0 48 48" role="img">
                <path
                  d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z"
                  fill="currentColor"
                />
              </svg>
            </span>
            <h2>Content Manager</h2>
          </div>
          <div className={styles.editorTopbarActions}>
            <button
              type="button"
              className={styles.primaryButton}
              onClick={() => save("published")}
              disabled={saveDisabled}
            >
              Publish
            </button>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => save("draft")}
              disabled={saveDisabled}
            >
              Save Draft
            </button>
          </div>
        </header>

        <div className={styles.editorFields}>
          <label className={styles.fieldLabel}>
            Post Title
            <input
              className={styles.textField}
              value={state.title}
              onChange={(event) => updateField("title", event.target.value)}
              placeholder="Enter a catchy title..."
              required
            />
          </label>

          <label className={styles.fieldLabel}>
            Permalink
            <input
              className={styles.textField}
              value={state.slug}
              onChange={(event) => updateField("slug", event.target.value)}
            />
            <span className={styles.helperText}>
              Slug final: {derivedSlug || "(pendiente)"}
            </span>
          </label>
        </div>

        <label className={`${styles.fieldLabel} ${styles.storyField}`}>
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

          <div className={styles.storyEditorFrame}>
            <textarea
              ref={contentRef}
              className={styles.editorArea}
              value={state.content_markdown}
              onChange={(event) =>
                updateField("content_markdown", event.target.value)
              }
              rows={20}
              placeholder="Write your story here..."
              required
            />
            <div className={styles.formatToolbar}>
              <button type="button" className={styles.formatButton} onClick={() => wrapSelection("**", "**", "bold")} aria-label="Bold">B</button>
              <button type="button" className={styles.formatButton} onClick={() => wrapSelection("_", "_", "italic")} aria-label="Italic"><em>I</em></button>
              <button type="button" className={styles.formatButton} onClick={() => insertHeading(2)} aria-label="List"><span className="material-icons-outlined">format_list_bulleted</span></button>
              <button type="button" className={styles.formatButton} onClick={insertLink} aria-label="Link"><span className="material-icons-outlined">link</span></button>
              <button type="button" className={styles.formatButton} onClick={() => wrapSelection("![", "](https://)", "image alt")} aria-label="Image"><span className="material-icons-outlined">image</span></button>
              <a className={styles.previewButton} href="#cms-preview">Preview</a>
            </div>
          </div>
        </label>

        <div className={styles.coverUploadBox}>
          <div className={styles.coverVisual}>
            {state.cover_image_url ? (
              <img src={state.cover_image_url} alt={state.title || "Cover image"} className={styles.coverPreviewImage} />
            ) : (
              <div className={styles.coverPreviewFallback} style={{ background: state.cover_gradient }}>
                <span className={`material-icons-outlined ${styles.coverPreviewFallbackIcon}`}>{state.cover_icon}</span>
              </div>
            )}
          </div>
          <div className={styles.coverUploadContent}>
            <h3>Featured Image</h3>
            <p>Drag and drop or click to upload</p>
            <label className={styles.uploadButton}>
              <span>{isUploadingCover ? "Uploading..." : "Upload Image"}</span>
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
            </label>
            {state.cover_image_url ? (
              <div className={styles.coverActions}>
                <a href={state.cover_image_url} target="_blank" rel="noreferrer" className={styles.coverPreviewLink}>Ver imagen</a>
                <button type="button" className={styles.coverRemoveButton} onClick={handleCoverRemove} disabled={!canWrite || isUploadingCover || isRemovingCover}>
                  {isRemovingCover ? "Eliminando..." : "Remover imagen"}
                </button>
              </div>
            ) : null}
            <span className={styles.coverDimensionHint}>Sugerencia: 1600x900 px (16:9). Minimo recomendado: 1200x675 px.</span>
            {coverUploadMessage ? (
              <p className={`${styles.feedback} ${coverUploadMessage.toLowerCase().includes("correctamente") ? styles.feedbackOk : styles.feedbackError}`}>{coverUploadMessage}</p>
            ) : null}
          </div>
        </div>

        <label className={styles.fieldLabel}>
          Excerpt
          <textarea className={styles.textArea} value={state.excerpt} onChange={(event) => updateField("excerpt", event.target.value)} rows={3} placeholder="Resumen corto con palabra clave principal" required />
        </label>

        <section
          className={`${styles.settingsSection} ${styles.inlinePreviewSection}`}
          id="cms-preview"
        >
          <div className={styles.settingsHeading}><span className="material-icons-outlined">visibility</span><h3>Vista previa</h3></div>
          <div className={styles.previewPanel}>
            <h3 className={styles.previewTitle}>{state.title || "Titulo de la guia"}</h3>
            <p className={styles.previewExcerpt}>{state.excerpt || "Tu resumen SEO aparecera aqui."}</p>
            <div className={styles.seoBox}>
              <p><strong>Meta Title:</strong> {state.seo_title || state.title || "-"}</p>
              <p><strong>Meta Description:</strong> {state.seo_description || state.excerpt || "-"}</p>
              <p><strong>Slug:</strong> /guides/{derivedSlug || "..."}</p>
              {state.cover_image_url ? <p><strong>Cover:</strong> cargada</p> : null}
            </div>
            <article className={styles.previewBody}><ReactMarkdown remarkPlugins={[remarkGfm]}>{state.content_markdown}</ReactMarkdown></article>
          </div>
        </section>

        {!canWrite ? (
          <p className={`${styles.feedback} ${styles.feedbackError}`}>No hay llave de escritura configurada para Supabase. Define SUPABASE_SERVICE_ROLE_KEY, o habilita policies RLS de insert/update para usar ANON/PUBLISHABLE key.</p>
        ) : null}

        <p className={`${styles.feedback} ${saveStatus === "error" ? styles.feedbackError : saveStatus === "success" ? styles.feedbackOk : ""}`}>{message || "Completa los campos y guarda."}</p>
      </main>

      <aside className={styles.settingsSidebar}>
        <section className={styles.settingsSection}>
          <div className={styles.settingsHeading}><span className="material-icons-outlined">publish</span><h3>Publish Settings</h3></div>
          <div className={styles.settingsCard}>
            <label className={styles.fieldLabel}>Status
              <select className={styles.textField} value={state.status} onChange={(event) => updateField("status", event.target.value as EditorState["status"])}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </label>
            <label className={styles.fieldLabel}>Author <FieldBadge required />
              <input className={styles.textField} value={state.author_name} onChange={(event) => updateField("author_name", event.target.value)} required />
            </label>
            <label className={styles.fieldLabel}>Level <FieldBadge required />
              <select className={styles.textField} value={state.level} onChange={(event) => updateField("level", event.target.value as EditorState["level"])} required>
                <option value="Principiante">Principiante</option>
                <option value="Intermedio">Intermedio</option>
                <option value="Avanzado">Avanzado</option>
              </select>
            </label>
            <label className={styles.checkboxRow}><input type="checkbox" checked={state.featured} onChange={(event) => updateField("featured", event.target.checked)} />Marcar como guia destacada</label>
            <div className={styles.metricsRow}><span>{readingMinutes} min lectura</span><span>{chapters} capitulos (##)</span></div>
          </div>
        </section>

        <section className={styles.settingsSection}>
          <div className={styles.settingsHeading}><span className="material-icons-outlined">category</span><h3>Categories</h3></div>
          <div className={styles.settingsCard}><div className={styles.categoryList}>
            {STANDARD_GUIDE_CATEGORIES.map((category) => (
              <label key={category} className={styles.categoryOption}><input type="checkbox" checked={state.category === category} onChange={() => handleCategoryChange(category)} /><span>{category}</span></label>
            ))}
          </div></div>
        </section>

        <section className={styles.settingsSection}>
          <div className={styles.settingsHeading}><span className="material-icons-outlined">label</span><h3>Tags</h3></div>
          <div className={styles.settingsCard}>
            <input className={styles.textField} value={state.tags} onChange={(event) => updateField("tags", event.target.value)} placeholder="Add tags separated by commas" />
            {parsedTags.length ? <div className={styles.tagChips}>{parsedTags.map((tag) => <span key={tag}>#{tag} x</span>)}</div> : null}
          </div>
        </section>

        <section className={styles.settingsSection}>
          <div className={styles.settingsHeading}><span className="material-icons-outlined">search</span><h3>SEO Optimization</h3></div>
          <div className={styles.settingsCard}>
            <label className={styles.fieldLabel}>SEO Title <FieldBadge required={false} />
              <input className={styles.textField} value={state.seo_title} onChange={(event) => updateField("seo_title", event.target.value)} placeholder="Si queda vacio usa el titulo" />
            </label>
            <label className={styles.fieldLabel}>Meta Description <FieldBadge required={false} />
              <textarea className={styles.textArea} value={state.seo_description} onChange={(event) => updateField("seo_description", event.target.value)} rows={5} placeholder="Brief summary for search engine results..." />
              <span className={styles.characterCount}>{state.seo_description.length} / 160 characters</span>
            </label>
            <div className={styles.searchSnippet}><p>{seoPreviewTitle} | Content Manager Preview</p><span>cms.example.com/blog/{derivedSlug || "slug-here"}</span><small>{seoPreviewDescription}</small></div>
          </div>
        </section>

        <section className={styles.settingsSection}>
          <div className={styles.settingsHeading}><span className="material-icons-outlined">article</span><h3>Posts creados</h3></div>
          <div className={styles.settingsCard}>
            <div className={styles.postsListHeader}>
              <button type="button" className={styles.primaryButton} onClick={resetToNewPost}>Nuevo post</button>
              <button type="button" className={styles.secondaryButton} onClick={() => fetchPosts(true)}>Recargar</button>
            </div>
            {isLoadingPosts ? <p className={styles.helperText}>Cargando guias...</p> : listError ? <p className={`${styles.feedback} ${styles.feedbackError}`}>{listError}</p> : posts.length === 0 ? <p className={styles.helperText}>No hay guias para editar.</p> : (
              <ul className={styles.postsList}>{posts.map((post) => (
                <li key={post.slug} className={`${styles.postListItem} ${editingSlug === post.slug ? styles.postListItemActive : ""}`}>
                  <div className={styles.postListRow}>
                    <button type="button" className={styles.postListButton} onClick={() => loadPostForEditing(post)}><p className={styles.postListTitle}>{post.title}</p><p className={styles.postListMeta}>{post.category} - {post.status}</p></button>
                    <button type="button" className={`${styles.postDeleteButton} ${isFallbackPost(post) ? styles.postDeleteButtonDisabled : ""}`} onClick={() => deletePost(post)} disabled={!canWrite || Boolean(isDeletingSlug) || isFallbackPost(post)} title={isFallbackPost(post) ? "La guia base no se puede eliminar" : "Eliminar post"}>{isDeletingSlug === post.slug ? "..." : "Eliminar"}</button>
                  </div>
                </li>
              ))}</ul>
            )}
          </div>
        </section>

        <section className={styles.settingsSection}>
          <div className={styles.settingsHeading}><span className="material-icons-outlined">tune</span><h3>Opciones opcionales</h3></div>
          <div className={styles.settingsCard}>
            <button type="button" className={styles.secondaryButton} onClick={() => setShowOptionalFields((prev) => !prev)}>{showOptionalFields ? "Ocultar opciones" : "Mostrar opciones"}</button>
            {showOptionalFields ? (
              <div className={styles.optionalSection}>
                <label className={styles.fieldLabel}>Cargo del autor <FieldBadge required={false} /><input className={styles.textField} value={state.author_role} onChange={(event) => updateField("author_role", event.target.value)} /></label>
                <label className={styles.fieldLabel}>Cover icon (Material) <FieldBadge required={false} /><input className={styles.textField} value={state.cover_icon} onChange={(event) => updateField("cover_icon", event.target.value)} placeholder="menu_book" /></label>
                <label className={styles.fieldLabel}>Cover gradient <FieldBadge required={false} /><input className={styles.textField} value={state.cover_gradient} onChange={(event) => updateField("cover_gradient", event.target.value)} placeholder="linear-gradient(135deg,#1e3a8a,#1d4ed8)" /></label>
                <label className={styles.fieldLabel}>Canonical URL <FieldBadge required={false} /><input className={styles.textField} value={state.canonical_url} onChange={(event) => updateField("canonical_url", event.target.value)} placeholder="https://..." /></label>
                <label className={styles.fieldLabel}>OG image URL <FieldBadge required={false} /><input className={styles.textField} value={state.og_image_url} onChange={(event) => updateField("og_image_url", event.target.value)} placeholder="https://..." /></label>
              </div>
            ) : null}
          </div>
        </section>

      </aside>
    </div>
  );
}
