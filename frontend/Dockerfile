
FROM node:12.18.4

ENV NPM_CONFIG_LOGLEVEL warm

ARG app_env

ENV APP_ENV $app_env

RUN mkdir -p /its_frontend

WORKDIR /its_frontend

COPY ./its-app /its_frontend

# RUN npm install

EXPOSE 3000

CMD ["npm", "start"]





# FROM node:12.18.4

# ENV NPM_CONFIG_LOGLEVEL warm

# ARG app_env

# ENV APP_ENV $app_env

# RUN mkdir -p /my_app

# WORKDIR /my_app

# COPY ./its-app ./

# RUN npm install

# EXPOSE 3000

# CMD ["npm", "start"]

