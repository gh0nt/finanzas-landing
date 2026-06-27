export const CMS_BUTTON_LINK_TITLE = "cms-button";
export const CMS_WIDE_BUTTON_LINK_TITLE = "cms-button-wide";

const ANCHOR_BUTTON_PATTERN =
  /<a\b([^>]*)>\s*<button\b[^>]*>([\s\S]*?)<\/button>\s*<\/a>/gi;
const BUTTON_PATTERN = /<button\b([^>]*)>([\s\S]*?)<\/button>/gi;
const SHORTCODE_PATTERN = /\[button\b([^\]]*)\]([\s\S]*?)\[\/button\]/gi;
const CMS_BUTTON_BLOCK_PATTERN =
  /<a\b([^>]*)>\s*<button\b([^>]*)>([\s\S]*?)<\/button>\s*<\/a>|<button\b([^>]*)>([\s\S]*?)<\/button>|\[button\b([^\]]*)\]([\s\S]*?)\[\/button\]/gi;

export type CmsButtonSegment =
  | {
      type: "markdown";
      value: string;
    }
  | {
      type: "button";
      href: string;
      label: string;
      wide: boolean;
    };

function decodeBasicHtmlEntities(value: string) {
  return value
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function getAttribute(attributes: string, name: string) {
  const pattern = new RegExp(`\\b${name}\\s*=\\s*(["'])(.*?)\\1`, "i");
  const match = attributes.match(pattern);
  return match ? decodeBasicHtmlEntities(match[2]).trim() : "";
}

function getOnClickUrl(attributes: string) {
  const onClick = getAttribute(attributes, "onclick");

  if (!onClick) {
    return "";
  }

  const locationMatch = onClick.match(
    /(?:window\.)?location(?:\.href)?\s*=\s*(["'])(.*?)\1/i,
  );

  if (locationMatch) {
    return locationMatch[2];
  }

  const windowOpenMatch = onClick.match(/window\.open\(\s*(["'])(.*?)\1/i);
  return windowOpenMatch ? windowOpenMatch[2] : "";
}

function getButtonHref(attributes: string) {
  return (
    getAttribute(attributes, "href") ||
    getAttribute(attributes, "data-href") ||
    getOnClickUrl(attributes)
  );
}

function isWideButton(attributes: string) {
  return (
    /(?:^|\s)(?:wide|data-wide)(?:\s|=|$)/i.test(attributes) ||
    getAttribute(attributes, "variant").toLowerCase() === "wide" ||
    getAttribute(attributes, "data-variant").toLowerCase() === "wide" ||
    getAttribute(attributes, "class").toLowerCase().split(/\s+/).includes("wide")
  );
}

function normalizeButtonHref(href: string) {
  const value = decodeBasicHtmlEntities(href).trim();

  if (!value || /[\u0000-\u001f\u007f]/.test(value)) {
    return "";
  }

  if (
    value.startsWith("/") &&
    !value.startsWith("//") &&
    !value.startsWith("/\\")
  ) {
    return value;
  }

  if (value.startsWith("#")) {
    return value;
  }

  try {
    const url = new URL(value);
    return ["http:", "https:", "mailto:", "tel:"].includes(url.protocol)
      ? value
      : "";
  } catch {
    return "";
  }
}

function normalizeButtonLabel(label: string) {
  return decodeBasicHtmlEntities(label)
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeMarkdownLinkLabel(label: string) {
  return label.replace(/\\/g, "\\\\").replace(/\[/g, "\\[").replace(/\]/g, "\\]");
}

function escapeMarkdownLinkDestination(href: string) {
  return href.replace(/\\/g, "%5C").replace(/>/g, "%3E").replace(/\s/g, "%20");
}

function toButtonMarkdown(
  href: string,
  label: string,
  fallback: string,
  wide = false,
) {
  const safeHref = normalizeButtonHref(href);
  const cleanLabel = normalizeButtonLabel(label);

  if (!safeHref || !cleanLabel) {
    return normalizeButtonLabel(fallback);
  }

  const buttonTitle = wide
    ? CMS_WIDE_BUTTON_LINK_TITLE
    : CMS_BUTTON_LINK_TITLE;

  return `\n\n[${escapeMarkdownLinkLabel(cleanLabel)}](<${escapeMarkdownLinkDestination(
    safeHref,
  )}> "${buttonTitle}")\n\n`;
}

function parseCmsButtonMatch(match: RegExpExecArray) {
  const anchorAttributes = match[1] ?? "";
  const anchorButtonAttributes = match[2] ?? "";
  const anchorLabel = match[3] ?? "";
  const buttonAttributes = match[4] ?? "";
  const buttonLabel = match[5] ?? "";
  const shortcodeAttributes = match[6] ?? "";
  const shortcodeLabel = match[7] ?? "";

  const attributes =
    shortcodeAttributes || buttonAttributes || anchorButtonAttributes;
  const href = normalizeButtonHref(
    anchorAttributes
      ? getAttribute(anchorAttributes, "href")
      : getButtonHref(attributes),
  );
  const label = normalizeButtonLabel(
    shortcodeLabel || buttonLabel || anchorLabel,
  );
  const wide = isWideButton(`${anchorAttributes} ${attributes}`);

  if (!href || !label) {
    return null;
  }

  return { href, label, wide };
}

export function parseCmsButtonSegments(markdown: string): CmsButtonSegment[] {
  const segments: CmsButtonSegment[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  CMS_BUTTON_BLOCK_PATTERN.lastIndex = 0;

  while ((match = CMS_BUTTON_BLOCK_PATTERN.exec(markdown))) {
    if (match.index > lastIndex) {
      segments.push({
        type: "markdown",
        value: markdown.slice(lastIndex, match.index),
      });
    }

    const button = parseCmsButtonMatch(match);

    if (button) {
      segments.push({
        type: "button",
        ...button,
      });
    } else {
      segments.push({
        type: "markdown",
        value: match[0],
      });
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < markdown.length) {
    segments.push({
      type: "markdown",
      value: markdown.slice(lastIndex),
    });
  }

  return segments.length ? segments : [{ type: "markdown", value: markdown }];
}

export function transformCmsButtonsToMarkdown(markdown: string) {
  return markdown
    .replace(ANCHOR_BUTTON_PATTERN, (match, anchorAttributes, label) =>
      toButtonMarkdown(
        getAttribute(anchorAttributes, "href"),
        label,
        match,
        isWideButton(anchorAttributes),
      ),
    )
    .replace(BUTTON_PATTERN, (match, buttonAttributes, label) =>
      toButtonMarkdown(
        getButtonHref(buttonAttributes),
        label,
        match,
        isWideButton(buttonAttributes),
      ),
    )
    .replace(SHORTCODE_PATTERN, (match, attributes, label) =>
      toButtonMarkdown(
        getButtonHref(attributes),
        label,
        match,
        isWideButton(attributes),
      ),
    );
}
