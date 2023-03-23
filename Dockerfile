FROM node:18
WORKDIR /app
COPY package*.json ./
COPY yarn.lock ./
COPY .git .git
COPY . .
RUN yarn install
RUN git submodule update --init --recursive
RUN yarn build
EXPOSE 3000
CMD [ "yarn", "start" ]