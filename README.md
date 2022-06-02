# BikeHotSpot
## Start K3d
``` code=bash
# create cluster
k3d cluster create  --servers 1 --agents 2 -p "30000-30005:30000-30005@server:0"

# create pod
kubectl apply -f rabbitmq.yml

# delete cluster
k3d cluster delete 
```

## Set RabbitMQ user
```
rabbitmqctl add_user {username} {password}
rabbitmqctl set_user_tags username administrator
rabbitmqctl set_permissions -p / newadmin ".*" ".*" ".*"
```

