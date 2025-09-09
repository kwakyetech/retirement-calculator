# Retirement Income Calculator

🚀 **[Live Demo: https://retirementscalc.netlify.app/](https://retirementscalc.netlify.app/)**

A comprehensive web-based retirement planning tool that helps users calculate their projected retirement income based on current financial situation and retirement goals.

## Features

- **Interactive Calculator**: Real-time calculations as you input your financial data
- **Multiple Scenarios**: Compare different retirement planning scenarios
- **Comprehensive Inputs**: Current age, retirement age, income, savings, contribution rates, and market assumptions
- **Visual Results**: Clear display of projected retirement income and recommendations
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **No Dependencies**: Pure HTML, CSS, and JavaScript - no frameworks required

## Project Structure

```
retirement-calculator/
├── index.html          # Main HTML file with the calculator interface
├── app.js             # JavaScript logic for calculations and interactions
├── style.css          # CSS styles and responsive design
├── .vscode/           # VS Code settings (optional)
│   └── settings.json
└── README.md          # This documentation file
```

## Quick Start

### Option 1: Open Directly in Browser
1. Download or clone this repository
2. Open `index.html` in any modern web browser
3. Start using the calculator immediately

### Option 2: Local Web Server (Recommended)
1. Navigate to the project directory
2. Start a local web server:

   **Using Python:**
   ```bash
   python -m http.server 8000
   ```
   
   **Using Node.js:**
   ```bash
   npx serve .
   ```
   
   **Using PHP:**
   ```bash
   php -S localhost:8000
   ```

3. Open your browser and go to `http://localhost:8000`

## Deployment Options

### Static Hosting Services

This application can be deployed to any static hosting service:

#### Netlify
1. Create account at [netlify.com](https://netlify.com)
2. Drag and drop the project folder to Netlify dashboard
3. Your app will be live instantly with a custom URL

#### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project directory
3. Follow the prompts to deploy

#### GitHub Pages
1. Push code to a GitHub repository
2. Go to repository Settings → Pages
3. Select source branch (usually `main`)
4. Your app will be available at `https://username.github.io/repository-name`

#### AWS S3 + CloudFront
1. Create an S3 bucket with static website hosting enabled
2. Upload all files to the bucket
3. Configure CloudFront distribution for global CDN
4. Set up custom domain if needed

### Traditional Web Hosting

Upload all files to any web hosting provider that supports static files:
- Upload `index.html`, `app.js`, `style.css` to your web root directory
- Ensure `index.html` is set as the default page
- No server-side configuration required

## Technical Details

### Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Mobile browsers (iOS Safari, Chrome Mobile)

### Performance
- **Load Time**: < 1 second on 3G connection
- **Bundle Size**: ~50KB total (HTML + CSS + JS)
- **No External Dependencies**: All code is self-contained

### Security
- All calculations performed client-side
- No data transmitted to external servers
- No cookies or local storage used
- Safe for sensitive financial information

## Customization

### Styling
Modify `style.css` to customize:
- Color scheme (CSS custom properties at the top)
- Layout and spacing
- Typography
- Responsive breakpoints

### Calculations
Modify `app.js` to adjust:
- Default values
- Calculation formulas
- Input validation rules
- Result formatting

### Content
Modify `index.html` to change:
- Text content and labels
- Form structure
- Meta information

## Development

### Local Development
1. Clone the repository
2. Open in your preferred code editor
3. Start a local server (see Quick Start options)
4. Make changes and refresh browser to see updates

### Code Structure

**HTML (`index.html`)**
- Semantic HTML5 structure
- Accessible form elements with proper labels
- Results display sections

**CSS (`style.css`)**
- CSS custom properties for theming
- Mobile-first responsive design
- Modern CSS features (Grid, Flexbox)

**JavaScript (`app.js`)**
- ES6+ syntax
- Modular class-based architecture
- Event-driven updates
- Input validation and error handling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For issues or questions:
1. Check existing issues in the repository
2. Create a new issue with detailed description
3. Include browser version and steps to reproduce

---

**Note**: This calculator provides estimates based on the inputs provided. Consult with a financial advisor for personalized retirement planning advice.