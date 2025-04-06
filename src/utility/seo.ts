/**
 * Utility functions for SEO optimization
 */

/**
 * Updates the page's metadata for SEO
 * 
 * @param title The page title
 * @param description The page description
 * @param image The OG image URL (optional)
 */
export function updateMetadata(
  title: string,
  description: string,
  image?: string
): void {
  // Update document title
  document.title = title ? `${title} | Guitar God` : 'Guitar God - Interactive Guitar Learning App';
  
  // Find existing meta tags or create them
  let descriptionTag = document.querySelector('meta[name="description"]');
  if (!descriptionTag) {
    descriptionTag = document.createElement('meta');
    descriptionTag.setAttribute('name', 'description');
    document.head.appendChild(descriptionTag);
  }
  descriptionTag.setAttribute('content', description);
  
  // Open Graph tags
  updateMetaTag('og:title', title || 'Guitar God - Interactive Guitar Learning App');
  updateMetaTag('og:description', description);
  
  if (image) {
    updateMetaTag('og:image', image);
  }
  
  // Twitter Card tags
  updateMetaTag('twitter:card', 'summary_large_image');
  updateMetaTag('twitter:title', title || 'Guitar God - Interactive Guitar Learning App');
  updateMetaTag('twitter:description', description);
  
  if (image) {
    updateMetaTag('twitter:image', image);
  }
}

/**
 * Update or create a meta tag
 */
function updateMetaTag(name: string, content: string): void {
  // Try to find an existing tag
  let tag = document.querySelector(`meta[property="${name}"]`);
  
  // If it doesn't exist, try with name attribute instead of property
  if (!tag) {
    tag = document.querySelector(`meta[name="${name}"]`);
  }
  
  // If it still doesn't exist, create it
  if (!tag) {
    tag = document.createElement('meta');
    
    // Use property for Open Graph and name for others
    if (name.startsWith('og:')) {
      tag.setAttribute('property', name);
    } else {
      tag.setAttribute('name', name);
    }
    
    document.head.appendChild(tag);
  }
  
  // Set the content
  tag.setAttribute('content', content);
}

/**
 * Generates structured data for a guitar-related page
 * 
 * @param data Object containing data for the structured data
 * @returns JSON-LD script element
 */
export function generateStructuredData(data: {
  type: 'HowTo' | 'Article' | 'FAQPage';
  name: string;
  description: string;
  image?: string;
  author?: string;
  datePublished?: string;
  steps?: Array<{ name: string; text: string; image?: string }>;
  faqs?: Array<{ question: string; answer: string }>;
}): HTMLScriptElement {
  let structuredData;
  
  switch (data.type) {
    case 'HowTo':
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        'name': data.name,
        'description': data.description,
        'image': data.image,
        'step': data.steps?.map((step, index) => ({
          '@type': 'HowToStep',
          'position': index + 1,
          'name': step.name,
          'text': step.text,
          'image': step.image
        }))
      };
      break;
      
    case 'Article':
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        'headline': data.name,
        'description': data.description,
        'image': data.image,
        'author': {
          '@type': 'Person',
          'name': data.author
        },
        'datePublished': data.datePublished
      };
      break;
      
    case 'FAQPage':
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': data.faqs?.map(faq => ({
          '@type': 'Question',
          'name': faq.question,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': faq.answer
          }
        }))
      };
      break;
  }
  
  // Create the script element
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.innerHTML = JSON.stringify(structuredData);
  
  return script;
}