const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const UPLOADS_DIR = path.join(__dirname, 'uploads');
const TRANSLATIONS_DIR = path.join(__dirname, 'translations');

if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
if (!fs.existsSync(TRANSLATIONS_DIR)) {
    fs.mkdirSync(TRANSLATIONS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOADS_DIR);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (path.extname(file.originalname) === '.json') {
            cb(null, true);
        } else {
            cb(new Error('只允许上传 JSON 文件'));
        }
    }
});

const SUPPORTED_LANGUAGES = ['ar', 'tr', 'pt', 'en', 'de'];

app.get('/api/files', (req, res) => {
    try {
        const files = fs.readdirSync(UPLOADS_DIR).filter(file => 
            path.extname(file) === '.json'
        );
        
        const filesWithInfo = files.map(file => {
            const filePath = path.join(UPLOADS_DIR, file);
            const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            return {
                name: file,
                keys: Object.keys(content),
                content: content
            };
        });
        
        res.json(filesWithInfo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/upload', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: '没有上传文件' });
        }
        
        const filePath = path.join(UPLOADS_DIR, req.file.originalname);
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        SUPPORTED_LANGUAGES.forEach(lang => {
            const langDir = path.join(TRANSLATIONS_DIR, lang);
            if (!fs.existsSync(langDir)) {
                fs.mkdirSync(langDir, { recursive: true });
            }
            
            const translationPath = path.join(langDir, req.file.originalname);
            if (!fs.existsSync(translationPath)) {
                const translations = {};
                Object.keys(content).forEach(key => {
                    translations[key] = '';
                });
                fs.writeFileSync(translationPath, JSON.stringify(translations, null, 2), 'utf8');
            }
        });
        
        res.json({ 
            success: true, 
            message: '文件上传成功',
            file: {
                name: req.file.originalname,
                keys: Object.keys(content),
                content: content
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/translations/:lang/:filename', (req, res) => {
    try {
        const { lang, filename } = req.params;
        const translationPath = path.join(TRANSLATIONS_DIR, lang, filename);
        
        if (!fs.existsSync(translationPath)) {
            return res.status(404).json({ error: '翻译文件不存在' });
        }
        
        const content = JSON.parse(fs.readFileSync(translationPath, 'utf8'));
        res.json({ lang, filename, content });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/translations/:lang/:filename', (req, res) => {
    try {
        const { lang, filename } = req.params;
        const { content } = req.body;
        
        const langDir = path.join(TRANSLATIONS_DIR, lang);
        if (!fs.existsSync(langDir)) {
            fs.mkdirSync(langDir, { recursive: true });
        }
        
        const translationPath = path.join(langDir, filename);
        fs.writeFileSync(translationPath, JSON.stringify(content, null, 2), 'utf8');
        
        res.json({ success: true, message: '翻译保存成功' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/languages', (req, res) => {
    try {
        const languages = fs.existsSync(TRANSLATIONS_DIR) 
            ? fs.readdirSync(TRANSLATIONS_DIR).filter(dir => 
                fs.statSync(path.join(TRANSLATIONS_DIR, dir)).isDirectory()
            )
            : SUPPORTED_LANGUAGES;
        
        SUPPORTED_LANGUAGES.forEach(lang => {
            if (!languages.includes(lang)) {
                languages.push(lang);
            }
        });
        
        res.json(languages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/languages', (req, res) => {
    try {
        const { lang } = req.body;
        
        if (!lang || !/^[a-z]{2}$/.test(lang)) {
            return res.status(400).json({ error: '语言代码必须是2个小写字母' });
        }
        
        const langDir = path.join(TRANSLATIONS_DIR, lang);
        if (fs.existsSync(langDir)) {
            return res.status(400).json({ error: '该语言已存在' });
        }
        
        fs.mkdirSync(langDir, { recursive: true });
        
        const uploads = fs.readdirSync(UPLOADS_DIR).filter(file => 
            path.extname(file) === '.json'
        );
        
        uploads.forEach(file => {
            const originalPath = path.join(UPLOADS_DIR, file);
            const originalContent = JSON.parse(fs.readFileSync(originalPath, 'utf8'));
            const translations = {};
            Object.keys(originalContent).forEach(key => {
                translations[key] = '';
            });
            
            const translationPath = path.join(langDir, file);
            fs.writeFileSync(translationPath, JSON.stringify(translations, null, 2), 'utf8');
        });
        
        res.json({ success: true, message: '语言添加成功', lang });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/download/:lang/:filename', (req, res) => {
    try {
        const { lang, filename } = req.params;
        const translationPath = path.join(TRANSLATIONS_DIR, lang, filename);
        
        if (!fs.existsSync(translationPath)) {
            return res.status(404).json({ error: '翻译文件不存在' });
        }
        
        res.download(translationPath, `${lang}_${filename}`);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/files/:filename', (req, res) => {
    try {
        const { filename } = req.params;
        const filePath = path.join(UPLOADS_DIR, filename);
        
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: '文件不存在' });
        }
        
        fs.unlinkSync(filePath);
        
        const langs = fs.readdirSync(TRANSLATIONS_DIR).filter(dir => 
            fs.statSync(path.join(TRANSLATIONS_DIR, dir)).isDirectory()
        );
        
        langs.forEach(lang => {
            const translationPath = path.join(TRANSLATIONS_DIR, lang, filename);
            if (fs.existsSync(translationPath)) {
                fs.unlinkSync(translationPath);
            }
        });
        
        res.json({ success: true, message: '文件删除成功' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/translations/:lang/:filename', (req, res) => {
    try {
        const { lang, filename } = req.params;
        const translationPath = path.join(TRANSLATIONS_DIR, lang, filename);
        
        if (!fs.existsSync(translationPath)) {
            return res.status(404).json({ error: '翻译文件不存在' });
        }
        
        fs.unlinkSync(translationPath);
        res.json({ success: true, message: '翻译文件删除成功' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/translations-list/:lang', (req, res) => {
    try {
        const { lang } = req.params;
        const langDir = path.join(TRANSLATIONS_DIR, lang);
        
        if (!fs.existsSync(langDir)) {
            return res.json([]);
        }
        
        const files = fs.readdirSync(langDir).filter(file => 
            path.extname(file) === '.json'
        );
        
        const filesWithInfo = files.map(file => {
            const filePath = path.join(langDir, file);
            const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            const totalKeys = Object.keys(content).length;
            const translatedKeys = Object.values(content).filter(val => val && val.trim()).length;
            
            return {
                name: file,
                totalKeys,
                translatedKeys,
                progress: totalKeys > 0 ? Math.round((translatedKeys / totalKeys) * 100) : 0
            };
        });
        
        res.json(filesWithInfo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`翻译平台服务运行在 http://localhost:${PORT}`);
});
