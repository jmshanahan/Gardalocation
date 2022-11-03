# Introduction
A simple garda location application using esri development environment. The garda stations are marked with black dots. The data is served from a feature layer published through ArcGIS online services.

## Small Change to the original
I have put the site back up again under the web site name www.jshanahan.com. It was www.jshanahan.biz and this time around I haven't implemented the Diffie Hellman Key Exchange.

## Instructions

To display garda information click on the black icons and an informational popup will appear with the relevent information.
The source code is available at [Github](https://github.com/jmshanahan/Gardalocation).

## Features
This web application has been designed to work on Desktop, Tablet and Phone. Testing the application on my phone it appears that some parts could be adjusted. But the main point to get across here is that media queries have been implemented in the css to cater for all three devices.


## Dataset
The dataset used to develop this application was downloaded from the [Geohive](https://www.geohive.ie/datasets/9058900a71864f7a87b6863dfebb7390_0/about)
There does appear to be some errors in the dataset, for example when you click on the Carrick-on-Suir garda station its Division is marked as Ennis. This is unlikely.
The phone numbers do not look to be correct either.


# Issues

## Nesting Flexbox
I wanted to nest the MapView inside a flexbox container so I could another column to the right of it. But when I did initially he map would not display.

This would work
```
        <div>
            <div id="viewDiv"></div>
        </div>
```
But it needed the ```getElementById```
```
    const viewNode = window.document.getElementById("viewDiv");
    
    
    const view = new MapView({
      container: viewNode, // Reference to the view div created in step 5
      map: map, // Reference to the map object created before the view
      zoom: 10, // Sets zoom level based on level of detail (LOD)
      center: [-7, 53] // Sets center point of view using longitude,latitude
    });

```
This would not work, **but**

<pre>
    const view = new MapView({
      container: <b>"viewDiv"</b>, // Reference to the view div created in step 5
      map: map, // Reference to the map object created before the view
      zoom: 10, // Sets zoom level based on level of detail (LOD)
      center: [-7, 53] // Sets center point of view using longitude,latitude
    });
</pre>

The only way this would work was to remove the surrounding ```div``` from the ```MapView```

The dom would look like this
```
    <div id="viewDiv"></div>
 ```
 A strange one this but it is working now.


## Unresolved Issue

I wanted to add a scale at the bottom of the mapView.
I added the usual require for scalebar and passed it in
The code is as follows
```
    const scaleBar = new ScaleBar({
      view: view,
      unit: "dual" ,
      visible: true
    });
    view.ui.add(scaleBar,{position: "bottom-left"});
  });
```

I then attempted to add the compassWidget and I had the same issue.
If you go to the github, main.js file on the scalebar branch you will see the code. There is nothing obvious that I could see. The conclusion that I reached is that it could possible have something to do with the flexbox display and that took a bit of adjusting to get working. I am thinking that because I specified the height of the map as <code>80vh</code> this may be the problem. If I had specified <code>px</code> it may have worked.



# Nginx Configuration

## Linode Cloud Services
The website is being served by a Centos Server running on the Linode Cloud.
It has an Nginx webserver configured to serve out the webpage on www.jshanahan.com.

## Http certificates
Http certificates were created at Letsencrypt using their [certbot](https://certbot.eff.org/) application.
This service is now fully automated and is really straight forward but required snap to be installed in the system.
Assuming Nginx is up and running with the domain name and correctly configured on <code>port 80</code> the commands to get this up and running are as follows.

```
sudo dnf update -y
sudo dnf install epel-release
sudo dnf install snapd
sudo systemctl enable --now snapd.socket
sudo ln -s /var/lib/snapd/snap /snap
sudo snap install --classic certbot
sudo systemctl restart snapd.seeded.service
sudo systemctl status snapd.seeded.service
sudo certbot --nginx
```
The certificate and the key file were automatically saved to 
```
    /etc/letsencrypt/live/jshanahan.biz/fullchain.pem
    /etc/letsencrypt/live/jshanahan.biz/privkey.pem
```
The script now appears to implement the Diffie Hellman Key Exchange which was not always the case.
Diffie Hellman is mandated for TLS 1.3. As can be seen from the configuration TLS 1.3 has been implemented on this site.
The Diffe Hellman parameters are stored in the following file.
```
etc/letsencrypt/ssl-dhparams.pem;
```

TLS (Transport Layer Security) provides secure communication between web browsers and servers and TLS 1.3 is faster and more secure than its predecessors.
This site has been set up to be backward compatible to TLS 1.2.

```
ssl_protocols TLSv1.2 TLSv1.3;
```



## Qualys SSL Labs test
To test if the installation is secure it was put it through [Qualys SSL Labs](https://ssllabs.com)
It came back with an overall rating of <code>A</code>.

To get it to <code>A+</code>  HSTS (HTTP Strict Transport Security) had to be implemented. HSTS tells web browsers that they should always interact with the server over https.

```
add_header Strict-Transport-Security "max-age=63072000; includeSubdomains; preload";
```

### Cross Site Scripting
I did not defend the site against Cross-Site Scripting as I suspect this would basically prevent the esri maps from being displayed as these bypass the Nginx server.

**Note: I haven't tested it though.**
The following line should be added to the configuration to defend against X-XSS
```
add_header X-XSS-Protection "1; mode=block";
```
The real point that I am trying to make here is that even though the lab tests gave the site a secuirty rating of <code>A+</code> this is a bit superficial as there is a lot more tweeks that could be done to Nginx to make the site more secure.

Outside of that the site could be channelled through a Web Performance & Security service like [Cloudflare](https://www.cloudflare.com/). An open source alternative to Cloudflare is [Fail2ban](https://www.fail2ban.org/wiki/index.php/Main_Page) but Fail2ban does not implement caching.


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

