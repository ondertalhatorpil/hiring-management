FROM node:18 as build

WORKDIR /app
COPY package*.json ./
RUN npm install --save-dev @babel/plugin-proposal-private-property-in-object
RUN npm install
ENV REACT_APP_API_URL=https://kariyer.onder.org.tr
ENV NODE_ENV=production
COPY . .

RUN npm run build


FROM nginx:latest as production
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]