# CBRE Business Card Editor

A professional web-based business card editor that generates print-ready CMYK PDFs for CBRE employees. Built with React, Next.js, and the CBRE Web Elements design system.

## 🎯 Features

- **Single Card Generation**: Create individual business cards via form input
- **Batch Processing**: Upload CSV files to generate up to 20 cards at once
- **Print-Ready Output**: Vector PDFs at 300 DPI with CMYK color space
- **Professional Design**: CBRE-branded template with double-sided printing
- **Automatic Cleanup**: Files expire after 24 hours for security
- **Responsive Interface**: Works on desktop and mobile devices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn package manager
- Supabase account for file storage

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rizkinov/cbre-business-card-editor.git
   cd cbre-business-card-editor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 📋 Usage

### Single Card Generation

1. Select "Single Card" tab
2. Fill out the form with your information:
   - Full Name (required)
   - Title (required)
   - License Number (optional)
   - Office Name (required)
   - Office Address (required)
   - Email (required)
   - Telephone (required)
   - Mobile (required)
3. Toggle 3mm bleed if required
4. Click "Generate PDF"
5. Download your business card

### Batch Processing

1. Select "Batch CSV" tab
2. Download the CSV template
3. Fill the template with up to 20 entries
4. Upload your CSV file
5. Toggle 3mm bleed if required
6. Generate and download ZIP file containing all cards

### CSV Template Format

```csv
Full Name,Title,License Number,Office Name,Office Address,Email,Telephone,Mobile
John Doe,Director GWS APAC,,CBRE GWS APAC,"18.01, Level 18, 1Powerhouse Persiaran Bandar Utama, Bandar Utama, Petaling Jaya, Selangor 47800, Malaysia",john.doe@cbre.com,03-12345678,012-3456789
Jane Smith,Sales Assistant,1234AB,CBRE Singapore,"2 Tanjong Katong Rd, #06-01 Paya Lebar Quarter, Singapore 437161",jane.smith@cbre.com,06-98765432,019-8887777
```

## 🎨 Design Specifications

### Card Dimensions
- **Final Size**: 89mm × 50mm
- **With Bleed**: 95mm × 56mm (3mm bleed on all sides)
- **Resolution**: 300 DPI
- **Color Space**: CMYK

### Color Palette
- **CBRE Green**: CMYK(90, 46, 80, 55)
- **Dark Green**: CMYK(91, 62, 62, 65)
- **Dark Grey**: CMYK(73, 55, 55, 33)
- **White**: CMYK(0, 0, 0, 0)

### Typography
- **Financier Display**: Names and titles
- **Calibre**: All other text elements

## 🔧 Technical Stack

- **Frontend**: React 19 + Next.js 15
- **Styling**: Tailwind CSS 4.0 + CBRE Web Elements
- **PDF Generation**: PDFKit
- **File Storage**: Supabase Storage
- **Form Handling**: React Hook Form + Zod
- **CSV Processing**: PapaParse
- **Deployment**: Vercel

## 📁 Project Structure

```
cbre-business-card-editor/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main application page
│   └── api/               # API routes
├── src/
│   ├── components/        # React components
│   │   ├── ui/           # Base UI components
│   │   ├── cbre/         # CBRE-branded components
│   │   └── business-card/ # Business card specific components
│   └── lib/              # Utility libraries
├── public/               # Static assets
├── config/               # Configuration files
└── types/                # TypeScript type definitions
```

## 🔐 Security Features

- **File Expiration**: All generated files automatically expire after 24 hours
- **Input Validation**: Comprehensive form and CSV validation
- **Rate Limiting**: Prevents abuse of PDF generation endpoints
- **Secure Storage**: Files stored in Supabase with proper access controls

## 🚀 Deployment

### Deploy to Vercel

1. **Connect your repository to Vercel**
2. **Set environment variables in Vercel dashboard**
3. **Deploy**

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 📊 API Endpoints

- `POST /api/generate-pdf` - Generate single business card
- `POST /api/generate-batch` - Process CSV and generate batch
- `GET /api/download/[id]` - Download generated files
- `GET /api/template/csv` - Download CSV template

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `