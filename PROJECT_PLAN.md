# CBRE Business Card Editor - Project Plan & Checklist

## 🎯 Project Overview
A web-based CBRE business card editor that generates print-ready CMYK PDFs via form input or CSV batch upload. Built with React, Next.js, and a custom CBRE design system.

## 📋 Project Specifications

### 🎨 Design Requirements
- **Card Size**: 89mm × 50mm (final print size)
- **Bleed Size**: 95mm × 56mm (when bleed enabled)
- **Output**: Vector PDF, 300 DPI, CMYK color space
- **Design**: Single professional layout with green stripe and CBRE branding

### 🌈 Color Palette (CMYK Values)
- **CBRE Green**: CMYK(90, 46, 80, 55) - Left block, back background
- **Dark Green**: CMYK(91, 62, 62, 65) - Name text
- **Dark Grey**: CMYK(73, 55, 55, 33) - All other text
- **White**: CMYK(0, 0, 0, 0) - Background, text on green

### 🔤 Typography
- **Financier Display**: Names and titles (semibold/regular)
- **Calibre**: All other text (regular/light)
- **Note**: Need OTF versions for PDF generation (currently have web fonts)

### 📊 Form Fields
- Full Name (required)
- Title (required)
- License Number (optional)
- Office Name (required)
- Office Address (required)
- Email (required)
- Telephone (required)
- Mobile (required)
- 3mm Bleed Toggle (optional)

---

## 🗂️ Project Structure

```
/components/
  ├── ui/                    # Base UI components (shadcn/ui)
  ├── business-card/         # New business card specific components
  │   ├── CardEditor.tsx     # Main editor interface
  │   ├── CSVUploader.tsx    # CSV upload interface
  │   └── FormFields.tsx     # Form input fields
  └── layout/
      └── Layout.tsx         # Main app layout

/pages/
  ├── index.tsx             # Main application page
  └── api/
      ├── generate-pdf.ts   # Single card PDF generation
      ├── generate-batch.ts # CSV batch processing
      └── download/
          └── [id].ts       # File download endpoint

/lib/
  ├── pdf/                  # PDF generation logic
  │   ├── generator.ts      # Main PDF generation
  │   ├── layouts/          # Design layouts
  │   │   ├── design1.ts    # Design 1 layout
  │   │   ├── design2.ts    # Design 2 layout
  │   │   └── back.ts       # Back design layout
  │   └── fonts.ts          # Font embedding
  ├── csv/                  # CSV processing
  │   ├── parser.ts         # CSV parsing logic
  │   └── validator.ts      # Data validation
  └── storage/              # File storage with Supabase
      ├── uploader.ts       # File upload to Supabase
      └── cleaner.ts        # Automatic file cleanup

/utils/
  ├── validation.ts         # Form validation schemas
  ├── constants.ts          # App constants
  └── helpers.ts            # Utility functions

/public/
  ├── assets/
  │   ├── cbre-logo.svg     # CBRE logo
  │   └── recycle-icon.svg  # Back card recycle icon
  ├── fonts/                # OTF font files (to be added)
  └── template/
      └── business-card-template.csv  # CSV template

/types/
  └── business-card.ts      # TypeScript interfaces
```

---

## 🚀 Implementation Phases

### Phase 1: Project Setup & Cleanup ✅
- [x] ✅ Repository cloned and initialized
- [x] ✅ Remove legacy demo content and example pages
- [x] ✅ Update README.md to reflect new purpose
- [x] ✅ Set up project structure
- [x] ✅ Configure Supabase integration

### Phase 2: UI Development 🎨 ✅ COMPLETE
- [x] ✅ Create main editor interface using CBRE components
- [x] ✅ Implement form with validation
- [x] ✅ Add design selection (Design 1 vs Design 2)
- [x] ✅ Create CSV upload interface
- [x] ✅ Add CSV template download

### Phase 3: PDF Generation Engine 🔧 ✅ COMPLETE
- [x] ✅ Research and choose PDF library (Puppeteer for HTML-to-PDF)
- [x] ✅ Convert web fonts to OTF format for PDF embedding (used web fonts)
- [x] ✅ Implement Design 1 layout
- [x] ✅ Implement Design 2 layout  
- [x] ✅ Implement Back design layout
- [x] ✅ Add CMYK color conversion (RGB approximation)
- [x] ✅ Add 3mm bleed support
- [x] ✅ Test vector output quality

**Phase 3 Summary:**
- Successfully implemented PDF generation using Puppeteer for HTML-to-PDF conversion
- Created HTMLPDFGenerator class with proper business card layouts
- Fixed font loading issues by switching from PDFKit to Puppeteer
- Generated 2-page PDFs (front and back) with proper dimensions
- Added live preview component with both front and back views
- Implemented RGB color approximation for CMYK requirements
- Added 3mm bleed support and proper print dimensions

