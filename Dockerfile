FROM node:11.11 as builder

# required for running tests in the future
#RUN echo 'deb http://dl.google.com/linux/chrome/deb/ stable main' > /etc/apt/sources.list.d/chrome.list && \
#    wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - && \
#    apt-get update && \
#    apt-get install -y bzip2 google-chrome-stable && \
RUN apt-get update && \
    apt-get install -y bzip2 yarn && \
    rm -rf /var/lib/apt/lists/*

# ENV CHROME_BIN /usr/bin/google-chrome

ADD . /app

WORKDIR /app
RUN yarn install
RUN yarn run build

ENTRYPOINT ["npm"]


FROM nginx

WORKDIR /var/www/

ADD scripts/nginx.conf /etc/nginx/nginx.conf
ADD scripts /scripts

COPY --from=builder /app/build /var/www/
COPY --from=builder /app/_assets/style-guide/src/static/html/maintenance.html /var/www/

ENTRYPOINT ["/scripts/entrypoint.sh"]
