# 钢琴快手 (Fast Piano)

一款充满趣味性的音乐节奏游戏


## 前置要求

1. Git 2.6+
2. 浏览器
3. node.js

## 如何游玩

克隆仓库

```shell
git clone https://github.com/suiyunzou/fast-piano.git
```

进入文件夹

```shell
cd fast-piano
```

现在，在您喜欢的浏览器中打开 **index.html**。

## 添加新歌曲教程

### 准备工作

1. 准备 MIDI 文件
   - 确保您有想要添加的歌曲的 MIDI 文件
   - 准备一个您有想要添加的歌曲的png图片
   - 推荐MIDI资源：https://www.midishow.com/

2. 安装必要工具
   - 确保已安装 Node.js 

### 添加新歌曲的步骤

1. **转换 MIDI 文件为 Base64**
   - 将 MIDI 文件放在项目audio\mids目录下
   - 修改 `convert.js` 文件，将 MIDI 文件路径替换为实际路径
   - 命令将输出 Base64 编码的字符串

2. **确定钢琴音轨编号**
   - 通常钢琴音轨编号为 1 或 2
   - 如果不确定，可以尝试不同的音轨号，直到找到正确的钢琴音轨 范围：(0-4)

3. **修改 songs.js 文件**
   - 打开 `songs.js` 文件
   - 在歌曲列表中添加新条目:
     ```javascript
     {
         'track': 1,          // 钢琴音轨编号
         'name': '歌曲名称',   // 显示的歌曲名称
         'base64': '...'      // 第1步获得的Base64字符串
     }
     ```

4. **测试新添加的歌曲**
   - 刷新游戏页面
   - 检查新歌曲是否出现在列表中
   - 播放测试，确保音轨正确

### 常见问题解决

1. **如果音轨选择错误**
   - 表现：听不到钢琴声音或听到错误的乐器声音
   - 解决：修改 songs.js 中对应歌曲的 track 值 范围【0-4】

2. **如果 Base64 数据错误**
   - 表现：歌曲无法播放
   - 解决：检查 Base64 字符串是否完整，确保包含 MIDI 文件的完整数据

## 参考资料

- [MIDI.js](https://galactic.ink/midi-js/)
- [jasmid](https://github.com/gasman/jasmid)
- [Piano-Tiles](http://tanksw.com/piano-tiles/)
- [game-piano-hero-html5](https://github.com/humbertodias/game-piano-hero-html5)
