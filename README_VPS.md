# Madureira Seguros VPS Deployment Guide

This guide provides step-by-step instructions to deploy the Madureira Seguros project on an Ubuntu VPS and configure it with your `.com.br` domain.

## Prerequisites
- Ubuntu VPS
- Domain name (e.g., `yourdomain.com.br`)
- SSH access to the VPS

## Step 1: SSH into Your VPS
```bash
ssh root@your_vps_ip
```

## Step 2: Run the Deployment Script
1. Upload the `deploy_vps.sh` script to your VPS.
2. Make it executable:
   ```bash
   chmod +x deploy_vps.sh
   ```
3. Run the script:
   ```bash
   ./deploy_vps.sh
   ```

## Step 3: Configure Your Domain
1. Point your domain to the VPS IP address (`129.146.4.174`) by updating the DNS records.
2. The domain `madureiraseguros.com.br` is already configured in the `nginx_config.conf` file.

## Step 4: Set Up SSL Certificates
1. Upload the `ssl_setup.sh` script to your VPS.
2. Make it executable:
   ```bash
   chmod +x ssl_setup.sh
   ```
3. Run the script:
   ```bash
   ./ssl_setup.sh
   ```

## Step 5: Verify the Deployment
1. Access your site at `https://madureiraseguros.com.br`.
2. Check the PM2 processes:
   ```bash
   pm2 list
   ```

## Additional Notes
- Ensure your VPS firewall allows traffic on ports `80` (HTTP) and `443` (HTTPS).
- If your WhatsApp API requires specific environment variables, configure them in the PM2 startup script or `.env` file.

## Troubleshooting
- If the site is not accessible, check the Nginx logs:
  ```bash
  sudo tail -f /var/log/nginx/error.log
  ```
- If the WhatsApp API is not working, check the PM2 logs:
  ```bash
  pm2 logs whatsapp-api
  ```

## License
This project is licensed under the MIT License.
