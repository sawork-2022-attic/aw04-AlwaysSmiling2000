# Scalable WebPOS

此分支提供了基于原本的 webpos 界面的实现，包括：

* 使用 docker 部署 2 个 webpos 实例

* 使用 haproxy 做负载均衡

* 使用三主三从的 redis 集群做缓存

* 使用京东提供的后端数据服务

整个项目完全运行在 docker 环境内。

# 运行方法

此项目提供一键运行、一键清理，等容器完全启动之后可以访问 http://localhost:80

```shell
# 下载/安装 redis、haproxy、webpos 镜像，并启动整个应用
./run.sh

# 停止整个应用，并删除所有容器和 webpos 镜像
./run.sh clean
```

注意 clean 操作不会删除 redis 和 haproxy 镜像，防止有其他容器使用。

# 配置说明

1. 容器之间是如何连接的？

* 此项目中所有的容器实例都连接到一个名为 aw04-net 的 docker 网络上，这个网络自动提供容器名到容器 IP 地址的 DNS 解析。

2. redis 不支持通过主机名配置集群，又是如何连接的？

* run.sh 脚本中会获取各个 redis server 的虚拟 IP，用这个虚拟 IP 创建集群（docker 网络可以解析这些虚拟 IP）。
