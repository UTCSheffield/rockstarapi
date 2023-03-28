FROM node:18
WORKDIR /app
RUN apt install git -y
COPY package*.json ./
COPY yarn.lock ./
COPY .* ./
COPY . .
RUN rm .gitmodules
RUN rm -rf rockstar
RUN git init
RUN git submodule add https://github.com/UTCSheffield/rockstar.git
RUN git submodule update --init --recursive
RUN yarn install
RUN yarn build
EXPOSE 3000
CMD [ "yarn", "start" ]