FROM node:latest

# Create app directory
RUN mkdir -p /api-services
WORKDIR /api-services

# Install app dependencies
COPY package.json /api-services
RUN npm install

# Bundle app source
COPY . /api-services

EXPOSE 3000
CMD [ "npm", "start" ]
