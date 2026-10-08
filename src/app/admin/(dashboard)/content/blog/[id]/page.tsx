import { notFound } from "next/navigation";

import { getBlogPostByIdAction } from "../actions";
import { BlogPostEditor } from "../BlogPostEditor";

interface EditBlogPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBlogPostPage({ params }: EditBlogPostPageProps) {
  const { id } = await params;
  const post = await getBlogPostByIdAction(id);

  if (!post) {
    notFound();
  }

  return <BlogPostEditor initialPost={post} isNew={false} />;
}
