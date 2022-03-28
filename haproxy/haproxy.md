This file records the operation related to haproxy.

The configuration can be found in [haproxy.cfg](haproxy.cfg)

To start the haproxy server, use:

```shell
sudo haproxy -f [configFile] -D
```

This will start haproxy using the specified configuration and make it run as Daemon.

To stop the haproxy service, just use:

```shell
sudo kill [pid]
```

and it will do the work.

To check if the configuration written properly, use:

```shell
sudo haproxy -f [configFile] -c
```

correct any error until it's valid.

I've set all timeout values to be 10 minutes in [haproxy.cfg](haproxy.cfg) to prevent timeout errors when performing load testing.
