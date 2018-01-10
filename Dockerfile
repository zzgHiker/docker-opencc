FROM node

RUN mkdir -p /home/Service
WORKDIR /home/Service

COPY . /home/Service
RUN npm install

EXPOSE 8888
CMD ["npm", "start"]
