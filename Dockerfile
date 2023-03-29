FROM node:18 as InitialSetup
WORKDIR /app
RUN apt install git -y
COPY package*.json ./
COPY yarn.lock ./
COPY .* ./
COPY . .
FROM InitialSetup as SubmoduleSetup
RUN rm .gitmodules
RUN rm -rf rockstar
RUN git init
RUN git submodule add https://github.com/UTCSheffield/rockstar.git
RUN git submodule update --init --recursive
FROM SubmoduleSetup as Build
RUN yarn install
RUN yarn build
FROM Build as Run
EXPOSE 3000
CMD [ "yarn", "start" ]