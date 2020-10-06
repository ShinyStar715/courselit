<p align="center">
  <img src="./assets/banner.png">
</p>

<p align="center">
  <b>
    <a href="https://courselit.codelit.dev">Website</a> |
    <a href="https://codelit.gitbook.io/courselit/getting-started">Getting started</a> |
    <a href="https://codelit.gitbook.io/courselit">Documentation</a>
  </b>
</p>

<p align="center">
  <a href="https://github.com/codelitdev/courselit/actions">
    <img src="https://badgen.net/github/status/codelitdev/courselit" alt="Status">
  </a>
  <a href="https://discord.gg/GR4bQsN">
    <img src="https://img.shields.io/badge/chat-discord-blue" alt="Chat">
  </a>
  <a href="https://hub.docker.com/r/codelit/courselit-proxy">
    <img src="https://badgen.net/docker/pulls/codelit/courselit-proxy" alt="Downloads">
  </a>
  <a href="https://github.com/codelitdev/courselit">
    <img src="https://badgen.net/github/last-commit/codelitdev/courselit" alt="Last commit">
  </a>
  <a href="https://lgtm.com/projects/g/codelitdev/courselit/alerts/">
    <img src="https://img.shields.io/lgtm/alerts/g/codelitdev/courselit.svg?logo=lgtm&logoWidth=18" alt="Lgtm">
  </a>
  <a href="https://github.com/codelitdev/courselit/blob/deployment/LICENSE">
    <img src="https://badgen.net/github/license/codelitdev/courselit" alt="License">
  </a>
</p>

# Introduction
CourseLit is a content management system (aka CMS) for starting your own online course website. It is designed keeping educators in mind. Consider it an open-source alternative to those paid tutoring sites.

It comes pre-equipped with all the basic tools you'd require to efficiently run and administer your online teaching business. Features include course authoring, student management, payment processing (via Stripe), website customization and analytics (very limited as of now).

Check out this live example to see what you can build with CourseLit. [Click here](https://codelit.dev).

## Screenshot

![courselit cms screenshot](./assets/screenshot.png)

## Getting Started
To install CourseLit on your cloud server, please follow [our official guide](https://codelit.gitbook.io/courselit/getting-started).

## Running on local
You can run a local instance of CourseLit on your local machine via [Docker Compose](https://docs.docker.com/compose/). Follow the below mentioned instructions.

1. Cd to the `deployment` folder.
```
cd courselit/deployment
```

2. Create a `.env` file in this directory with the following variables and change the values as per your environment.
```
SITE_URL=http://localhost
MEDIA_FOLDER=~/courselit
MONGO_ROOT_USERNAME=username
MONGO_ROOT_PASSWORD=password
DB_CONNECTION_STRING=mongodb://username:password@db
JWT_SECRET=yoursecret
JWT_EXPIRES_IN=2d
TAG=latest
```

3. Start the application.

```
docker-compose -f docker-compose.yml up
```

4. Visit `http://localhost` in your browser.

### Environment variables.
**SITE_URL**

The public address of the site. Required parameter. No default value.

**MEDIA_FOLDER**

A folder on your host machine while will be mounted as a volume to all the containers. It is required for storing database files, user uploaded files, ssl certificates and everything else. Required parameter. No default value.

**MONGO_ROOT_USERNAME, MONGO_ROOT_PASSWORD**

These are required for correctly initializing an admin user in the mongo db instance running inside the container named `db`. Read more about these [here](https://hub.docker.com/_/mongo).

**DB_CONNECTION_STRING**

The connection string to a mongodb instance running in the `db` container. Required parameter. The value should be `mongodb://<MONGO_ROOT_USERNAME>:<MONGO_ROOT_PASSWORD>@db` where `MONGO_ROOT_USERNAME` and `MONGO_ROOT_PASSWORD` are the same variables defined above.

**JWT_SECRET**

A random string to use as a secret to sign the JWT tokens the API generates. Required parameter. No default value.

**JWT_EXPIRES_IN**

The duration after while the generated JWT expires. For more information [check out here](https://www.npmjs.com/package/jsonwebtoken). Optional parameter. Defaults to `1d`.

**DOMAIN**

The domain name for which the ssl certificate is issued. Optional parameter, only required if using a SSL certificate. No default value.

**TAG**

The Docker tag. To see what all tags are available, visit [CourseLit on Docker Hub](https://hub.docker.com/repository/registry-1.docker.io/codelit/courselit-proxy/tags).

## Development
The project is organised as a [mono-repo](https://en.wikipedia.org/wiki/Monorepo). It uses [Lerna](https://github.com/lerna/lerna) for managing the mono-repo. You need to run both backend and frontend servers, located in `packages/api` and `packages/app` respectively, in order to run the portal in its entirety.

We recommend using [Visual Studio Code](https://code.visualstudio.com/) for development as it allows you to develop your code in isolation inside a container using the [Remote - Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension. Install both the editor and the extension.

Once you have this setup, follow these steps.

1. Press `Ctrl + Shift + P` to open the command palette of Visual Studio Code, type in "Remote-Containers: Open Workspace in Container" and press enter after selecting it.

2. Once the code opens up, open two terminal windows in your Visual Studio Code and type in the following commands to start the backend and frontend servers respectively.
  - `yarn lerna run dev --scope=@courselit/api --stream`
  - `yarn lerna run dev --scope=@courselit/app --stream`
  
  > The above commands are also exported as `bash` aliases, so you can simply type `api` and `app` in separate terminal windows to run backend and frontend servers respectively.

## Writing Your Own Widget
You can add additional functionality to your application via building your own widgets. Look at [this](widgets.md) document.

## Security
Although, we've done everything in our power to secure the application by following the best practices, we hope you understand that no one can guarantee that it's the most secure implementation out there and it will always stay secure.

Please audit the environment files, docker-compose files and other configurations properly as per your company's security standards. If you've discovered a security vulnerability, consider fixing the issue and submitting a PR.

Use the application at your own risk. People who have worked on this project will not be responsible for any sort of damage that happens to you by using the application.
