// 引入依赖
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

// 创建 express 应用程序
const app = express();

// 设置端口号
const PORT = process.env.PORT || 3000;

// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));

// 设置请求体解析中间件
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// 设置路由

// 获取所有笔记
app.get('/api/notes', (req, res) => {
  fs.readFile(path.join(__dirname, 'data.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(JSON.parse(data));
    }
  });
});

// 添加笔记
app.post('/api/notes', (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    res.status(400).json({ error: 'Bad Request' });
  } else {
    fs.readFile(path.join(__dirname, 'data.json'), 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        const notes = JSON.parse(data);
        const id = notes.length + 1;
        const newNote = { id, title, content };
        notes.push(newNote);
        fs.writeFile(path.join(__dirname, 'data.json'), JSON.stringify(notes), 'utf8', (err) => {
          if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
          } else {
            res.json(newNote);
          }
        });
      }
    });
  }
});

// 编辑笔记
app.put('/api/notes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { title, content } = req.body;
  if (!title || !content) {
    res.status(400).json({ error: 'Bad Request' });
  } else {
    fs.readFile(path.join(__dirname, 'data.json'), 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        const notes = JSON.parse(data);
        const index = notes.findIndex(note => note.id === id);
        if (index === -1) {
          res.status(404).json({ error: 'Not Found' });
        } else {
          notes[index].title = title;
          notes[index].content = content;
          fs.writeFile(path.join(__dirname, 'data.json'), JSON.stringify(notes), 'utf8', (err) => {
            if (err) {
              console.error(err);
              res.status(500).json({ error: 'Internal Server Error' });
            } else {
              res.json(notes[index]);
            }
          });
        }
      }
    });
  }
});

// 删除笔记
app.delete('/api/notes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  fs.readFile(path.join(__dirname, 'data.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      const notes = JSON.parse(data);
      const index = notes.findIndex(note => note.id === id);
      if (index === -1) {
        res.status(404).json({ error: 'Not Found' });
      } else {
        notes.splice(index, 1);
        fs.writeFile(path.join(__dirname, 'data.json'), JSON.stringify(notes), 'utf8', (err) => {
          if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
          } else {
            res.json({ message: 'Note deleted successfully' });
          }
        });
      }
    }
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});