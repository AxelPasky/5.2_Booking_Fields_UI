# Stage 1: Build the React application
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# La variabile VITE_API_URL verrà passata al momento della build da Docker Compose
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:stable-alpine
# Copia i file statici buildati dalla fase precedente
COPY --from=build /app/dist /usr/share/nginx/html
# Rimuovi la configurazione di default di Nginx
RUN rm /etc/nginx/conf.d/default.conf
# Copia la nostra configurazione custom per Nginx
COPY nginx.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]