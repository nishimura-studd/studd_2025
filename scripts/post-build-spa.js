#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const outDir = path.join(__dirname, '..', 'out')

console.log('🚀 レンタルサーバー用App Router設定を開始...')

// .htaccess ファイルを作成（レンタルサーバー対応版）
const htaccessContent = `# Rental Server Configuration
Options +FollowSymLinks
RewriteEngine On

# Add error page for debugging
ErrorDocument 404 /index.html

# Block RSC requests (return 403 instead of 404)
RewriteCond %{QUERY_STRING} _rsc= [NC]
RewriteRule ^(.*)$ - [F,L]

# Serve existing files and directories directly
RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule . - [L]

# App Router URL rewriting
# /about or /about/ -> about.html
RewriteRule ^about/?$ /about.html [L]

# /works or /works/ -> works.html
RewriteRule ^works/?$ /works.html [L]

# /works/ID or /works/ID/ -> works/ID.html
RewriteRule ^works/([0-9]+)/?$ /works/$1.html [L]

# Everything else -> index.html for SPA
RewriteRule ^(.*)$ /index.html [L]

# Cache static resources  
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType image/x-icon "access plus 1 year"
    ExpiresByType application/pdf "access plus 1 month"
    ExpiresDefault "access plus 1 week"
</IfModule>

# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>
`

fs.writeFileSync(path.join(outDir, '.htaccess'), htaccessContent)
console.log('✅ Created: .htaccess (for App Router on rental server)')

console.log('')
console.log('🎉 レンタルサーバー用App Router設定完了!')
console.log('📁 /out ディレクトリをそのままサーバーにアップロードしてください')
console.log('🌐 App Routerの静的ファイルとフォールバックルールが設定されました')