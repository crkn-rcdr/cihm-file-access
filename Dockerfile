FROM node:7.7-alpine

ENV HOME=/home/node
WORKDIR $HOME/cihm-file-access

RUN  apk add --update git

COPY package.json yarn.lock ./
RUN chown -R node:node .

USER node
RUN yarn install

USER root
COPY . .
RUN chown -R node:node .

USER node
EXPOSE 3000
