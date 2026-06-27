"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CreateLink,
  InsertThematicBreak,
  ListsToggle,
  MDXEditor,
  Separator,
  type MDXEditorMethods,
  UndoRedo,
  headingsPlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  quotePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
} from "@mdxeditor/editor";
import styles from "@/app/cms/cms.module.css";

type MarkdownEditorProps = {
  value: string;
  onChange: (markdown: string) => void;
};

function subscribeToClientMount() {
  return () => {};
}

function useIsClientMounted() {
  return useSyncExternalStore(
    subscribeToClientMount,
    () => true,
    () => false,
  );
}

export function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const editorRef = useRef<MDXEditorMethods>(null);
  const currentValueRef = useRef(value);
  const isMounted = useIsClientMounted();

  useEffect(() => {
    if (value === currentValueRef.current) {
      return;
    }

    currentValueRef.current = value;
    editorRef.current?.setMarkdown(value);
  }, [value]);

  if (!isMounted) {
    return (
      <textarea
        className={`${styles.editorArea} ${styles.markdownEditorContent}`}
        value={value}
        readOnly
        rows={20}
        aria-label="Editor de markdown"
      />
    );
  }

  return (
    <MDXEditor
      ref={editorRef}
      className={styles.markdownEditor}
      contentEditableClassName={styles.markdownEditorContent}
      markdown={value}
      onChange={(markdown) => {
        currentValueRef.current = markdown;
        onChange(markdown);
      }}
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        linkPlugin(),
        linkDialogPlugin(),
        markdownShortcutPlugin(),
        toolbarPlugin({
          toolbarContents: () => (
            <>
              <UndoRedo />
              <Separator />
              <BoldItalicUnderlineToggles />
              <Separator />
              <BlockTypeSelect />
              <ListsToggle options={["bullet", "number"]} />
              <InsertThematicBreak />
              <Separator />
              <CreateLink />
            </>
          ),
        }),
      ]}
    />
  );
}
