# Canvas Helper
A wallpaper engine web wallpaper.

---

## 效果展示

### 支持移动、调整大小

![](https://res.yydbxx.cn/server/static/canvas/snapshots/recording.gif)

![](https://res.yydbxx.cn/server/static/canvas/snapshots/s1.png)

**所有勾选的选项会同步到我们服务器端**

## 使用说明

这里我以密院的Canvas为例说明一下如何使用。

### 第一步: 获取Access token

在 账户>设置 中找到“允许融入使用的外部软件”选项，创建一个新的许可证。过期栏请留空。

<img src="https://res.yydbxx.cn/server/static/canvas/snapshots/access.png" style="zoom:50%;" />

请保存“令牌”。

### 第二步：安装Canvas Helper

在Wallpaper Engine中，搜索壁纸“Canvas Helper”。下载并安装。

或访问以下链接：[Canvas Helper](https://steamcommunity.com/workshop/filedetails/?id=2784688149)。

### 第三步：在Canvas中找到课程的课程代码

选择您需要查看的课程，在课程主页，查看网页地址，应该是形如`https://umjicanvas.com/courses/2469`的链接。其中`2469`就是该课的课程代码。

### 第四步：配置用户文件

在壁纸配置中，配置`user_data`变量。选择文件夹为**该壁纸所在的目录**（查看壁纸目录的方法：在Wallpaper Engine中右键，在资源管理器中打开，选择这个目录）。

<img src="https://res.yydbxx.cn/server/static/canvas/snapshots/wppath.png" style="zoom:50%;" />

**更新：重要提醒：这个文件夹务必选择为壁纸所在目录，否则将无法访问到该文件。**

在这个目录下创建一个名为`user_data.json`的文件（**必须为该名称**）

<img src="https://res.yydbxx.cn/server/static/canvas/snapshots/explorer.png" style="zoom:67%;" />

然后向其中添加以下内容（下面只是示例）：

```json
{
    "bid": "这里填充您的Access Token",
    "url": "这里填充Canvas网址，如https://umjicanvas.com/，或https://oc.sjtu.edu.cn/",
    "courses": [
        {
            "course_id": 2469(课程代号),
            "course_name": "课程名称",
            "type": "类型，ass/ann/dis"
        }
    ]
}
```

可以参考本仓库的`user_data_example.json`示例文件。

说明：

课程名称是在桌面显示的名称，`type`共有三种：

- ass: 作业
- ann: 公告
- dis: 讨论

`courses`可以有很多，请按照需要的顺序排放它们。

### 自定义壁纸

可以选择您自己的壁纸来展示。

### 其他说明

您可以自行修改css和html文件。

设置好文件夹后如果无法显示，可能需要重新加载壁纸。

### style.css

如果您的显示屏显示有异常，如字体太小，可以设置您的`style.css`文件（在壁纸目录下）。

```css
.checkbox{
    height: 16px;
    width: 16px; /* 调整勾选框大小 */
}

.ssvg{
    margin-bottom: 2px; /* 配合上面那个使用 */
}

.innerbox{
    font-size: 20pt; /* 调整文字大小 */
}
```

各种对象的class：

<img src="https://res.yydbxx.cn/server/static/canvas/snapshots/css.png" style="zoom:70%;" />

### user_data

一些高级属性：

根节点下：

- `title`：指定大标题内容（默认为`Canvas Notification`）
- `timeformat`：指定日期显示格式，可以为`"origin"`、`"relative"`（默认）、python中`strftime`格式，这里的优先级低于course节点设置的优先级

courses节点下：

- `maxshow`：最大显示数量
- `order`：显示顺序，可选为`reverse`表示倒序展示
- `timeformat`：指定日期显示格式，同根节点，但这里的优先级更高
- `msg`：添加额外信息，支持html语法

### 添加提示框/复制文字

在`msg`中添加`ppt`标签。

例子：

```json
{
    "course_id": 2469,
    "course_name": "VY200",
    "type": "ass",
    "msg": "<p>Meeting ID: <ppt label='ID'>615-150-756</ppt></p><p>Password: <ppt>544136</ppt></p>"
}
```

`ppt`标签可选参数为`label`，表示提示框的标题。

通过提示框，您可以复制这些文字。

## 隐私问题

说明：服务器端我们没有保存Access code，仅保存了SHA1后的Access code、用户勾选的Checkbox信息和Box位置信息。之后可能会开发本地服务器。

## 实验性功能

### 视频壁纸

目前版本可以使用视频作为背景。要使用该功能，首先您需要通过视频转换软件将您想要播放的视频转换为webm视频格式（Wallpaper Engine仅支持该格式），然后将其拷贝至壁纸文件夹下。

然后在`user_data.json`文件中添加如下选项：

```json
"url": ...
"video": "Solar_System.webm",
"courses": [...
```

请设置`"video"`属性为您的视频文件名。

### 课表提醒

该功能可以让您查看即将上的课程。目前只有密院学生能使用该功能。

由于该功能出现一些[Bug](#6)，暂时不提供使用方法。

## 特性/支持

- [x] 自定义壁纸、页面（需要改写css）
- [x] Checkbox
- [ ] 作业/公告更新提示
- [x] 可拖动的div
- [x] 可调整大小的div
- [x] 用户添加说明/额外的Note
- [x] 隐藏部分items
- [x] 更好的Due提示
- [x] Cache页面
- [x] 视频壁纸
- [ ] *支持本地运行服务器
- [x] Scrollbar特性

## 关于源代码

`Server`文件夹包含服务器端代码。

`Client`文件夹包含客户端代码（Wallpaper engine项目文件）

客户端真正用到的代码托管在CDN上，可以通过以下链接访问：

<https://res.yydbxx.cn/server/static/canvas/model.js>

<https://res.yydbxx.cn/server/static/canvas/style.css>

## Code Issue

- [ ] 使用`canvasapi`获取Canvas数据
- [ ] 优化`model.js`
- [ ] 优化`calendar_parser`

## Bug Report

You can open an issue and report your problems.

## Known Bugs

- Calendar not working (#6)
- Scrollbar script not loading (#5)

## Contact

Email: linsy_king@sjtu.edu.cn
