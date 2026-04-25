import * as React from "react";
import Layout from "./Layout";
import PostList from "./PostList";

export interface FrontMatter {
  title: string;
  published: string;
  subtitle: string;
}

export interface ProcessedFile {
  frontmatter: FrontMatter;
  markdownBody: string;
  slug: string;
  tags: Array<string>;
}

export type ProcessedFiles = Array<ProcessedFile>;

const Index = ({ posts }: { posts: ProcessedFiles }) => {
  const postsByYear = new Map();
  for (let post of posts) {
    if (post.frontmatter.published.match(/\d{4}$/) === null) {
      throw Error(
        "published value must end with four digits representing the year",
      );
    }
    const postYear = post.frontmatter.published.match(/\d{4}$/)![0];
    const yearsPosts = postsByYear.get(postYear);
    postsByYear.set(postYear, yearsPosts ? [...yearsPosts, post] : [post]);
  }

  //

  return (
    <Layout>
      <main>
        {Array.from(postsByYear).map(([year, posts]) => {
          return <PostList key={year} posts={posts} />;
        })}
      </main>
    </Layout>
  );
};

export default Index;
