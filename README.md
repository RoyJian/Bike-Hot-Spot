# Bike-Hot-Spot
查詢ubike熱點 
## Quick Start
### Using docker-compose
1. set .env file   
 go to `/template` set .env  (whitout any .yml file )
2. cp .env
   ```code=bash
    cp ./template/.env ./
   ```
3. build image
   ```code=bash
    docker build . -t bike-hot-spot
   ```
4. start services
   ```code=bash
    docker-compose up -d
   ```
5. test   
   go to [http://localhost:4000/](http://localhost:4000/)
   click `Query your server`     
   input in Variable:   
   ```code=json
   {
      "address": "台北市政府",
      "version": "ubikev1"
   }
   ```
   click `Query`
6. close container
   ```code=bash
    docker-compose down
   ```
### Using k8s 
1. set config   
   go to `/template` set config file (whitout .env)
2. cp them
   ```code=sh
   cp template/*.yml k8s
   ```
3. create k8s 
   ``` code=bash
    # create cluster (using K3d)
    k3d cluster create  --servers 1 --agents 2 -p "30000-30005:30000-30005@server:0"
   ```
4. deploy services
   ```code=bash
   cd ./k8s
   kubectl apply -f .
   ```
5. test   
   go to [http://localhost:30004/](http://localhost:30004/)
   click `Query your server`     
   input in Variable:   
   ```code=json
   {
      "address": "台北101",
      "version": "ubikev1"
   }
   ```
   click `Query`
6. delete cluster
   ```code=bash
    k3d cluster delete 
   ```


## Set RabbitMQ user (option)
```
# enter RabbitMQ container
rabbitmqctl add_user {username} {password}
rabbitmqctl set_user_tags username administrator
rabbitmqctl set_permissions -p / newadmin ".*" ".*" ".*"
```

