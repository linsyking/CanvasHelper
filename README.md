# Canvas Helper
A wallpaper engine web wallpaper.

**说明：服务器端我们没有保存例如Access code等隐私数据，仅保存了加密（sha1）后的Access code和用户勾选的Checkbox信息**

**请不要恶意使用**

---

## 效果展示

### 双栏

![](http://www.yydbxx.cn:3000/King/materials/raw/branch/master/Canvas%20Helper/img/double.png)

### 单栏

![](http://www.yydbxx.cn:3000/King/materials/raw/branch/master/Canvas%20Helper/img/single.png)

**所有勾选的选项会同步到我们服务器端**

## 使用说明

这里我以密院的Canvas为例说明一下如何使用。

### 第一步: 获取Access token

在 账户>设置 中找到“允许融入使用的外部软件”选项，创建一个新的许可证。过期栏请留空。

<img src="http://www.yydbxx.cn:3000/King/materials/raw/branch/master/Canvas%20Helper/img/access.png" style="zoom:50%;" />

请保存“令牌”。

### 第二步：安装Canvas Helper

在Wallpaper Engine中，搜索壁纸“Canvas Helper”。下载并安装。

或访问以下链接：[Canvas Helper](https://steamcommunity.com/workshop/filedetails/?id=2784688149)。

### 第三步：在Canvas中找到课程的课程代码

选择您需要查看的课程，在课程主页，查看网页地址，应该是形如`https://xxx/courses/yyyy`的链接。其中`yyyy`就是该课的课程代码。

### 第四步：配置用户文件

在壁纸配置中，配置`user_data`变量。选择一个文件夹，这个文件夹下需要包含待会我们配置的文件。

在这个选择的文件目录下创建一个名为`user_data.json`的文件，然后向其中添加以下内容（下面只是示例）：

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

说明：

课程名称是在桌面显示的名称，`type`共有三种：

- ass: 作业
- ann: 公告
- dis: 讨论

`courses`可以有很多，请按照需要的顺序排放它们。

### 其他说明

您可以自行修改css和html文件。在壁纸右下角有一个蓝色的`Refresh`，点击它会重新拉取通知。

设置好文件夹后如果无法显示，可能需要重新加载壁纸。

## 特性/支持

- [x] 自定义壁纸
- [x] Checkbox
- [ ] 页面布局
- [ ] 作业/公告更新提示

## 关于源代码

`Server`文件夹包含服务器端代码。

`Client`文件夹包含客户端代码（Wallpaper engine项目文件）

有问题发issue，或者发pr，谢谢。

## Contact

Email: linsy_king@sjtu.edu.cn
