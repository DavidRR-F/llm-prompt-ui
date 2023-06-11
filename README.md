# Client Side vs Server Side Rendering

## Client-side rendering (CSR):

Use CSR when you have a dynamic application that relies heavily on client-side interactions, such as complex animations, real-time updates, or interactive forms.
CSR is suitable when search engine optimization (SEO) is not a major concern, or you plan to handle SEO separately using techniques like dynamic rendering or prerendering.
This approach can provide a smoother initial load experience since the page skeleton is rendered quickly and then hydrated with data on the client-side.

### When to use

- Add interactivity and eventListeners
- Use State and Lifecyle Effects
- Use browser-only APIs
- Use React Class Components

**_To use Clinet Side Rendering by adding 'use client' to the top of a component file_**

## Server-side rendering (SSR):

Use SSR when you need to optimize for SEO or want to ensure that your content is accessible to search engine crawlers and social media bots.
SSR is beneficial when you have content that frequently changes or requires data fetching during the initial render, ensuring that the HTML is prepopulated with data before reaching the client.
It's useful for applications that prioritize the time-to-first-byte (TTFB) metric, as SSR can reduce the perceived loading time by delivering a fully rendered page to the user faster.

### When to use

- Fetch data
- Access Backend Resources (directly)
- Keep sensitive information on the server
- keep large dependecies on the server
- Error Components

**_Use Sever Side Rendering until you have a need to use Client Side Rendering_**

More info on rendering [here](https://nextjs.org/docs/app/building-your-application/rendering)

## Routing

### Basic Routing:

Next.js uses a file-based routing system. Each page in your Next.js application is represented by a React component file in the pages directory.
For example, if you have a file named about.js in the pages directory, it will be accessible at the /about route.
The file-based routing system eliminates the need to configure routes manually, and Next.js automatically sets up the routing based on your file structure.

### Dynamic Routing:

Next.js also supports dynamic routing, where you can create dynamic pages with dynamic URLs that depend on the data being passed.
To create a dynamic page, you need to create a React component file with square brackets in the pages directory.
For example, if you create a file named [slug].js in the pages directory, it will match routes like /post/1, /post/hello-world, etc., where the value after /post/ will be available as a parameter called slug in your component.
You can access the dynamic parameter using the useRouter hook provided by Next.js, or by using the getStaticProps or getServerSideProps functions to fetch data based on the dynamic parameter.

### Linking between Pages:

Next.js provides the Link component from the next/link package to enable client-side navigation between pages without a full page reload.
You can wrap any element with the Link component and specify the href attribute to indicate the target page.

More info on routing [here](https://nextjs.org/docs/app/building-your-application/routing)

## File Structure

```
pages/
├── index.js
├── about.js
└── posts/
    ├── [slug].js
    └── create.js
```

index.js: Represents the home page of your application. When a user visits the root URL (/), this file will be rendered.

about.js: Represents the about page of your application. When a user visits the /about URL, this file will be rendered.

posts/: Represents a nested directory for handling posts-related pages.

[slug].js: Represents a dynamic page for displaying a specific post. The slug parameter can be any value and will be accessible within the component. For example, /posts/hello-world will render this page, and you can access the value "hello-world" via the slug parameter.

create.js: Represents a page for creating a new post. When a user visits /posts/create, this file will be rendered.

This file structure demonstrates the basic usage of Next.js pages. Each file corresponds to a specific route in your application, and Next.js automatically sets up the routing based on the file structure. You can further customize the pages and add more functionality based on your specific application requirements.

## Data Fetching

### Server-Side Rendering (SSR):

- SSR is the traditional approach where data is fetched on the server for each request. When a user visits a page, the server fetches the required data and renders the page with the data before sending it to the client.
- Next.js provides two functions, getServerSideProps and getInitialProps, which can be used in SSR. These functions allow you to fetch data on the server and pass it as props to the page component.
- SSR is useful for dynamic pages where the content changes frequently or depends on user-specific data.

#### Example

```
import React from 'react';

const HomePage = ({ serverData }) => {
  return (
    <div>
      <h1>Server-Side Rendering (SSR)</h1>
      <p>Data fetched on the server: {serverData}</p>
    </div>
  );
};

export async function getServerSideProps() {
  // Fetch data on the server
  const res = await fetch('https://api.example.com/data');
  const serverData = await res.json();

  return {
    props: {
      serverData,
    },
  };
}

export default HomePage;
```

### Static Site Generation (SSG):

- SSG pre-renders pages at build time, generating static HTML files that can be served to clients without the need for server-side execution.
- With SSG, data is fetched during the build process and injected into the static HTML files. When a user visits a page, the pre-rendered HTML is served, providing a fast initial load.
- Next.js provides the getStaticProps function to fetch data during the build process. This function is executed at build time and allows you to pass the fetched data as props to the page component.
- SSG is suitable for pages with data that doesn't change frequently and can be generated during the build process.

#### Example

```
import React from 'react';

const AboutPage = ({ staticData }) => {
  return (
    <div>
      <h1>Static Site Generation (SSG)</h1>
      <p>Data fetched during build: {staticData}</p>
    </div>
  );
};

export async function getStaticProps() {
  // Fetch data during build time
  const res = await fetch('https://api.example.com/data');
  const staticData = await res.json();

  return {
    props: {
      staticData,
    },
  };
}

export default AboutPage;
```

### Incremental Static Regeneration (ISR):

- ISR combines the benefits of both SSR and SSG. It allows you to generate static pages at build time, like SSG, but also provides the ability to update them incrementally over time.
- With ISR, you can specify a revalidation period for each page, indicating how frequently the page should be regenerated. During the revalidation period, if a request is made to the page, Next.js serves the existing static page and triggers a background regeneration.
- Next.js provides the getStaticProps function with an additional revalidate option for configuring ISR. You can specify the revalidation period in seconds.
  ISR is useful for pages with data that updates occasionally or requires periodic updates, ensuring a balance between performance and freshness of data.

#### Example

```
import React from 'react';

const PostPage = ({ post }) => {
  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </div>
  );
};

export async function getStaticPaths() {
  // Fetch dynamic paths for posts
  const res = await fetch('https://api.example.com/posts');
  const posts = await res.json();

  const paths = posts.map((post) => ({
    params: { slug: post.slug },
  }));

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  // Fetch data for a specific post
  const res = await fetch(`https://api.example.com/posts/${params.slug}`);
  const post = await res.json();

  return {
    props: {
      post,
    },
    revalidate: 60, // Revalidate this page every 60 seconds (1 minute)
  };
}

export default PostPage;
```
