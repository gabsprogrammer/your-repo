#!/bin/bash

# Troubleshooting Script for SSL Certificate Issues
# This script helps diagnose and resolve common SSL certificate issues with Certbot and Nginx.

echo "Starting SSL troubleshooting..."

# Step 1: Verify Nginx is running and accessible
echo "Checking Nginx status..."
sudo systemctl status nginx --no-pager

# Step 2: Verify domain resolution
echo "Checking domain resolution..."
nslookup madureiraseguros.com.br

# Step 3: Verify Nginx configuration
echo "Testing Nginx configuration..."
sudo nginx -t

# Step 4: Check if the domain is accessible via HTTP
echo "Testing HTTP access to the domain..."
curl -I http://madureiraseguros.com.br

# Step 5: Check firewall settings
echo "Checking firewall status..."
sudo ufw status

# Step 6: Open necessary ports if firewall is active
echo "Opening ports 80 and 443..."
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw reload

# Step 7: Restart Nginx
echo "Restarting Nginx..."
sudo systemctl restart nginx

# Step 8: Run Certbot with verbose output
echo "Running Certbot with verbose output..."
sudo certbot --nginx -d madureiraseguros.com.br -v

# Step 9: Check Certbot logs for detailed errors
echo "Checking Certbot logs..."
sudo tail -n 50 /var/log/letsencrypt/letsencrypt.log

echo "Troubleshooting completed. Review the output for any issues."