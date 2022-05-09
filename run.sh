#!/bin/bash

# inclusive
REDIS_CLUSTER_PORT_START=6379

# inclusive
REDIS_CLUSTER_PORT_END=6384

#
REDIS_CLUSTER_PASSWD='$2a$10$YxqIjiboiVXM6KfGF3ARIOAnP0rkpyq/9L9MlQI4/BdR.0oLYxAou'

# inclusive
WEBPOS_CLUSTER_PORT_START=8001

# inclusive
WEBPOS_CLUSTER_PORT_END=8002

NETWORK_BRIDGE='aw04-net'

function run() {

  # create a network bridge for communication
  sudo docker network create -d bridge ${NETWORK_BRIDGE}

  # start redis servers
  for (( port = ${REDIS_CLUSTER_PORT_START}; port <= ${REDIS_CLUSTER_PORT_END}; port++ )); do
      sudo docker run\
        -d -p ${port}:6379\
        --network ${NETWORK_BRIDGE}\
        -v $(pwd)/redis.conf:/usr/local/etc/redis/redis.conf\
        --name redis-${port}\
        redis redis-server /usr/local/etc/redis/redis.conf
  done

  REDIS_CLUSTER_NODES=""

  # collect nodes info
  for (( port = ${REDIS_CLUSTER_PORT_START}; port <= ${REDIS_CLUSTER_PORT_END}; port++ )); do
      NODE_VIP=$(sudo docker exec redis-${port} cat /etc/hosts | tail -1 | awk '{print $1}')
      REDIS_CLUSTER_NODES="${REDIS_CLUSTER_NODES} ${NODE_VIP}:6379"
  done

  # create redis cluster
  sudo docker exec redis-${REDIS_CLUSTER_PORT_START} redis-cli\
    --no-auth-warning --pass ${REDIS_CLUSTER_PASSWD}\
    --cluster create ${REDIS_CLUSTER_NODES} --cluster-replicas 1 --cluster-yes

  # build the webpos image if necessary
  if [ ! $(sudo docker images -q webpos) ]; then
      sudo docker build -t webpos .
  fi

  # replace space with comma
  REDIS_CLUSTER_NODES=$(echo ${REDIS_CLUSTER_NODES} | tr ' ' ',')

  # start webpos servers
  for (( port = ${WEBPOS_CLUSTER_PORT_START}; port <= ${WEBPOS_CLUSTER_PORT_END}; port++ )); do
    sudo docker run\
      -d -p ${port}:8080\
      --network ${NETWORK_BRIDGE}\
      --name webpos-${port}\
      webpos\
      java -jar /target/webpos-0.0.1-SNAPSHOT.jar\
        --spring.redis.password=${REDIS_CLUSTER_PASSWD}\
        --spring.redis.cluster.nodes=${REDIS_CLUSTER_NODES}\
        --spring.redis.cluster.max-redirects=6
  done

  # start haproxy
  sudo docker run\
    -d -p 80:80\
    --network ${NETWORK_BRIDGE}\
    -v $(pwd)/haproxy.cfg:/usr/local/etc/haproxy/haproxy.cfg\
    --name haproxy\
    haproxy haproxy -f  /usr/local/etc/haproxy/haproxy.cfg

}

function cleanup() {

  # remove haproxy container
  sudo docker stop haproxy
  sudo docker rm haproxy

  # remove webpos
    for (( port = ${WEBPOS_CLUSTER_PORT_START}; port <= ${WEBPOS_CLUSTER_PORT_END}; port++ )); do
        sudo docker stop webpos-${port}
        sudo docker rm -v webpos-${port}
    done

    sudo docker rmi webpos

  # remove redis containers
  for (( port = ${REDIS_CLUSTER_PORT_START}; port <= ${REDIS_CLUSTER_PORT_END}; port++ )); do
      sudo docker stop redis-${port}
      sudo docker rm -v redis-${port}
  done

  # remove the network bridge
  sudo docker network rm ${NETWORK_BRIDGE}

}

if [ $# -gt 1 ]; then
    echo 'Error: redundant arguments:' $2
    exit -1
elif [ $# -eq 1 ]; then
  if [ $1 == 'clean' ]; then
    cleanup
    exit 0
  else
    echo 'Error: unknown command:' $1
    exit -1
  fi
fi

# default to run
run
