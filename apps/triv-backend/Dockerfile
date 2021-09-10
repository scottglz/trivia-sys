FROM mhart/alpine-node:14
WORKDIR /app
COPY ./dist/apps/triv-backend .
ENV PORT=3333
EXPOSE ${PORT}
RUN npm install --production
CMD node ./main.js