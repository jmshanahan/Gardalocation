# Nginx Configuration

## Linode Cloud Services
The website is being served by a Centos Server running on the Linode Cloud.
It has an Nginx webserver configured to serve out the webpage on www.jshanahan.biz.

## Http certificates
Http certificates were created at Letsencrypt using their [certbot](https://certbot.eff.org/) application.
This service is now fully automated and is really straight forward but required snap to be installed in the system.
Assuming Nginx is up and running the commands to get this up and running are as follows.

```
sudo dnf update -y
sudo dnf install epel-release
sudo dnf install snapd
sudo systemctl enable --now snapd.socket
sudo ln -s /var/lib/snapd/snap /snap
sudo snap install --classic certbot
sudo systemctl restart snapd.seeded.service
sudo systemctl status snapd.seeded.service
sudo snap install --classic certbot
sudo certbot --nginx
```
The certificate and the key file were automatically saved to 
```
    /etc/letsencrypt/live/jshanahan.biz/fullchain.pem
    /etc/letsencrypt/live/jshanahan.biz/privkey.pem
```


## Qualys SSL Labs test
To test if the installation is secure I  put it through [Qualys SSL Labs](https://ssllabs.com)
It came back with an overall rating of A.

To get it to A+ I had to implement HSTS (HTTP Strict Transport Security). HSTS tells web browsers that they shouls always interact with the server over https.

```
add_header Strict-Transport-Security "max-age=63072000; includeSubdomains; preload";
```


## Nginx configuration


### Server file configuration

```
server {
        server_name  www.jshanahan.biz;

        # Load configuration files for the default server block.
        include /etc/nginx/default.d/*.conf;

        location / {
		root /var/www/vhosts;
		index index.html;
        }
    	location /nginx_status {
	    	stub_status on;
		    access_log off;
		    allow 176.58.124.71;
		    deny all;
	    }

        error_page 404 /404.html;
            location = /40x.html {
        }

        error_page 500 502 503 504 /50x.html;
            location = /50x.html {
        }
    
    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/jshanahan.biz/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/jshanahan.biz/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

}

    server {
    if ($host = www.jshanahan.biz) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


        listen       80 default_server;
        server_name  www.jshanahan.biz;
    return 404; # managed by Certbot
} 

```

From this you can see that all requests entering at port 80 get redirected to port 443
The source code needs to be located at /var/www/vhosts


it also includes the following line
```
include /etc/letsencrypt/options-ssl-nginx.conf;
```

```
    ssl_session_cache shared:le_nginx_SSL:10m;
    ssl_session_timeout 1440m;
    ssl_session_tickets off;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    add_header Strict-Transport-Security "max-age=63072000; includeSubdomains; preload";

    ssl_ciphers "ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384";
```

We should now have a fully secure Nginx server to serve out our webpage.