#!/bin/bash

# SSL Setup Script for Madureira Seguros
# This script automates the SSL certificate setup using Certbot.

# Exit immediately if any command fails
echo "Starting SSL setup..."

# Install Certbot and Nginx plugin
echo "Installing Certbot..."
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate
echo "Obtaining SSL certificate..."
sudo certbot --nginx -d madureiraseguros.com.br -d www.madureiraseguros.com.br

# Auto-renew SSL certificate
echo "Setting up SSL certificate auto-renewal..."
sudo certbot renew --dry-run

echo "SSL setup completed successfully!"