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
FROM submodulesetup as build
RUN yarn install
RUN yarn build
RUN yarn prisma migrate deploy
FROM build as run
EXPOSE 3000
CMD [ "yarn", "start" ]