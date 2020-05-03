# Introduction

A Material UI based front-end app for the CourseLit Headless CMS.

## Docker

Easily spin up a new courselit-frontend server using the following command

```
docker run codelit/courselit-frontend
```

### Environment variables

**SITE_URL**

The public address of the site. Defaults to none.

**API_PREFIX**

The path where the API is located on the server. Defaults to `/api`.

**SSR_SITE_URL**

The server address to resolve `getInitialProps` calls for server side rendering. Defaults to none.
