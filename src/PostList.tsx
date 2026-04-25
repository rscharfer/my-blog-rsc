import * as React from "react";
import { type ProcessedFiles } from "./Index";

export default function PostList({ posts }: { posts: ProcessedFiles }) {
  return (
    <div>
      {posts &&
        posts.map((post) => (
          <div key={post.slug} className="entry">
            <a
              style={{
                textDecoration: "none",
                display: "flex",
                flexDirection: "column",
              }}
              href={`/post/${post.slug}`}
            >
              <div className="title">{post.frontmatter.title}</div>
              <div className="date">{post.frontmatter.published}</div>
              <div className="subtitle">
                {post.frontmatter.subtitle.replace("{:}", ":")}
              </div>
            </a>
          </div>
        ))}
    </div>
  );
}
