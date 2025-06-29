#!/usr/bin/env python3
"""
WEBS-36: OG Image Generator for Aethron Technology
Creates 1200x630px Open Graph images for each page/language combination
"""

from PIL import Image, ImageDraw, ImageFont
import os
import json

# Aethron Brand Colors
COLORS = {
    'blue': '#0066cc',
    'blue_dark': '#004499',
    'orange': '#ff6600',
    'white': '#ffffff',
    'black': '#000000',
    'gray': '#f5f5f5',
    'gray_dark': '#333333'
}

# OG Image dimensions (Facebook/Twitter standard)
OG_WIDTH = 1200
OG_HEIGHT = 630

# Page configurations
PAGES = {
    'en': {
        'home': {
            'title': 'Aethron Technology',
            'subtitle': 'People-centric software. Flexible. Reliable. Smart.',
            'description': 'Technology in service of people'
        },
        'about': {
            'title': 'About Aethron Technology',
            'subtitle': 'People-centric Software Solutions',
            'description': 'Our mission, story and approach'
        },
        'solutions': {
            'title': 'Our Solutions',
            'subtitle': 'Technology That Works for People',
            'description': 'Flexible technological solutions'
        },
        'contact': {
            'title': 'Contact',
            'subtitle': 'Let\'s Build Something Great Together',
            'description': 'Get in touch with our team'
        },
        'privacy': {
            'title': 'Privacy Policy',
            'subtitle': 'Your Privacy Matters',
            'description': 'How we protect your data'
        },
        'terms': {
            'title': 'Terms of Service',
            'subtitle': 'Service Agreement',
            'description': 'Terms and conditions'
        }
    },
    'nl': {
        'home': {
            'title': 'Aethron Technology',
            'subtitle': 'Mensgerichte software. Flexibel. Betrouwbaar. Slim.',
            'description': 'Technologie in dienst van mensen'
        },
        'about': {
            'title': 'Over Aethron Technology',
            'subtitle': 'Mensgerichte Software Oplossingen',
            'description': 'Onze missie, verhaal en aanpak'
        },
        'solutions': {
            'title': 'Onze Oplossingen',
            'subtitle': 'Technologie Die Werkt voor Mensen',
            'description': 'Flexibele technologische oplossingen'
        },
        'contact': {
            'title': 'Contact',
            'subtitle': 'Laten We Samen Iets Geweldigs Bouwen',
            'description': 'Neem contact op met ons team'
        },
        'privacy': {
            'title': 'Privacybeleid',
            'subtitle': 'Uw Privacy Is Belangrijk',
            'description': 'Hoe we uw gegevens beschermen'
        },
        'terms': {
            'title': 'Algemene Voorwaarden',
            'subtitle': 'Service Overeenkomst',
            'description': 'Voorwaarden en bepalingen'
        }
    }
}

