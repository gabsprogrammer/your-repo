#!/bin/bash

# Deployment Script for Madureira Seguros VPS
# This script automates the setup and deployment of the Madureira Seguros project on an Ubuntu VPS.

# Exit immediately if any command fails
echo "Starting deployment..."

# Update and upgrade the system
echo "Updating system..."
sudo apt update && sudo apt upgrade -y

# Install Node.js and npm
echo "Installing Node.js and npm..."
sudo apt install -y curl git nodejs npm

# Install PM2 globally
echo "Installing PM2..."
sudo npm install -g pm2

# Clone the project (replace with your actual repository URL)
echo "Cloning the project..."
git clone https://github.com/your-repo/madureira_seguros.git
cd madureira_seguros

# Install project dependencies
echo "Installing project dependencies..."
npm install

# Build the project
echo "Building the project..."
npm run build

# Install Nginx
echo "Installing Nginx..."
sudo apt install -y nginx

# Configure Nginx for the domain
echo "Configuring Nginx..."
sudo rm /etc/nginx/sites-enabled/default

# Create Nginx configuration file
sudo bash -c 'cat > /etc/nginx/sites-available/madureira_seguros.conf << "EOF"
server {
    listen 80;
    server_name madureiraseguros.com.br;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF'

# Enable the Nginx configuration
sudo ln -s /etc/nginx/sites-available/madureira_seguros.conf /etc/nginx/sites-enabled/

# Test Nginx configuration
echo "Testing Nginx configuration..."
sudo nginx -t

# Restart Nginx
echo "Restarting Nginx..."
sudo systemctl restart nginx

# Start the WhatsApp API server in the background using PM2
echo "Starting WhatsApp API server..."
pm2 start "npm run dev:server" --name "whatsapp-api"

# Start the main application using PM2
echo "Starting the main application..."
pm2 start "npm run start" --name "madureira-seguros"

# Save PM2 processes
echo "Saving PM2 processes..."
pm2 save

# Set up PM2 to start on boot
echo "Setting up PM2 to start on boot..."
pm2 startup

# Install Certbot for SSL certificates
echo "Installing Certbot..."
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate
echo "Obtaining SSL certificate..."
sudo certbot --nginx -d madureiraseguros.com.br

# Auto-renew SSL certificate
echo "Setting up SSL certificate auto-renewal..."
sudo certbot renew --dry-run

echo "Deployment completed successfully!"
echo "Your application should now be accessible at https://yourdomain.com.br"