# build environment
FROM node:alpine AS builder

ARG user="node"
ARG appdir="/home/node/app"

RUN mkdir -p ${appdir} && chown -R ${user} ${appdir}
WORKDIR ${appdir}
USER ${user}

COPY --chown=${user} package.json package-lock.json ./
RUN npm install

COPY --chown=${user} . .

RUN npm run build

# production environment
FROM nginx:1.15-alpine

COPY --from=builder /home/node/app/build /usr/share/nginx/html

EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]