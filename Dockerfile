FROM node:0.12.7

# install wine and nsis
RUN dpkg --add-architecture i386 && \
    apt-get update && \
    echo "deb http://httpredir.debian.org/debian jessie-backports main" >> /etc/apt/sources.list && \
    apt-get -y update && \
    apt-get install -y wine nsis

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install
COPY . /usr/src/app

CMD ["npm", "run", "build-pack"]