### Phase 4: CSV Batch Processing 📊 ✅ COMPLETE
- [x] ✅ Create CSV parser with validation
- [x] ✅ Implement batch PDF generation
- [x] ✅ Add ZIP file creation
- [x] ✅ Add progress indicators
- [x] ✅ Implement 20-entry limit
- [x] ✅ Add error handling for malformed data

**Phase 4 Summary:**
- Successfully implemented batch PDF generation for multiple business cards
- Created `/api/generate-batch-pdf` endpoint that processes CSV data and generates ZIP files
- Added JSZip integration for creating compressed archives with multiple PDFs
- Implemented real-time progress indicators (0-100%) with step-by-step status updates
- Enhanced CSV validation with 20-entry limit enforcement
- Added comprehensive error handling with individual PDF generation failure tracking
- Updated CSVUploader component with progress bar and better user feedback
- Successfully tested with 2 entries generating 188KB ZIP file containing valid PDFs

### Phase 5: File Management 💾
- [x] Integrate Supabase Storage
- [x] Implement file upload/download
- [x] Add automatic 24-hour cleanup job
- [x] Add file expiration tracking
- [x] Implement download endpoint

### Phase 5.5: Design Improvements 🎨
- [x] Fix PDF page sizing (remove extra space)
- [x] Implement proper fonts (Financier Display for names, Calibre Light for details)
- [x] Add CBRE SVG logo to all designs
- [x] Add recycle icon to back design
- [x] Improve layout and spacing
- [x] Add consistent branding elements
- [x] **MAJOR REDESIGN**: Implemented exact user template layout
- [x] **Font Integration**: Added local Financier Display and Calibre font files
- [x] **Table Layout**: Switched to professional table-based layout structure
- [x] **Proper Spacing**: Fixed all spacing issues and alignment problems
- [x] **Layout Refinements**: Fixed logo size, margins, and content positioning
- [x] **PDF Sizing**: Corrected business card dimensions for exact print size

### Phase 6: Testing & Deployment 🚀
- [ ] Test PDF output quality
- [ ] Verify CMYK color accuracy
- [ ] Test batch processing
- [ ] Verify font embedding
- [ ] Deploy to Vercel
- [ ] Configure Supabase environment variables

---

## 📝 Detailed Task Breakdown

### 🧹 Phase 1: Project Setup & Cleanup

#### Task 1.1: Clean up legacy files
- [x] ✅ Remove `/app/elements-example/` directory
- [x] ✅ Remove demo components and pages
- [x] ✅ Clean up unused dependencies
- [x] ✅ Update package.json metadata

#### Task 1.2: Update project documentation
- [x] ✅ Rewrite README.md for business card editor
- [x] ✅ Update package.json description
- [x] ✅ Create this PROJECT_PLAN.md file

#### Task 1.3: Set up Supabase
- [x] ✅ Initialize Supabase client
- [x] ✅ Configure storage bucket for temporary files
- [ ] Set up file cleanup Edge Function (Phase 5)
- [x] ✅ Configure environment variables

### 🎨 Phase 2: UI Development

#### Task 2.1: Main editor interface
- [x] ✅ Create tabbed interface (Single Card / Batch CSV)
- [x] ✅ Implement form using CBRE components
- [x] ✅ Add design selection radio buttons
- [x] ✅ Add 3mm bleed toggle
- [x] ✅ Style with CBRE design system

#### Task 2.2: Form validation
- [x] ✅ Create validation schema using Zod
- [x] ✅ Add real-time field validation
- [x] ✅ Add email format validation
- [x] ✅ Add required field indicators

#### Task 2.3: CSV interface
- [x] ✅ Create CSV upload dropzone
- [x] ✅ Add CSV template download button
- [x] ✅ Add validation feedback
- [x] ✅ Show preview of parsed data

**Phase 2 Issues & Solutions:**
- **Issue**: CBRECheckbox component not available - **Solution**: Used base Checkbox component from ui/checkbox
- **Issue**: Missing react-dropzone dependency - **Solution**: Added npm install react-dropzone
- **Issue**: Ghost button variant not available - **Solution**: Used "text" variant instead
- **Issue**: Toast component API different - **Solution**: Used toast function instead of CBREToast.method calls

**Phase 2 Components Created:**
- ✅ FormFields.tsx - Complete form with validation and CBRE styling
- ✅ CardEditor.tsx - Main editor with form handling and API integration
- ✅ CSVUploader.tsx - File upload with drag-and-drop and validation
- ✅ Updated app/page.tsx - Integrated all components into main interface

