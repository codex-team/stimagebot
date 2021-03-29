FROM node:15

RUN apt-get update && apt-get install -y libglu1

RUN rm /etc/localtime
RUN ln -s /usr/share/zoneinfo/Europe/Moscow /etc/localtime
