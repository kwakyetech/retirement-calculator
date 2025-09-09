# Deployment Guide

This guide provides detailed instructions for deploying the Retirement Income Calculator to various hosting platforms.

## Prerequisites

- All files in the project directory
- A modern web browser for testing
- Basic understanding of web hosting concepts

## Platform-Specific Deployment Instructions

### 1. Netlify (Recommended for Beginners)

**Method A: Drag & Drop**
1. Visit [netlify.com](https://netlify.com) and create an account
2. Go to your dashboard
3. Drag the entire project folder to the deployment area
4. Wait for deployment to complete
5. Your site will be live with a random URL (e.g., `https://amazing-app-123456.netlify.app`)

**Method B: Git Integration**
1. Push your code to GitHub, GitLab, or Bitbucket
2. Connect your repository to Netlify
3. Configure build settings:
   - Build command: (leave empty)
   - Publish directory: `/` (root)
4. Deploy automatically on every push

**Custom Domain Setup:**
```
1. Go to Site Settings → Domain Management
2. Add custom domain
3. Configure DNS records as instructed
4. SSL certificate will be automatically provisioned
```

### 2. Vercel

**CLI Deployment:**
```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to project directory
cd retirement-calculator

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - Project name: retirement-calculator
# - Directory: ./
```

**GitHub Integration:**
1. Push code to GitHub
2. Import project in Vercel dashboard
3. Configure:
   - Framework Preset: Other
   - Root Directory: ./
   - Build Command: (leave empty)
   - Output Directory: (leave empty)

### 3. GitHub Pages

**Setup:**
1. Create a GitHub repository
2. Upload all project files
3. Go to Settings → Pages
4. Source: Deploy from a branch
5. Branch: main (or master)
6. Folder: / (root)
7. Save

**Custom Domain (Optional):**
```
1. Add CNAME file with your domain name
2. Configure DNS:
   - CNAME record: www → username.github.io
   - A records: @ → GitHub Pages IPs
```

### 4. AWS S3 + CloudFront

**S3 Setup:**
```bash
# Create S3 bucket
aws s3 mb s3://your-retirement-calculator-bucket

# Upload files
aws s3 sync . s3://your-retirement-calculator-bucket --exclude ".git/*"

# Configure static website hosting
aws s3 website s3://your-retirement-calculator-bucket \
  --index-document index.html \
  --error-document index.html
```

**Bucket Policy:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-retirement-calculator-bucket/*"
    }
  ]
}
```

**CloudFront Distribution:**
```yaml
Origin Domain: your-retirement-calculator-bucket.s3-website-region.amazonaws.com
Viewer Protocol Policy: Redirect HTTP to HTTPS
Compress Objects Automatically: Yes
Default Root Object: index.html
Custom Error Pages:
  - Error Code: 404
  - Response Page Path: /index.html
  - Response Code: 200
```

### 5. Firebase Hosting

**Setup:**
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize project
firebase init hosting

# Configure:
# - Public directory: . (current directory)
# - Single-page app: No
# - Overwrite index.html: No

# Deploy
firebase deploy
```

**firebase.json Configuration:**
```json
{
  "hosting": {
    "public": ".",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

### 6. Traditional Web Hosting (cPanel/FTP)

**Via FTP:**
1. Connect to your hosting provider via FTP
2. Navigate to public_html or www directory
3. Upload all files:
   - index.html
   - app.js
   - style.css
   - README.md (optional)
4. Ensure index.html is in the root directory
5. Test by visiting your domain

**Via cPanel File Manager:**
1. Login to cPanel
2. Open File Manager
3. Navigate to public_html
4. Upload and extract files
5. Set proper file permissions (644 for files, 755 for directories)

## Environment-Specific Configurations

### Production Optimizations

**1. Minification (Optional)**
```bash
# Install terser for JS minification
npm install -g terser

# Minify JavaScript
terser app.js -o app.min.js -c -m

# Update index.html to reference app.min.js
```

**2. Gzip Compression**
Most hosting platforms enable this automatically. For manual setup:

**Apache (.htaccess):**
```apache
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
```

**Nginx:**
```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
```

### Security Headers

**Netlify (_headers file):**
```
/*
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Content-Security-Policy: default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self'
```

**Vercel (vercel.json):**
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

## Testing Deployment

### Pre-Deployment Checklist
- [ ] All files are present
- [ ] Links work correctly
- [ ] Calculator functions properly
- [ ] Responsive design works on mobile
- [ ] No console errors
- [ ] Fast loading times

### Post-Deployment Testing
1. **Functionality Test:**
   - Enter sample data
   - Verify calculations
   - Test form validation
   - Check responsive behavior

2. **Performance Test:**
   - Use Google PageSpeed Insights
   - Check loading times
   - Verify mobile performance

3. **Cross-Browser Test:**
   - Chrome, Firefox, Safari, Edge
   - Mobile browsers
   - Different screen sizes

## Troubleshooting

### Common Issues

**1. Files not loading:**
- Check file paths are correct
- Ensure proper file permissions
- Verify MIME types are configured

**2. Calculator not working:**
- Check browser console for JavaScript errors
- Verify all files are uploaded
- Test in different browsers

**3. Styling issues:**
- Check CSS file is loading
- Verify no conflicting styles
- Test responsive breakpoints

**4. Slow loading:**
- Enable compression
- Optimize images (if any added)
- Use CDN for global distribution

### Support Resources

- **Netlify:** [docs.netlify.com](https://docs.netlify.com)
- **Vercel:** [vercel.com/docs](https://vercel.com/docs)
- **GitHub Pages:** [docs.github.com/pages](https://docs.github.com/pages)
- **AWS:** [docs.aws.amazon.com/s3](https://docs.aws.amazon.com/s3)
- **Firebase:** [firebase.google.com/docs/hosting](https://firebase.google.com/docs/hosting)

---

**Next Steps:** After deployment, consider setting up monitoring, analytics, and regular backups for production use.