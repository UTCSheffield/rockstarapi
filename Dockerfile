ARG DATABASE_URL
FROM node:18 as initialsetup
WORKDIR /app
RUN apt install git -y
COPY package*.json ./
COPY yarn.lock ./
COPY .* ./
COPY . .
FROM initialsetup as submodulesetup
RUN rm .gitmodules
RUN rm -rf rockstar
RUN git init
RUN git submodule add https://github.com/UTCSheffield/rockstar.git
RUN git submodule update --init --recursive
ARG DATABASE_URL
FROM submodulesetup as build
RUN yarn install
RUN yarn pegjs
RUN yarn build
RUN echo DATABASE_URL=$DATABASE_URL > .env
RUN cat .env
RUN yarn prisma migrate deploy
RUN yarn prisma generate
FROM build as run
EXPOSE 3000
CMD [ "yarn", "start" ]