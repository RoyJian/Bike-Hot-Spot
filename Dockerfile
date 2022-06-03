FROM node:lts-alpine
COPY ./ /workspace
WORKDIR /workspace
RUN yarn install --production=true \ 
    && yarn global add ts-node
EXPOSE 4000