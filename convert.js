const fs = require('fs');
try {
    const file = fs.readFileSync('audio/mids/盗将行.mid');
    const base64Data = file.toString('base64');
    // 验证数据是否完整
    console.log('文件大小:', file.length, '字节');
    console.log('Base64长度:', base64Data.length, '字符');
    console.log('data:audio/midi;base64,' + base64Data);
} catch (error) {
    console.error('转换出错:', error);
}