def create_og_image(page_data, lang, page_name, output_dir):
    """Create an OG image for a specific page"""
    
    # Create image with white background
    img = Image.new('RGB', (OG_WIDTH, OG_HEIGHT), COLORS['white'])
    draw = ImageDraw.Draw(img)
    
    # Add blue background element (left side)
    blue_width = 400
    draw.rectangle([0, 0, blue_width, OG_HEIGHT], fill=COLORS['blue'])
    
    # Add orange accent bar
    accent_width = 8
    draw.rectangle([blue_width, 0, blue_width + accent_width, OG_HEIGHT], fill=COLORS['orange'])
    
    # Try to load fonts (fallback to default if not available)
    try:
        title_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 52)
        subtitle_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 28)
        description_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 24)
        logo_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 32)
    except:
        # Fallback to default font
        title_font = ImageFont.load_default()
        subtitle_font = ImageFont.load_default()
        description_font = ImageFont.load_default()
        logo_font = ImageFont.load_default()
    
    # Add logo/brand text on blue background
    logo_text = "AETHRON"
    tagline_text = "TECHNOLOGY"
    
    # Calculate logo position (centered vertically on blue area)
    logo_bbox = draw.textbbox((0, 0), logo_text, font=logo_font)
    logo_width = logo_bbox[2] - logo_bbox[0]
    logo_height = logo_bbox[3] - logo_bbox[1]
    
    tagline_bbox = draw.textbbox((0, 0), tagline_text, font=subtitle_font)
    tagline_width = tagline_bbox[2] - tagline_bbox[0]
    tagline_height = tagline_bbox[3] - tagline_bbox[1]
    
    # Position logo centered on blue background
    logo_x = (blue_width - logo_width) // 2
    logo_y = (OG_HEIGHT - logo_height - tagline_height - 20) // 2
    
    tagline_x = (blue_width - tagline_width) // 2
    tagline_y = logo_y + logo_height + 20
    
    # Draw logo and tagline
    draw.text((logo_x, logo_y), logo_text, font=logo_font, fill=COLORS['white'])
    draw.text((tagline_x, tagline_y), tagline_text, font=subtitle_font, fill=COLORS['white'])
    
    # Add page content on white background
    content_x = blue_width + accent_width + 40
    content_width = OG_WIDTH - content_x - 40
    
    # Title
    title = page_data['title']
    title_y = 80
    
    # Wrap title text if too long
    wrapped_title = wrap_text(draw, title, title_font, content_width)
    for i, line in enumerate(wrapped_title):
        draw.text((content_x, title_y + i * 60), line, font=title_font, fill=COLORS['gray_dark'])
    
    # Subtitle
    subtitle = page_data['subtitle']
    subtitle_y = title_y + len(wrapped_title) * 60 + 40
    
    wrapped_subtitle = wrap_text(draw, subtitle, subtitle_font, content_width)
    for i, line in enumerate(wrapped_subtitle):
        draw.text((content_x, subtitle_y + i * 35), line, font=subtitle_font, fill=COLORS['blue'])
    
    # Description
    description = page_data['description']
    description_y = subtitle_y + len(wrapped_subtitle) * 35 + 30
    
    wrapped_description = wrap_text(draw, description, description_font, content_width)
    for i, line in enumerate(wrapped_description):
        draw.text((content_x, description_y + i * 30), line, font=description_font, fill=COLORS['gray_dark'])
    
    # Add language indicator
    lang_indicator = "EN" if lang == 'en' else "NL"
    lang_bbox = draw.textbbox((0, 0), lang_indicator, font=subtitle_font)
    lang_width = lang_bbox[2] - lang_bbox[0]
    
    # Position language indicator in bottom right
    lang_x = OG_WIDTH - lang_width - 30
    lang_y = OG_HEIGHT - 60
    
    # Draw language indicator background
    draw.rectangle([lang_x - 10, lang_y - 10, lang_x + lang_width + 10, lang_y + 35], 
                   fill=COLORS['orange'])
    draw.text((lang_x, lang_y), lang_indicator, font=subtitle_font, fill=COLORS['white'])
    
    # Save image
    filename = f"og-{page_name}-{lang}.png"
    filepath = os.path.join(output_dir, filename)
    img.save(filepath, "PNG", quality=95)
    print(f"Created: {filename}")

def wrap_text(draw, text, font, max_width):
    """Wrap text to fit within max_width"""
    words = text.split()
    lines = []
    current_line = []
    
    for word in words:
        test_line = ' '.join(current_line + [word])
        bbox = draw.textbbox((0, 0), test_line, font=font)
        if bbox[2] - bbox[0] <= max_width:
            current_line.append(word)
        else:
            if current_line:
                lines.append(' '.join(current_line))
                current_line = [word]
            else:
                lines.append(word)
    
    if current_line:
        lines.append(' '.join(current_line))
    
    return lines

def main():
    # Get script directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    output_dir = os.path.join(script_dir, 'src', 'assets', 'images', 'og')
    
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    print("Generating OG images for Aethron Technology...")
    print(f"Output directory: {output_dir}")
    print(f"Image size: {OG_WIDTH}x{OG_HEIGHT}px")
    print("-" * 50)
    
    # Generate images for each page and language
    for lang in PAGES:
        for page_name, page_data in PAGES[lang].items():
            create_og_image(page_data, lang, page_name, output_dir)
    
    print("-" * 50)
    print(f"Generated {len(PAGES['en']) + len(PAGES['nl'])} OG images successfully!")
    print("\nNext steps:")
    print("1. Update head.njk to include OG image meta tags")
    print("2. Test images in social media sharing debuggers")
    print("3. Optimize images if needed")

if __name__ == "__main__":
    main()
