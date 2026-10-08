import { getAllBlogPostsAction } from "./actions";
import { BlogPostsClient } from "./BlogPostsClient";

export default async function AdminBlogPage() {
  const posts = await getAllBlogPostsAction();

  return <BlogPostsClient initialPosts={posts} />;
}