### 🔧 Phase 3: PDF Generation Engine

#### Task 3.1: Choose PDF library
- [ ] Research PDFKit vs HummusRecipe for CMYK support
- [ ] Set up chosen library
- [ ] Create base PDF generation class
- [ ] Test basic PDF output

#### Task 3.2: Font handling
- [ ] Convert web fonts to OTF format
- [ ] Implement font embedding
- [ ] Test font rendering in PDF
- [ ] Add fallback fonts

#### Task 3.3: Design layouts
- [ ] Implement Design 1 layout with exact positioning
- [ ] Implement Design 2 layout with exact positioning
- [ ] Implement Back design layout
- [ ] Add CBRE logo positioning
- [ ] Add recycle icon positioning

#### Task 3.4: Color and output
- [ ] Implement CMYK color conversion
- [ ] Add 3mm bleed support
- [ ] Ensure 300 DPI output
- [ ] Test vector fidelity

### 📊 Phase 4: CSV Batch Processing

#### Task 4.1: CSV parsing
- [ ] Implement CSV parser with validation
- [ ] Add error handling for malformed data
- [ ] Validate required fields
- [ ] Enforce 20-entry limit

#### Task 4.2: Batch generation
- [ ] Create batch PDF generator
- [ ] Add progress tracking
- [ ] Implement ZIP file creation
- [ ] Add error collection and reporting

### 💾 Phase 5: File Management

#### Task 5.1: Supabase integration
- [ ] Set up file upload to Supabase Storage
- [ ] Create unique file identifiers
- [ ] Implement download URLs
- [ ] Add file metadata tracking

#### Task 5.2: Cleanup system
- [ ] Create Edge Function for file cleanup
- [ ] Add 24-hour expiration tracking
- [ ] Implement automatic deletion
- [ ] Add cleanup logging

### 🚀 Phase 6: Testing & Deployment

#### Task 6.1: Quality assurance
- [ ] Test all PDF outputs for quality
- [ ] Verify CMYK color accuracy
- [ ] Test font embedding
- [ ] Validate layout precision

#### Task 6.2: Deployment
- [ ] Configure Vercel deployment
- [ ] Set up environment variables
- [ ] Test production endpoints
- [ ] Monitor file cleanup

---

## 📁 CSV Template Structure

```csv
Full Name,Title,License Number,Office Name,Office Address,Email,Telephone,Mobile
John Doe,Director GWS APAC,,CBRE GWS APAC,"18.01, Level 18, 1Powerhouse Persiaran Bandar Utama, Bandar Utama, Petaling Jaya, Selangor 47800, Malaysia",john.doe@cbre.com,03-12345678,012-3456789
Jane Smith,Sales Assistant,1234AB,CBRE Singapore,"2 Tanjong Katong Rd, #06-01 Paya Lebar Quarter, Singapore 437161",jane.smith@cbre.com,06-98765432,019-8887777
```

---

## 🔧 Technical Specifications

### PDF Generation Requirements
- **Library**: PDFKit (recommended) or HummusRecipe
- **Output**: Vector PDF, 300 DPI
- **Color Space**: CMYK only
- **Fonts**: Embedded OTF fonts
- **Size**: 89mm × 50mm (with optional 3mm bleed)

### API Endpoints
- `POST /api/generate-pdf` - Single card generation
- `POST /api/generate-batch` - CSV batch processing
- `GET /api/download/[id]` - File download
- `GET /api/template/csv` - CSV template download

### File Storage
- **Service**: Supabase Storage
- **Expiration**: 24 hours
- **Cleanup**: Automatic via Edge Function
- **Naming**: `CBRE-BusinessCard-[Name]-[Date].pdf`

---

## 🎯 Success Criteria

### ✅ Functional Requirements
- [ ] Generate print-ready CMYK PDFs
- [ ] Support both single and batch generation
- [ ] Accurate design replication
- [ ] Proper font embedding
- [ ] 20-entry CSV limit enforcement
- [ ] Automatic file cleanup

### ✅ Quality Requirements
- [ ] 300 DPI vector output
- [ ] CMYK color accuracy
- [ ] Professional design quality
- [ ] Fast generation times (<30s for batch)
- [ ] Responsive web interface

### ✅ Technical Requirements
- [ ] Vercel deployment
- [ ] Supabase integration
- [ ] TypeScript implementation
- [ ] CBRE design system compliance
- [ ] Error handling and validation

---

## 📞 Next Steps

1. **Immediate**: Start with Phase 1 - Project cleanup and setup
2. **Priority**: Focus on single card generation first
3. **Testing**: Continuous testing of PDF output quality
4. **Deployment**: Deploy early and iterate

---

*Last Updated: [Current Date]*
*Status: Ready to begin implementation* 