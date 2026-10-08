"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  ArrowLeft,
  Bold,
  ExternalLink,
  FileText,
  Heading2,
  Heading3,
  ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Loader2,
  Minus,
  Quote,
  Redo2,
  RemoveFormatting,
  Save,
  Search,
  Strikethrough,
  Trash2,
  Underline,
  Undo2,
  X
} from "lucide-react";
import slugify from "@sindresorhus/slugify";
import { toast } from "sonner";

import type { BlogPost, PostStatus } from "@/types/content";

import { getPublicImageUrl } from "@/lib/content/image-url";

import { ImageCropUploader } from "@/components/admin/ImageCropUploader";

import { createBlogPostAction, deleteBlogPostAction, updateBlogPostAction } from "./actions";

interface BlogPostEditorProps {
  initialPost?: BlogPost | null;
  isNew?: boolean;
}

const DEFAULT_CATEGORIES = [
  "Cleaning Tips",
  "Move-In & Move-Out",
  "Upholstery Care",
  "Villa Cleaning",
  "Commercial Cleaning",
  "Deep Cleaning"
];

export function BlogPostEditor({ initialPost, isNew = false }: BlogPostEditorProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form States
  const [title, setTitle] = useState(initialPost?.title || "");
  const [slug, setSlug] = useState(initialPost?.slug || "");
  const [isCustomSlug, setIsCustomSlug] = useState(Boolean(initialPost?.slug));
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt || "");
  const [content, setContent] = useState(initialPost?.content || "");
  const [coverImage, setCoverImage] = useState(
    initialPost?.coverImage || "/images/placeholder/gallery-home.png"
  );
  const [coverImageAlt, setCoverImageAlt] = useState(
    initialPost?.coverImageAlt || "Dubai cleaning guide cover image"
  );
  const [category, setCategory] = useState(initialPost?.category || "Cleaning Tips");
  const [customCategory, setCustomCategory] = useState("");
  const [tags, setTags] = useState<string[]>(initialPost?.tags || ["Dubai", "Cleaning Tips"]);
  const [tagInput, setTagInput] = useState("");
  const [author, setAuthor] = useState(initialPost?.author || "JUBU Expert Team");
  const [authorRole, setAuthorRole] = useState(initialPost?.authorRole || "Cleaning Specialist");
  const [status, setStatus] = useState<PostStatus>(initialPost?.status || "PUBLISHED");
  const [readTime, setReadTime] = useState(initialPost?.readTime || "5 min read");
  const [metaTitle, setMetaTitle] = useState(initialPost?.metaTitle || "");
  const [metaDescription, setMetaDescription] = useState(initialPost?.metaDescription || "");

  // Editor View Mode: "visual" | "text"
  const [editorMode, setEditorMode] = useState<"visual" | "text">("visual");

  // Editor Refs
  const visualEditorRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // In-Post Media Modal
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [mediaImageUrl, setMediaImageUrl] = useState("");
  const [mediaAlt, setMediaAlt] = useState("");
  const [mediaCaption, setMediaCaption] = useState("");
  const [mediaSize, setMediaSize] = useState<"thumb" | "medium" | "full">("medium");
  const [mediaAlign, setMediaAlign] = useState<"left" | "center" | "right" | "none">("center");

  const updateWordCountAndReadTime = (text: string) => {
    const plainText = text.replace(/<[^>]*>/g, " ").trim();
    const words = (title + " " + plainText).trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    setReadTime(`${minutes} min read`);
  };

  // Sync content into visual editor on mount and when switching back to visual mode
  useEffect(() => {
    if (editorMode === "visual" && visualEditorRef.current) {
      if (visualEditorRef.current.innerHTML !== content) {
        visualEditorRef.current.innerHTML = content || "";
      }
    }
  }, [editorMode, content]);

  const handleVisualInput = () => {
    if (visualEditorRef.current) {
      const html = visualEditorRef.current.innerHTML;
      setContent(html);
      updateWordCountAndReadTime(html);
    }
  };

  const handleSwitchToVisual = () => {
    setEditorMode("visual");
    setTimeout(() => {
      if (visualEditorRef.current) {
        visualEditorRef.current.innerHTML = content || "";
      }
    }, 0);
  };

  const handleSwitchToText = () => {
    if (visualEditorRef.current) {
      setContent(visualEditorRef.current.innerHTML);
    }
    setEditorMode("text");
  };

  // Helper to execute visual WYSIWYG commands
  const executeVisualCommand = (command: string, value: string | undefined = undefined) => {
    if (editorMode !== "visual" || !visualEditorRef.current) return;
    visualEditorRef.current.focus();
    document.execCommand(command, false, value);
    const updatedHtml = visualEditorRef.current.innerHTML;
    setContent(updatedHtml);
    updateWordCountAndReadTime(updatedHtml);
  };

  // Helper to insert HTML tags into textarea in Text mode
  const insertTagInTextarea = (openTag: string, closeTag = "") => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setContent((prev) => `${prev}\n${openTag}${closeTag}\n`);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    const replacement = `${openTag}${selected || "text"}${closeTag}`;
    const newContent = text.substring(0, start) + replacement + text.substring(end);
    setContent(newContent);
    updateWordCountAndReadTime(newContent);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + openTag.length,
        start + openTag.length + (selected ? selected.length : 4)
      );
    }, 0);
  };

  const applyFormatting = (
    command: string,
    openTag: string,
    closeTag = "",
    value: string | undefined = undefined
  ) => {
    if (editorMode === "visual") {
      executeVisualCommand(command, value);
    } else {
      insertTagInTextarea(openTag, closeTag);
    }
  };

  // Auto-slug generator when typing title
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isCustomSlug) {
      setSlug(slugify(val));
    }
    updateWordCountAndReadTime(content);
  };

  const handleAddTag = () => {
    const trimmed = tagInput.trim().replace(/^#/, "");
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tToRemove: string) => {
    setTags(tags.filter((t) => t !== tToRemove));
  };

  const handleInsertMedia = () => {
    if (!mediaImageUrl) {
      toast.error("Please provide or upload an image first.");
      return;
    }

    const sizeClass =
      mediaSize === "thumb"
        ? "size-thumb max-w-xs"
        : mediaSize === "medium"
          ? "size-medium max-w-lg"
          : "size-full w-full";

    const alignClass =
      mediaAlign === "left"
        ? "align-left float-left mr-6 mb-4"
        : mediaAlign === "right"
          ? "align-right float-right ml-6 mb-4"
          : mediaAlign === "center"
            ? "align-center mx-auto block my-6"
            : "my-4";

    const altText = mediaAlt.trim() || title || "Dubai cleaning service image";
    const captionHtml = mediaCaption.trim()
      ? `<figcaption class="mt-2 text-xs text-slate-400 text-center">${mediaCaption.trim()}</figcaption>`
      : "";

    const mediaSnippet = `<div class="my-6 ${mediaAlign === "center" ? "flex justify-center" : ""}"><figure class="${alignClass} ${sizeClass}"><img src="${mediaImageUrl}" alt="${altText}" class="rounded-2xl border border-white/10 shadow-xl w-full" />${captionHtml}</figure></div>`;

    if (editorMode === "visual" && visualEditorRef.current) {
      visualEditorRef.current.focus();
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0 && visualEditorRef.current.contains(sel.anchorNode)) {
        document.execCommand("insertHTML", false, mediaSnippet);
      } else {
        visualEditorRef.current.innerHTML += `\n${mediaSnippet}\n`;
      }
      setContent(visualEditorRef.current.innerHTML);
      updateWordCountAndReadTime(visualEditorRef.current.innerHTML);
    } else if (textareaRef.current) {
      insertTagInTextarea(mediaSnippet, "");
    } else {
      setContent((prev) => `${prev}\n${mediaSnippet}\n`);
      updateWordCountAndReadTime(`${content}\n${mediaSnippet}\n`);
    }

    setIsMediaModalOpen(false);
    setMediaImageUrl("");
    setMediaAlt("");
    setMediaCaption("");
    toast.success("Image embedded into post!");
  };

  // Submit Handler
  const handleSave = async (targetStatus?: PostStatus) => {
    if (!title.trim()) {
      toast.error("Please enter an article title.");
      return;
    }
    if (!excerpt.trim()) {
      toast.error("Please provide a short excerpt for SEO snippets.");
      return;
    }

    // Capture latest visual content if in visual mode
    let finalContent = content;
    if (editorMode === "visual" && visualEditorRef.current) {
      finalContent = visualEditorRef.current.innerHTML;
      setContent(finalContent);
    }

    const saveStatus = targetStatus || status;
    setIsSubmitting(true);

    try {
      const payload = {
        title: title.trim(),
        slug: slug.trim() ? slugify(slug) : slugify(title),
        excerpt: excerpt.trim(),
        content: finalContent,
        coverImage,
        coverImageAlt: coverImageAlt.trim() || title.trim(),
        category: category === "Custom" && customCategory.trim() ? customCategory.trim() : category,
        tags,
        author: author.trim() || "JUBU Expert Team",
        authorRole: authorRole.trim() || "Cleaning Specialist",
        status: saveStatus,
        readTime,
        metaTitle: metaTitle.trim() || title.trim(),
        metaDescription: metaDescription.trim() || excerpt.trim()
      };

      if (isNew) {
        const res = await createBlogPostAction(payload);
        if (res.success) {
          toast.success("Post published successfully!");
          router.push("/admin/content/blog");
        } else {
          toast.error(res.error || "Failed to create post");
        }
      } else if (initialPost) {
        const res = await updateBlogPostAction(initialPost.id, payload);
        if (res.success) {
          toast.success("Post updated successfully!");
          router.push("/admin/content/blog");
        } else {
          toast.error(res.error || "Failed to update post");
        }
      }
    } catch {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!initialPost) return;
    if (!confirm("Are you sure you want to permanently delete this article?")) return;

    setIsDeleting(true);
    try {
      const res = await deleteBlogPostAction(initialPost.id);
      if (res.success) {
        toast.success("Post deleted successfully.");
        router.push("/admin/content/blog");
      } else {
        toast.error(res.error || "Failed to delete post");
      }
    } catch {
      toast.error("Failed to delete post.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col justify-between gap-4 border-b border-border/40 pb-5 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/content/blog"
            className="flex size-9 items-center justify-center rounded-xl border border-border/60 bg-muted/40 text-foreground transition-colors hover:bg-muted"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
                {isNew ? "Add New Article" : "Edit Article"}
              </h1>
              <span
                className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${
                  status === "PUBLISHED"
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
                    : "border-amber-500/30 bg-amber-500/10 text-amber-500"
                }`}
              >
                {status}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Classic WordPress-style article composer with full SEO and media size control.
            </p>
          </div>
        </div>

        {/* Quick Header Buttons */}
        <div className="flex items-center gap-2.5">
          {!isNew && initialPost && (
            <Link
              href={`/blog/${initialPost.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-xl border border-border/60 bg-background px-3.5 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
            >
              <ExternalLink className="size-3.5" />
              <span>Preview Live</span>
            </Link>
          )}

          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSave("DRAFT")}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border/60 bg-muted px-4 py-2 text-xs font-semibold transition-colors hover:bg-muted/80 disabled:opacity-50"
          >
            Save Draft
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSave("PUBLISHED")}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow-md transition-all hover:bg-primary/90 disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Save className="size-3.5" />
            )}
            <span>{isNew ? "Publish Article" : "Update Article"}</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column WordPress Layout */}
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        {/* Left Column (Content & Editor - 8 cols) */}
        <div className="space-y-6 lg:col-span-8">
          {/* Post Title Field */}
          <div className="space-y-3 rounded-2xl border border-border/60 bg-card p-5 shadow-xs">
            <label className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
              Article Title *
            </label>
            <input
              type="text"
              placeholder="Enter title here (e.g. Move-Out Cleaning Checklist for Dubai Tenants)..."
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full border-b border-border/60 bg-transparent pb-2 text-lg font-bold transition-colors focus:border-primary focus:outline-hidden sm:text-2xl"
            />

            {/* Permalink / Slug Bar (Classic WP style) */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2 text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">Permalink:</span>
              <span className="font-mono text-[11px] text-muted-foreground">
                https://jubucleaning.com/blog/
              </span>
              <input
                type="text"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setIsCustomSlug(true);
                }}
                className="rounded-md border border-border/40 bg-muted/60 px-2 py-0.5 font-mono text-xs font-bold focus:border-primary focus:outline-hidden"
              />
            </div>
          </div>

          {/* WordPress Classic Editor Box */}
          <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-xs">
            {/* Editor Top Bar with Add Media & Visual/Text Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 bg-muted/30 p-3">
              <button
                type="button"
                onClick={() => setIsMediaModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-background px-3 py-1.5 text-xs font-bold text-foreground shadow-2xs transition-colors hover:bg-muted"
              >
                <ImageIcon className="size-4 text-emerald-500" />
                <span>Add Media</span>
              </button>

              {/* Visual / Text Tabs */}
              <div className="flex items-center rounded-lg border border-border/60 bg-muted/60 p-0.5">
                <button
                  type="button"
                  onClick={handleSwitchToVisual}
                  className={`rounded-md px-3 py-1 text-xs font-bold transition-all ${
                    editorMode === "visual"
                      ? "bg-background text-foreground shadow-2xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Visual
                </button>
                <button
                  type="button"
                  onClick={handleSwitchToText}
                  className={`rounded-md px-3 py-1 text-xs font-bold transition-all ${
                    editorMode === "text"
                      ? "bg-background text-foreground shadow-2xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Text (HTML)
                </button>
              </div>
            </div>

            {/* Classic Toolbar Controls */}
            <div className="flex flex-wrap items-center gap-1 border-b border-border/60 bg-muted/15 p-2 text-foreground">
              {/* Heading selector buttons */}
              <button
                type="button"
                title="Heading 2"
                onClick={() => applyFormatting("formatBlock", "<h2>", "</h2>", "<h2>")}
                className="flex items-center gap-1 rounded-md border border-border/30 p-1.5 text-xs font-bold hover:bg-muted"
              >
                <Heading2 className="size-3.5" />
                <span>H2</span>
              </button>
              <button
                type="button"
                title="Heading 3"
                onClick={() => applyFormatting("formatBlock", "<h3>", "</h3>", "<h3>")}
                className="flex items-center gap-1 rounded-md border border-border/30 p-1.5 text-xs font-bold hover:bg-muted"
              >
                <Heading3 className="size-3.5" />
                <span>H3</span>
              </button>
              <button
                type="button"
                title="Paragraph"
                onClick={() => applyFormatting("formatBlock", "<p>", "</p>", "<p>")}
                className="rounded-md border border-border/30 p-1.5 px-2 text-xs font-semibold hover:bg-muted"
              >
                ¶
              </button>

              <div className="mx-1 h-5 w-px bg-border/60" />

              {/* Text formatting */}
              <button
                type="button"
                title="Bold"
                onClick={() => applyFormatting("bold", "<strong>", "</strong>")}
                className="rounded-md p-1.5 hover:bg-muted"
              >
                <Bold className="size-4" />
              </button>
              <button
                type="button"
                title="Italic"
                onClick={() => applyFormatting("italic", "<em>", "</em>")}
                className="rounded-md p-1.5 hover:bg-muted"
              >
                <Italic className="size-4" />
              </button>
              <button
                type="button"
                title="Underline"
                onClick={() => applyFormatting("underline", "<u>", "</u>")}
                className="rounded-md p-1.5 hover:bg-muted"
              >
                <Underline className="size-4" />
              </button>
              <button
                type="button"
                title="Strikethrough"
                onClick={() => applyFormatting("strikeThrough", "<s>", "</s>")}
                className="rounded-md p-1.5 hover:bg-muted"
              >
                <Strikethrough className="size-4" />
              </button>

              <div className="mx-1 h-5 w-px bg-border/60" />

              {/* Lists & Quotes */}
              <button
                type="button"
                title="Bulleted list"
                onClick={() =>
                  applyFormatting("insertUnorderedList", "<ul>\n  <li>", "</li>\n</ul>")
                }
                className="rounded-md p-1.5 hover:bg-muted"
              >
                <List className="size-4" />
              </button>
              <button
                type="button"
                title="Numbered list"
                onClick={() => applyFormatting("insertOrderedList", "<ol>\n  <li>", "</li>\n</ol>")}
                className="rounded-md p-1.5 hover:bg-muted"
              >
                <ListOrdered className="size-4" />
              </button>
              <button
                type="button"
                title="Blockquote"
                onClick={() =>
                  applyFormatting(
                    "formatBlock",
                    "<blockquote>\n  <p>",
                    "</p>\n</blockquote>",
                    "<blockquote>"
                  )
                }
                className="rounded-md p-1.5 hover:bg-muted"
              >
                <Quote className="size-4" />
              </button>
              <button
                type="button"
                title="Horizontal Rule"
                onClick={() => applyFormatting("insertHorizontalRule", "<hr />\n")}
                className="rounded-md p-1.5 hover:bg-muted"
              >
                <Minus className="size-4" />
              </button>

              <div className="mx-1 h-5 w-px bg-border/60" />

              {/* Text Alignment */}
              <button
                type="button"
                title="Align Left"
                onClick={() => applyFormatting("justifyLeft", '<p class="text-left">', "</p>")}
                className="rounded-md p-1.5 hover:bg-muted"
              >
                <AlignLeft className="size-4" />
              </button>
              <button
                type="button"
                title="Align Center"
                onClick={() => applyFormatting("justifyCenter", '<p class="text-center">', "</p>")}
                className="rounded-md p-1.5 hover:bg-muted"
              >
                <AlignCenter className="size-4" />
              </button>
              <button
                type="button"
                title="Align Right"
                onClick={() => applyFormatting("justifyRight", '<p class="text-right">', "</p>")}
                className="rounded-md p-1.5 hover:bg-muted"
              >
                <AlignRight className="size-4" />
              </button>
              <button
                type="button"
                title="Justify"
                onClick={() => applyFormatting("justifyFull", '<p class="text-justify">', "</p>")}
                className="rounded-md p-1.5 hover:bg-muted"
              >
                <AlignJustify className="size-4" />
              </button>

              <div className="mx-1 h-5 w-px bg-border/60" />

              {/* Link */}
              <button
                type="button"
                title="Insert link"
                onClick={() => {
                  const sel = typeof window !== "undefined" ? window.getSelection() : null;
                  const savedRange =
                    sel && sel.rangeCount > 0 ? sel.getRangeAt(0).cloneRange() : null;
                  const url = prompt("Enter hyperlink URL (e.g. https://... or /services):");
                  if (url) {
                    if (editorMode === "visual") {
                      if (savedRange && sel) {
                        sel.removeAllRanges();
                        sel.addRange(savedRange);
                      }
                      applyFormatting("createLink", "", "", url);
                    } else {
                      insertTagInTextarea(
                        `<a href="${url}" class="text-sky-400 underline">`,
                        "</a>"
                      );
                    }
                  }
                }}
                className="rounded-md p-1.5 hover:bg-muted"
              >
                <LinkIcon className="size-4" />
              </button>

              {/* Remove Formatting */}
              <button
                type="button"
                title="Clear Formatting"
                onClick={() => applyFormatting("removeFormat", "", "")}
                className="rounded-md p-1.5 hover:bg-muted"
              >
                <RemoveFormatting className="size-4" />
              </button>

              <div className="mx-1 h-5 w-px bg-border/60" />

              {/* Undo / Redo */}
              <button
                type="button"
                title="Undo"
                onClick={() => applyFormatting("undo", "", "")}
                className="rounded-md p-1.5 hover:bg-muted"
              >
                <Undo2 className="size-4" />
              </button>
              <button
                type="button"
                title="Redo"
                onClick={() => applyFormatting("redo", "", "")}
                className="rounded-md p-1.5 hover:bg-muted"
              >
                <Redo2 className="size-4" />
              </button>
            </div>

            {/* Editor Canvas: Visual (WYSIWYG) vs Text (HTML Code) */}
            <div className="p-4">
              {editorMode === "text" ? (
                <textarea
                  ref={textareaRef}
                  rows={22}
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                    updateWordCountAndReadTime(e.target.value);
                  }}
                  placeholder="Enter raw HTML code here (with <h2>, <p>, <ul>, <figure>, etc)..."
                  className="min-h-[460px] w-full rounded-xl border border-border/40 bg-muted/20 p-4 font-mono text-xs leading-relaxed text-foreground focus:border-primary focus:outline-hidden"
                />
              ) : (
                <div
                  ref={visualEditorRef}
                  contentEditable
                  suppressContentEditableWarning
                  onInput={handleVisualInput}
                  data-placeholder="Click here and start composing visually..."
                  className="blog-content prose prose-slate dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-h2:mt-8 prose-h2:mb-3 prose-h2:text-2xl prose-h3:mt-6 prose-h3:mb-2 prose-h3:text-xl prose-p:mb-4 prose-p:leading-relaxed prose-ul:my-4 prose-li:my-1 prose-blockquote:rounded-r-xl prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-muted/30 prose-blockquote:p-4 prose-blockquote:italic max-h-[750px] min-h-[460px] max-w-none overflow-y-auto rounded-xl border border-border/40 bg-background p-6 font-sans text-sm leading-relaxed text-foreground empty:before:pointer-events-none empty:before:text-muted-foreground empty:before:content-[attr(data-placeholder)] focus:border-primary focus:outline-hidden [&_.align-center]:mx-auto [&_.align-center]:my-6 [&_.align-center]:block [&_.align-left]:float-left [&_.align-left]:mr-6 [&_.align-left]:mb-4 [&_.align-right]:float-right [&_.align-right]:mr-6 [&_.align-right]:mb-4 [&_.size-full]:w-full [&_.size-medium]:max-w-[480px] [&_.size-thumb]:max-w-[240px] [&_img]:rounded-2xl [&_img]:border [&_img]:border-white/10 [&_img]:shadow-xl"
                />
              )}
            </div>

            {/* Editor Footer Bar */}
            <div className="flex items-center justify-between border-t border-border/60 bg-muted/20 px-4 py-2 text-[11px] text-muted-foreground">
              <span>
                Word count:{" "}
                {content
                  ? content
                      .replace(/<[^>]*>/g, " ")
                      .trim()
                      .split(/\s+/)
                      .filter(Boolean).length
                  : 0}{" "}
                words
              </span>
              <span>Estimated: {readTime}</span>
            </div>
          </div>

          {/* Excerpt Box */}
          <div className="space-y-2 rounded-2xl border border-border/60 bg-card p-5 shadow-xs">
            <label className="flex items-center justify-between text-xs font-bold text-foreground">
              <span>Short Excerpt (Displayed on Cards & Search) *</span>
              <span className="text-[11px] font-normal text-muted-foreground">
                {excerpt.length} characters
              </span>
            </label>
            <textarea
              rows={3}
              placeholder="A brief 2–3 sentence summary of the article..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full rounded-xl border border-border/40 bg-muted/20 p-3 text-xs leading-relaxed focus:border-primary focus:outline-hidden"
            />
          </div>

          {/* SEO Settings & Google SERP Simulator */}
          <div className="space-y-5 rounded-2xl border border-border/60 bg-card p-6 shadow-xs">
            <div className="flex items-center gap-2 border-b border-border/40 pb-3">
              <Search className="size-4 text-primary" />
              <h3 className="text-sm font-bold">SEO Meta Settings & Google Search Simulator</h3>
            </div>

            {/* Google SERP Live Simulation Card */}
            <div className="space-y-1 rounded-xl border border-border/60 bg-background p-4 font-sans shadow-2xs">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="flex size-4 items-center justify-center rounded-full bg-primary/20 text-[9px] font-bold text-primary">
                  J
                </span>
                <span className="text-[11px]">jubucleaning.com › blog › {slug || "your-slug"}</span>
              </div>
              <h4 className="cursor-pointer truncate text-base font-medium text-sky-500 hover:underline">
                {metaTitle || title || "Article Title Preview - JUBU Cleaning Dubai"}
              </h4>
              <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                {metaDescription ||
                  excerpt ||
                  "Your meta description preview will appear here on Google search results."}
              </p>
            </div>

            {/* Meta Title */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label className="font-medium text-foreground">SEO Meta Title</label>
                <span
                  className={`text-[11px] ${metaTitle.length > 60 ? "font-bold text-amber-500" : "text-muted-foreground"}`}
                >
                  {metaTitle.length}/60 characters
                </span>
              </div>
              <input
                type="text"
                placeholder={title || "SEO Title..."}
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                className="w-full rounded-xl border border-border/40 bg-muted/20 px-3.5 py-2.5 text-xs focus:border-primary focus:outline-hidden"
              />
            </div>

            {/* Meta Description */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label className="font-medium text-foreground">SEO Meta Description</label>
                <span
                  className={`text-[11px] ${metaDescription.length > 160 ? "font-bold text-amber-500" : "text-muted-foreground"}`}
                >
                  {metaDescription.length}/160 characters
                </span>
              </div>
              <textarea
                rows={2}
                placeholder={excerpt || "SEO description..."}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                className="w-full rounded-xl border border-border/40 bg-muted/20 p-3 text-xs focus:border-primary focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Right Sidebar Column (Meta Boxes - 4 cols) */}
        <div className="space-y-6 lg:col-span-4">
          {/* 1. Publish Box (WordPress Style) */}
          <div className="space-y-4 rounded-2xl border border-border/60 bg-card p-5 shadow-xs">
            <h3 className="flex items-center justify-between border-b border-border/40 pb-3 text-sm font-bold">
              <span>Publish Status</span>
              <FileText className="size-4 text-muted-foreground" />
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status:</span>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as PostStatus)}
                  className="rounded-lg border border-border/60 bg-muted/40 px-2.5 py-1 text-xs font-semibold focus:outline-hidden"
                >
                  <option value="PUBLISHED">Published</option>
                  <option value="DRAFT">Draft</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Estimated Read:</span>
                <input
                  type="text"
                  value={readTime}
                  onChange={(e) => setReadTime(e.target.value)}
                  className="w-24 rounded-lg border border-border/60 bg-muted/40 px-2 py-0.5 text-right text-xs font-semibold"
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 border-t border-border/40 pt-3">
              {!isNew && (
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={handleDelete}
                  className="flex items-center gap-1 text-xs text-destructive hover:underline"
                >
                  <Trash2 className="size-3.5" />
                  <span>Delete</span>
                </button>
              )}

              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleSave()}
                className="ml-auto flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow-xs transition-all hover:bg-primary/90"
              >
                {isSubmitting ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Save className="size-3.5" />
                )}
                <span>{status === "PUBLISHED" ? "Publish / Update" : "Save Draft"}</span>
              </button>
            </div>
          </div>

          {/* 2. Featured Image (Thumbnail) */}
          <div className="space-y-4 rounded-2xl border border-border/60 bg-card p-5 shadow-xs">
            <h3 className="border-b border-border/40 pb-3 text-sm font-bold">
              Featured Image (Thumbnail)
            </h3>

            {coverImage ? (
              <div className="space-y-3">
                <div className="relative h-44 w-full overflow-hidden rounded-xl border border-border/60 bg-slate-900">
                  <Image
                    src={getPublicImageUrl(coverImage, "/images/placeholder/gallery-home.png")}
                    alt={coverImageAlt}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-muted-foreground">
                    Thumbnail Alt Text (SEO)
                  </label>
                  <input
                    type="text"
                    value={coverImageAlt}
                    onChange={(e) => setCoverImageAlt(e.target.value)}
                    placeholder="Describe image for Google Images..."
                    className="w-full rounded-lg border border-border/40 bg-muted/20 px-3 py-1.5 text-xs focus:border-primary focus:outline-hidden"
                  />
                </div>
              </div>
            ) : null}

            <div className="pt-2">
              <ImageCropUploader
                label="Upload / Change Featured Image"
                currentImageUrl={coverImage}
                folder="blog"
                aspectRatio={16 / 9}
                onUploadComplete={(url) => {
                  setCoverImage(url);
                  toast.success("Featured image uploaded!");
                }}
              />
            </div>
          </div>

          {/* 3. Category Selector */}
          <div className="space-y-3 rounded-2xl border border-border/60 bg-card p-5 shadow-xs">
            <h3 className="border-b border-border/40 pb-3 text-sm font-bold">Category</h3>
            <div className="space-y-2">
              {DEFAULT_CATEGORIES.map((cat) => (
                <label
                  key={cat}
                  className="flex cursor-pointer items-center gap-2.5 text-xs text-foreground transition-colors hover:text-primary"
                >
                  <input
                    type="radio"
                    name="category"
                    value={cat}
                    checked={category === cat}
                    onChange={(e) => setCategory(e.target.value)}
                    className="accent-primary"
                  />
                  <span>{cat}</span>
                </label>
              ))}

              <label className="flex cursor-pointer items-center gap-2.5 pt-1 text-xs text-foreground">
                <input
                  type="radio"
                  name="category"
                  value="Custom"
                  checked={!DEFAULT_CATEGORIES.includes(category)}
                  onChange={() => setCategory("Custom")}
                  className="accent-primary"
                />
                <span>Custom Category</span>
              </label>

              {!DEFAULT_CATEGORIES.includes(category) && (
                <input
                  type="text"
                  placeholder="Enter category name..."
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-border/40 bg-muted/20 px-3 py-1.5 text-xs focus:border-primary focus:outline-hidden"
                />
              )}
            </div>
          </div>

          {/* 4. Tags Manager */}
          <div className="space-y-3 rounded-2xl border border-border/60 bg-card p-5 shadow-xs">
            <h3 className="border-b border-border/40 pb-3 text-sm font-bold">Tags (Keywords)</h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add tag and press Enter..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                className="w-full rounded-lg border border-border/40 bg-muted/20 px-3 py-1.5 text-xs focus:border-primary focus:outline-hidden"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="rounded-lg bg-muted px-3 py-1.5 text-xs font-bold transition-colors hover:bg-muted/80"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                >
                  <span>#{t}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(t)}
                    className="hover:text-foreground"
                  >
                    <X className="size-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* 5. Author Information */}
          <div className="space-y-3 rounded-2xl border border-border/60 bg-card p-5 shadow-xs">
            <h3 className="border-b border-border/40 pb-3 text-sm font-bold">Author Details</h3>
            <div className="space-y-2 text-xs">
              <div>
                <label className="mb-1 block text-[11px] font-semibold text-muted-foreground">
                  Author Name
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full rounded-lg border border-border/40 bg-muted/20 px-3 py-1.5 text-xs focus:border-primary focus:outline-hidden"
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-semibold text-muted-foreground">
                  Author Role
                </label>
                <input
                  type="text"
                  value={authorRole}
                  onChange={(e) => setAuthorRole(e.target.value)}
                  className="w-full rounded-lg border border-border/40 bg-muted/20 px-3 py-1.5 text-xs focus:border-primary focus:outline-hidden"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* In-Post Media Modal */}
      {isMediaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg animate-in space-y-5 rounded-2xl border border-border bg-card p-6 shadow-2xl zoom-in-95 fade-in">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="flex items-center gap-2 text-base font-bold text-foreground">
                <ImageIcon className="size-5 text-emerald-500" />
                <span>Embed Media into Article</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsMediaModalOpen(false)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Media Uploader */}
            <div className="space-y-4 text-xs">
              <ImageCropUploader
                label="Upload or Select Post Image"
                currentImageUrl={mediaImageUrl}
                folder="blog"
                onUploadComplete={(url) => setMediaImageUrl(url)}
              />

              {/* Alt Text (Mandatory for SEO) */}
              <div className="space-y-1">
                <label className="font-bold text-foreground">
                  Image Alt Text (SEO Description) *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Steam cleaning machine operating on Dubai living room rug..."
                  value={mediaAlt}
                  onChange={(e) => setMediaAlt(e.target.value)}
                  className="w-full rounded-lg border border-border/40 bg-muted/20 px-3 py-2 text-xs focus:border-primary focus:outline-hidden"
                />
              </div>

              {/* Caption */}
              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">
                  Image Caption (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Caption displayed below the image..."
                  value={mediaCaption}
                  onChange={(e) => setMediaCaption(e.target.value)}
                  className="w-full rounded-lg border border-border/40 bg-muted/20 px-3 py-2 text-xs focus:border-primary focus:outline-hidden"
                />
              </div>

              {/* In-Post Image Size Control */}
              <div className="space-y-1.5">
                <label className="font-bold text-foreground">Display Size in Article</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setMediaSize("thumb")}
                    className={`rounded-xl border p-2 text-center text-xs font-bold transition-all ${
                      mediaSize === "thumb"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border/60 text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    Thumbnail (240px)
                  </button>
                  <button
                    type="button"
                    onClick={() => setMediaSize("medium")}
                    className={`rounded-xl border p-2 text-center text-xs font-bold transition-all ${
                      mediaSize === "medium"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border/60 text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    Medium (480px)
                  </button>
                  <button
                    type="button"
                    onClick={() => setMediaSize("full")}
                    className={`rounded-xl border p-2 text-center text-xs font-bold transition-all ${
                      mediaSize === "full"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border/60 text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    Full Width (100%)
                  </button>
                </div>
              </div>

              {/* Alignment Control */}
              <div className="space-y-1.5">
                <label className="font-bold text-foreground">Alignment</label>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setMediaAlign("left")}
                    className={`flex items-center justify-center gap-1 rounded-xl border p-2 text-center text-xs font-medium ${
                      mediaAlign === "left"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border/60 text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <AlignLeft className="size-3.5" />
                    <span>Left</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMediaAlign("center")}
                    className={`flex items-center justify-center gap-1 rounded-xl border p-2 text-center text-xs font-medium ${
                      mediaAlign === "center"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border/60 text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <AlignCenter className="size-3.5" />
                    <span>Center</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMediaAlign("right")}
                    className={`flex items-center justify-center gap-1 rounded-xl border p-2 text-center text-xs font-medium ${
                      mediaAlign === "right"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border/60 text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <AlignRight className="size-3.5" />
                    <span>Right</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMediaAlign("none")}
                    className={`flex items-center justify-center gap-1 rounded-xl border p-2 text-center text-xs font-medium ${
                      mediaAlign === "none"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border/60 text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <span>None</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-2.5 border-t border-border pt-3">
              <button
                type="button"
                onClick={() => setIsMediaModalOpen(false)}
                className="rounded-xl border border-border px-4 py-2 text-xs font-semibold hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInsertMedia}
                className="rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90"
              >
                Insert into Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
