const API_BASE = '/api';
let currentFile = null;
let currentLanguage = 'ar';
let originalFiles = [];
let currentLanguages = [];

const langNames = {
    ar: '阿拉伯语',
    tr: '土耳其语',
    pt: '葡萄牙语',
    en: '英语',
    de: '德语'
};

document.addEventListener('DOMContentLoaded', () => {
    initEventListeners();
    loadLanguages();
    loadFiles();
});

function initEventListeners() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const currentLangSelect = document.getElementById('currentLang');
    const addLangBtn = document.getElementById('addLangBtn');
    const modal = document.getElementById('modal');
    const cancelAddLang = document.getElementById('cancelAddLang');
    const confirmAddLang = document.getElementById('confirmAddLang');
    const newLangInput = document.getElementById('newLangInput');

    uploadArea.addEventListener('click', () => fileInput.click());
    
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('drag-over');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        if (e.dataTransfer.files.length > 0) {
            handleFileUpload(e.dataTransfer.files[0]);
        }
    });
    
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFileUpload(e.target.files[0]);
        }
    });

    currentLangSelect.addEventListener('change', (e) => {
        currentLanguage = e.target.value;
        loadFiles();
        closeTranslationSection();
    });

    addLangBtn.addEventListener('click', () => {
        modal.style.display = 'flex';
        newLangInput.value = '';
        newLangInput.focus();
    });

    cancelAddLang.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    confirmAddLang.addEventListener('click', async () => {
        const lang = newLangInput.value.toLowerCase().trim();
        if (!lang || lang.length !== 2) {
            alert('请输入有效的2位语言代码');
            return;
        }

        try {
            const response = await fetch(`${API_BASE}/languages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lang })
            });

            const result = await response.json();
            if (result.success) {
                alert(result.message);
                modal.style.display = 'none';
                await loadLanguages();
                loadFiles();
            } else {
                alert(result.error || '添加语言失败');
            }
        } catch (error) {
            alert('添加语言失败: ' + error.message);
        }
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    document.getElementById('closeTranslationBtn').addEventListener('click', closeTranslationSection);
    document.getElementById('saveTranslationsBtn').addEventListener('click', saveTranslations);
    document.getElementById('downloadTranslationBtn').addEventListener('click', downloadTranslation);
    document.getElementById('downloadAllBtn').addEventListener('click', downloadAllTranslations);
    document.getElementById('deleteFileBtn').addEventListener('click', deleteCurrentFile);
}

async function loadLanguages() {
    try {
        const response = await fetch(`${API_BASE}/languages`);
        const languages = await response.json();
        
        const select = document.getElementById('currentLang');
        const currentValue = select.value;
        
        select.innerHTML = '';
        languages.forEach(lang => {
            const option = document.createElement('option');
            option.value = lang;
            option.textContent = `${langNames[lang] || lang} (${lang})`;
            select.appendChild(option);
        });
        
        if (languages.includes(currentValue)) {
            select.value = currentValue;
        } else if (languages.length > 0) {
            select.value = languages[0];
            currentLanguage = languages[0];
        }
    } catch (error) {
        console.error('加载语言列表失败:', error);
    }
}

async function loadFiles() {
    try {
        const response = await fetch(`${API_BASE}/translations-list/${currentLanguage}`);
        const files = await response.json();
        
        const filesGrid = document.getElementById('filesGrid');
        
        if (files.length === 0) {
            filesGrid.innerHTML = '<p class="no-files">暂无翻译文件，请先上传 JSON 文件</p>';
            return;
        }
        
        const originalResponse = await fetch(`${API_BASE}/files`);
        originalFiles = await originalResponse.json();
        
        filesGrid.innerHTML = files.map(file => {
            const originalFile = originalFiles.find(f => f.name === file.name);
            const keyCount = originalFile ? originalFile.keys.length : 0;
            
            return `
                <div class="file-card">
                    <h3>${file.name}</h3>
                    <p>总词条数: ${keyCount}</p>
                    <p>已翻译: ${file.translatedKeys}</p>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${file.progress}%"></div>
                    </div>
                    <p>翻译进度: ${file.progress}%</p>
                    <div class="file-actions">
                        <button onclick="openTranslation('${file.name}')">翻译</button>
                        <button onclick="downloadTranslationFile('${file.name}')">下载</button>
                        <button class="danger" onclick="deleteTranslationFile('${file.name}')">删除</button>
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('加载文件列表失败:', error);
        document.getElementById('filesGrid').innerHTML = '<p class="no-files">加载文件列表失败</p>';
    }
}

async function handleFileUpload(file) {
    if (!file.name.endsWith('.json')) {
        showStatus('只允许上传 JSON 文件', 'error');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(`${API_BASE}/upload`, {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        if (result.success) {
            showStatus(result.message, 'success');
            await loadLanguages();
            loadFiles();
        } else {
            showStatus(result.error || '上传失败', 'error');
        }
    } catch (error) {
        showStatus('上传失败: ' + error.message, 'error');
    }
}

function showStatus(message, type) {
    const status = document.getElementById('uploadStatus');
    status.textContent = message;
    status.className = `status ${type}`;
    
    setTimeout(() => {
        status.className = 'status';
    }, 3000);
}

async function openTranslation(filename) {
    currentFile = filename;
    
    try {
        const allTranslationsResponse = await fetch(`${API_BASE}/all-translations/${filename}`);
        const allTranslations = await allTranslationsResponse.json();
        
        document.getElementById('currentFileName').textContent = filename;
        
        currentLanguages = Object.keys(allTranslations.translations);
        
        const tableHeader = document.getElementById('tableHeader');
        let headerHTML = `
            <div class="col-key">词条 Key</div>
            <div class="col-original">原文 (中文)</div>
        `;
        
        currentLanguages.forEach(lang => {
            headerHTML += `<div class="col-lang">${langNames[lang] || lang} (${lang})</div>`;
        });
        tableHeader.innerHTML = headerHTML;
        
        const rows = document.getElementById('translationRows');
        const keys = Object.keys(allTranslations.original);
        
        rows.innerHTML = keys.map(key => {
            let rowHTML = `
                <div class="translation-row" data-key="${key}">
                    <div class="col-key">${key}</div>
                    <div class="col-original">${escapeHtml(allTranslations.original[key])}</div>
            `;
            
            currentLanguages.forEach(lang => {
                const value = allTranslations.translations[lang] && allTranslations.translations[lang][key] 
                    ? allTranslations.translations[lang][key] 
                    : '';
                rowHTML += `
                    <div class="col-lang">
                        <input type="text" 
                               data-lang="${lang}" 
                               data-key="${key}"
                               value="${escapeHtml(value)}" 
                               placeholder="输入${langNames[lang] || lang}翻译">
                    </div>
                `;
            });
            
            rowHTML += '</div>';
            return rowHTML;
        }).join('');
        
        document.getElementById('translationSection').style.display = 'block';
        document.querySelector('.files-section').style.display = 'none';
    } catch (error) {
        alert('加载翻译数据失败: ' + error.message);
    }
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function closeTranslationSection() {
    document.getElementById('translationSection').style.display = 'none';
    document.querySelector('.files-section').style.display = 'block';
    currentFile = null;
}

async function saveTranslations() {
    if (!currentFile) return;
    
    const translations = {};
    currentLanguages.forEach(lang => {
        translations[lang] = {};
    });
    
    const inputs = document.querySelectorAll('.translation-row input');
    inputs.forEach(input => {
        const lang = input.dataset.lang;
        const key = input.dataset.key;
        if (lang && key) {
            translations[lang][key] = input.value;
        }
    });
    
    try {
        const response = await fetch(`${API_BASE}/all-translations/${currentFile}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ translations })
        });
        
        const result = await response.json();
        if (result.success) {
            alert('所有语言翻译保存成功');
            loadFiles();
        } else {
            alert('保存失败: ' + (result.error || '未知错误'));
        }
    } catch (error) {
        alert('保存失败: ' + error.message);
    }
}

async function downloadTranslation() {
    if (!currentFile) return;
    downloadTranslationFile(currentFile);
}

async function downloadTranslationFile(filename) {
    try {
        const response = await fetch(`${API_BASE}/download/${currentLanguage}/${filename}`);
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${currentLanguage}_${filename}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } else {
            alert('下载失败');
        }
    } catch (error) {
        alert('下载失败: ' + error.message);
    }
}

async function deleteCurrentFile() {
    if (!currentFile) return;
    deleteFile(currentFile);
}

async function deleteTranslationFile(filename) {
    deleteFile(filename);
}

async function deleteFile(filename) {
    if (confirm('确定要删除这个文件及其所有语言的翻译吗？此操作不可撤销，将删除原始文件和所有语言的翻译文件。')) {
        try {
            const response = await fetch(`${API_BASE}/files/${filename}`, {
                method: 'DELETE'
            });
            
            const result = await response.json();
            if (result.success) {
                alert(result.message);
                if (currentFile === filename) {
                    closeTranslationSection();
                }
                loadFiles();
            } else {
                alert('删除失败: ' + (result.error || '未知错误'));
            }
        } catch (error) {
            alert('删除失败: ' + error.message);
        }
    }
}

async function downloadAllTranslations() {
    if (!currentFile) return;
    
    for (const lang of currentLanguages) {
        try {
            const response = await fetch(`${API_BASE}/download/${lang}/${currentFile}`);
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${lang}_${currentFile}`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        } catch (error) {
            console.error(`下载 ${lang} 翻译失败:`, error);
        }
    }
}
