# Introduction

A headless CMS for hosting your own teaching courses. Features include course authoring, students management, media management and website customisation. [Learn more](https://courselit.recurze.com/).

## Getting started

Easily spin up a new CourseLit headless server using the following command.

```sh
docker run --env USER_CONTENT_DIRECTORY=<directory_of_your_choice> --env JWT_SECRET=<string_of_your_choice> recurze/courselit-backend
```

The above command assumes that you have a MongoDB server running on your local machine. If that is not the case, specify the DB_CONNECTION_STRING environment as well.

### Environment variables

**USER_CONTENT_DIRECTORY**

The CourseLit server needs a place to store user created content like media uploads. You can specify that location by setting this environment variable. Required parameter. No default value.

**JWT_SECRET**

A random string to use as a secret to sign the JWT tokens the API generates. Required parameter. No default value.

**DB_CONNECTION_STRING**

The connection string to a remote mongodb instance. Defaults to `mongodb://localhost/app`.

**PORT**

The port to run the server on. Defaults to `80`.

**API_PREFIX**

This will make the server available at `/<API_PREFIX>` path. Defaults to `/api`.

**JWT_EXPIRES_IN**

The duration after while the generated JWT expires. For more information click [this](https://www.npmjs.com/package/jsonwebtoken) link. Defaults to `1d`.


## Support
Come chat with us in our official [Spectrum chat](https://spectrum.chat/courselit/general).