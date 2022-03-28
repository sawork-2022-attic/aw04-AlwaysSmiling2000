This file serves as a record for redis-related procedures. 

To start the redis server, use: 

```shell
redis-server [path/to/your/configuration/file]
```

The configuration used in this demo is [redis.conf](redis.conf). I've copied it from the official version (which is in the redis installation directory), making it run as Daemon and handle requests from anywhere.

Then use: 

```shell
redis-cli
```

to connect to the server. In the command line interface, type these commands to do various stuff with redis:

```shell
# check all the keys currently stored
keys *

# check keys matching the specified pattern
keys [pattern]

# check the type of a key
type [keyname]

# get the value if it's a string key
get [keyname]

# get the value if it's a hash key
hgetall [keyname]

# get the value if it's a set key
smembers [keyname]

......

# check the time-to-live of a key
ttl [keyname]

# clear the terminal
clear

# remove all the records
flushall

# shutdown the redis server
shutdown

# quit the command line interface
exit

# and many more

......

```

We generally use these commands to check if the application works appropriately. 
