FROM node:0.12.7

# install wine and nsis
RUN dpkg --add-architecture i386 && \
    echo "deb http://httpredir.debian.org/debian jessie-backports main" >> /etc/apt/sources.list && \
    apt-get -y update && \
    apt-get install -y wine nsis && \
    apt-get clean autoclean && \
    apt-get autoremove -y && \
    rm -rf /var/lib/{apt,dpkg,cache,log}

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install
COPY . /usr/src/app

# build all and pack only for Windows
# because is not possible packing for OSX from Linux
CMD ["npm", "run", "build-pack-from-linux"]
