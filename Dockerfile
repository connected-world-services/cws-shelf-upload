# This Dockerfile builds on the official node alpine container.

# This produces a docker image that contains a working copy of cws-shelf-upload
# which will run as the default command. If you wish to run a shell /bin/sh
# is available.

FROM node:alpine

RUN npm install -g cws-shelf-upload

CMD ["cws-shelf-upload"]
