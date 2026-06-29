/**
 * SIG² - Sistema Integrado de Gente e Gestão
 * Servidor escrito em Node.js puro, sem dependências de pacotes do npm.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/save-logo') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const json = JSON.parse(body);
        const base64Data = json.image.replace(/^data:image\/png;base64,/, "");
        fs.writeFileSync('./src/assets/logo.png', base64Data, 'base64');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  if (req.method === 'POST' && req.url === '/log-error') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      console.log('--- BROWSER CONSOLE ERROR LOG ---');
      console.log(body);
      console.log('---------------------------------');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true }));
    });
    return;
  }

  let filePath = '.' + req.url;
  if (filePath === './') {
    filePath = './index.html';
  }

  // Remove parâmetros de busca (query parameters) da URL
  filePath = filePath.split('?')[0];

  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = MIME_TYPES[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>Arquivo Não Encontrado (404)</h1>', 'utf-8');
      } else {
        res.writeHead(500);
        res.end('Erro interno do servidor: ' + error.code + '\n');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log('======================================================');
  console.log('      SIG² - SISTEMA INTEGRADO DE GENTE E GESTÃO');
  console.log('======================================================');
  console.log(`\n[OK] Servidor rodando em: http://localhost:${PORT}`);
  console.log('     Abra seu navegador neste endereço para testar.');
  console.log('\n[INFO] Para encerrar o servidor, pressione Ctrl+C nesta janela.');
  console.log('======================================================');
});
