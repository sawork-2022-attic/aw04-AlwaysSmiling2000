This file contains commands for creating docker images and containers.

It's not put here as an automated script, but for recording the procedure and corresponding settings.

First to create the webpos image, we need to run:

```shell
mvn clean package
```

This will produce a `jar` file in the `target` directory, and then run:

```shell
sudo docker build -t aw04:scalable-webpos .
```

to build the docker image with "aw04" as its name and "scalable-webpos" as its tag. This build command is carried out under the control of the [Dockerfile](Dockerfile).

We can use:

```shell
sudo docker images
```

to check if the image was successfully built. In order to run the image, we still need some containers to hold the image. And for the purpose of load testing, we're going to limit the computing resources used by each container:

```shell
sudo docker run -d -p 8001:8080 --name webpos8001 --cpus 0.5 aw04:scalable-webpos
```

This will create a new container for the image aw04 we just created and run it in detach mode. The port 8080 of the container is mapped to port 8001 of the host, so we can type `localhost:8001` to visit the webpos application running in the container. We also use `--name` to name the container as `webpos8001` and `--cpus` to provide it with only `0.5` cpu core.

For convenience, we'll not limit memory and disk resources. Type:

```shell
sudo docker ps -a
```

to check that the container is created and started successfully. Then create multiple containers with different names and port mappings to scale the application horizontally.

To manage the containers and images, use:

```shell
# stop, start or restart a container
sudo docker [stop, start or restart] [containerId or containerName]

# to remove an image
sudo docker rmi [imageId or imageName:imageTag]

# to remove a container
sudo docker rm [containerId or containerName]

# show basic info of an image or container
sudo docker inspect [imageId, imageName:imageTag, containerId or containerName]

# display the resource usage
sudo docker stats [containerName ...]
# 
```

To check the usage of docker, use:

```shell
# show available commands
sudo docker help

# show info of a specific command
sudo docker help [commandName]
```
