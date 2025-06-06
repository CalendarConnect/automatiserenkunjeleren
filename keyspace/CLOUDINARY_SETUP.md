# Cloudinary Setup Instructions

## 🚀 Gratis Cloudinary Account Aanmaken

1. **Ga naar**: https://cloudinary.com/users/register/free
2. **Maak gratis account aan** (25 credits/maand, 25GB storage)
3. **Bevestig je email**

## ⚙️ Environment Variables Setup

Voeg deze variabelen toe aan je `.env.local` bestand:

```env
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=djio4wfos
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=kanaal-headers
```

## 🔧 Cloudinary Dashboard Setup

### 1. Cloud Name vinden:
- Log in op Cloudinary dashboard
- Rechts bovenin zie je: **Cloud name: `jouw-cloud-name`**
- Kopieer deze naar `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`

### 2. Upload Preset maken:
1. Ga naar **Settings** → **Upload**
2. Scroll naar **Upload presets**
3. Klik **Add upload preset**
4. Configuratie:
   - **Preset name**: `kanaal-headers`
   - **Signing Mode**: `Unsigned`
   - **Folder**: `kanaal-headers`
   - **Allowed formats**: `jpg,jpeg,png,webp`
   - **Max file size**: `10000000` (10MB)
   - **Max image width**: `2000`
   - **Max image height**: `2000`
5. **Save**
6. Gebruik `kanaal-headers` als `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`

## ✅ Features die nu werken:

- **📤 Drag & drop upload**
- **✂️ Automatische cropping** naar LinkedIn banner formaat (1584x396px)  
- **🎯 Aspect ratio lock** (4:1)
- **📱 Responsive images**
- **⚡ Automatische optimalisatie** (WebP, compressie)
- **📁 Georganiseerde opslag** in `kanaal-headers` folder
- **🔄 Fallback naar URL input** voor flexibiliteit

## 🎨 LinkedIn Banner Specificaties:

- **Formaat**: 1584x396 pixels
- **Aspect ratio**: 4:1
- **Max bestandsgrootte**: 10MB
- **Ondersteunde formaten**: JPG, PNG, WebP

## 🛠️ Development Mode:

Als je nog geen Cloudinary account hebt, werkt de component in demo modus met Cloudinary's demo account. Voor productie gebruik MOET je je eigen account configureren.

## 💡 Tips:

- **Gratis tier** is ruim voldoende voor kleinere projecten
- **Automatische optimization** bespaart bandbreedte
- **CDN delivery** voor snelle laadtijden wereldwijd
- **Cropping tool** zorgt voor consistente banner formaten 