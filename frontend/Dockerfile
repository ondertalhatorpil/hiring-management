FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
ENV REACT_APP_API_URL=https://test.layusoft.com
ENV NODE_ENV=production
RUN npm install
COPY . .
RUN npm run build

FROM nginx:latest as production
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
