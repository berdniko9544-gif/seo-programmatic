/**
 * SCHEMA MARKUP GENERATOR
 * Generates rich structured data for better search visibility
 */

class SchemaGenerator {
  /**
   * Generate BreadcrumbList schema
   */
  static breadcrumb(items) {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": item.url
      }))
    };
  }

  /**
   * Generate Article schema
   */
  static article(data) {
    const {
      title,
      description,
      url,
      datePublished,
      dateModified,
      author = "1MB3",
      image = "/og-image.png",
      keywords = []
    } = data;

    return {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": title,
      "description": description,
      "url": url,
      "datePublished": datePublished || new Date().toISOString(),
      "dateModified": dateModified || new Date().toISOString(),
      "author": {
        "@type": "Person",
        "name": author
      },
      "publisher": {
        "@type": "Organization",
        "name": "1MB3",
        "logo": {
          "@type": "ImageObject",
          "url": "https://1mb3-seo.vercel.app/logo.png"
        }
      },
      "image": image,
      "keywords": keywords.join(", ")
    };
  }

  /**
   * Generate HowTo schema
   */
  static howTo(data) {
    const { name, description, steps, totalTime, estimatedCost } = data;

    return {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": name,
      "description": description,
      "totalTime": totalTime || "PT30M",
      "estimatedCost": estimatedCost || {
        "@type": "MonetaryAmount",
        "currency": "RUB",
        "value": "0"
      },
      "step": steps.map((step, index) => ({
        "@type": "HowToStep",
        "position": index + 1,
        "name": step.name,
        "text": step.text,
        "url": step.url || ""
      }))
    };
  }

  /**
   * Generate FAQ schema
   */
  static faq(questions) {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": questions.map(q => ({
        "@type": "Question",
        "name": q.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": q.answer
        }
      }))
    };
  }

  /**
   * Generate Product schema (for tools/services)
   */
  static product(data) {
    const { name, description, image, price, currency = "RUB", rating, reviewCount } = data;

    const schema = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": name,
      "description": description,
      "image": image
    };

    if (price) {
      schema.offers = {
        "@type": "Offer",
        "price": price,
        "priceCurrency": currency,
        "availability": "https://schema.org/InStock"
      };
    }

    if (rating && reviewCount) {
      schema.aggregateRating = {
        "@type": "AggregateRating",
        "ratingValue": rating,
        "reviewCount": reviewCount
      };
    }

    return schema;
  }

  /**
   * Generate ItemList schema (for catalogs)
   */
  static itemList(data) {
    const { name, description, items } = data;

    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": name,
      "description": description,
      "numberOfItems": items.length,
      "itemListElement": items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": item.url,
        "name": item.name
      }))
    };
  }

  /**
   * Generate Course schema (for educational content)
   */
  static course(data) {
    const { name, description, provider = "1MB3", url } = data;

    return {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": name,
      "description": description,
      "provider": {
        "@type": "Organization",
        "name": provider
      },
      "url": url
    };
  }
}

module.exports = { SchemaGenerator };
