# 构建与远程

在制作器模板完成制作后，Edgeless Bot 会验收就绪目录，然后将其中的内容压缩并存放到构建存储目录中（默认为 `./builds`，可以通过配置文件中的 `DIR_BUILDS` 修改）的对应分类名文件夹内。如果启用了远程功能，随后 Edgeless Bot 会将其上传到远程存储中的对应分类名文件夹内。

:::tip
注意区分 任务配置 和 配置文件，他们的文件名均为 `config.toml`。前者指某个任务的配置，文件位于任务文件夹内；后者指 Edgeless Bot 本体的配置，文件位于项目根目录中。
:::

## 构建

构建文件会以 .7z 格式压缩，默认名称遵循 Edgeless 插件包命名规范（`任务名称_版本号_任务作者.7z`）。Edgeless Bot 会根据配置文件中给定的 `MAX_BUILDS` 从本地和远程删除冗余的历史版本。

## 远程

由于 Nep 的后端服务架构较特殊，在构建结束后如果启用了远程功能则会进行以下两个步骤
* 将 `.nep` 和 `.nep.meta` 文件上传到 cloud189
* 将 `.nep.meta` 文件上传到 rclone

因此如果启用远程功能则在运行 Edgeless Bot 之前需要预先安装并配置 rclone 和 cloud189 两个客户端：

* 确保你已经[安装 rclone](./usage.md#rclone-选装)，然后在终端中运行命令 `rclone config`，输入 `n` 并回车创建一个新的远程存储。详细步骤见 [rclone 官方教程](https://rclone.org/docs/)。
* 确保你已经[安装 rclone](./usage.md#rclone-选装)，然后在终端中运行命令 `cloud189 login`，输入账号密码登录。

创建完成后修改 Edgeless Bot 配置文件，将 `REMOTE_RCLONE_NAME` 改为在 rclone 中配置的存储名称，`REMOTE_RCLONE_PATH` 和 `REMOTE_CLOUD189_PATH` 分别改为对应的远程 meta 和 builds 存放目录。
