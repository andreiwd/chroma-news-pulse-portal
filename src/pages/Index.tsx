
import { useEffect, useState, useMemo } from "react";
import NewsTicker from "@/components/NewsTicker";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AdPlaceholder from "@/components/AdPlaceholder";
import { useNews, useLatestNews, useFeaturedHeroNews, useCategories } from "@/hooks/useNews";
import { Article } from "@/types/api";
import { LayoutConfig } from "@/types/layoutConfig";
import MainNewsGrid from "@/components/MainNewsGrid";
import LatestNewsSidebar from "@/components/LatestNewsSidebar";
import MostViewedSidebar from "@/components/MostViewedSidebar";
import NewsletterSignup from "@/components/NewsletterSignup";
import FeaturedNewsHero from "@/components/FeaturedNewsHero";
import TrendingTopics from "@/components/TrendingTopics";
import CategoryNewsSection from "@/components/CategoryNewsSection";
import WeatherWidget from "@/components/WeatherWidget";
import FeaturedYouTubeVideo from "@/components/FeaturedYouTubeVideo";
import CategoryNewsCarousel from "@/components/CategoryNewsCarousel";
import axios from "axios";

export default function Index() {
  const { data: newsData, isLoading: isNewsLoading } = useNews(1, "", "");
  const { data: latestNewsData, isLoading: isLatestNewsLoading } = useLatestNews();
  const { data: featuredArticles, isLoading: isFeaturedLoading } = useFeaturedHeroNews();
  const { data: categories } = useCategories();
  const [layoutConfig, setLayoutConfig] = useState<LayoutConfig>({ blocks: [] });
  const [categoryNews, setCategoryNews] = useState<Record<string, Article[]>>({});
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  
  const allNews: Article[] = Array.isArray(newsData?.data) ? newsData?.data : [];
  console.log("Index - Total articles:", allNews.length);
  
  const latestNewsItems: Article[] = Array.isArray(latestNewsData) ? latestNewsData.filter(Boolean) : [];
  
  console.log("Featured articles from new endpoint:", featuredArticles);

  // Load layout configuration from localStorage
  useEffect(() => {
    const loadConfig = () => {
      try {
        const savedConfig = localStorage.getItem('homepage_layout');
        if (savedConfig) {
          const config = JSON.parse(savedConfig);
          console.log("Loaded layout config:", config);
          setLayoutConfig(config);
        }
      } catch (e) {
        console.error("Error parsing saved layout config:", e);
      }
    };
    
    // Load immediately and also set up a storage event listener
    loadConfig();
    
    // Setup storage event listener to react to changes from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'homepage_layout') {
        console.log("Layout config updated in another tab, reloading");
        loadConfig();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Fetch news for each category in the layout
  useEffect(() => {
    const fetchCategoryNews = async () => {
      if (!layoutConfig.blocks || layoutConfig.blocks.length === 0) return;
      
      setIsLoadingCategories(true);
      const API_BASE_URL = "https://taquaritinganoticias.criarsite.online/api";
      const newCategoryNews: Record<string, Article[]> = {};
      
      // Get unique category slugs from layout
      const categorySlugSet = new Set<string>();
      layoutConfig.blocks.forEach(block => {
        if (block.categorySlug) {
          categorySlugSet.add(block.categorySlug);
        }
      });
      
      // Add all available categories from the categories data
      if (categories && Array.isArray(categories)) {
        categories.forEach(category => {
          if (category && typeof category === 'object' && typeof category.slug === 'string') {
            categorySlugSet.add(category.slug);
          } else if (typeof category === 'string') {
            categorySlugSet.add(category);
          }
        });
      }
      
      // Convert to array for processing
      const categorySlugArray = Array.from(categorySlugSet);
      console.log("Fetching news for categories:", categorySlugArray);
      
      // Function to sanitize article data
      const sanitizeArticle = (article: any) => {
        if (!article) return null;
        
        // Helper function to sanitize category
        const sanitizeCategory = (category: any) => {
          if (!category) return null;
          
          if (typeof category === 'object') {
            return {
              id: Number(category.id) || 0,
              name: String(category.name || ""),
              slug: String(category.slug || ""),
              description: String(category.description || ""),
              color: String(category.color || "#333333"),
              text_color: String(category.text_color || "#FFFFFF"),
              active: Boolean(category.active),
              order: Number(category.order) || 0
            };
          }
          
          if (typeof category === 'string') {
            return {
              id: 0,
              name: category,
              slug: category.toLowerCase().replace(/\s+/g, '-'),
              description: '',
              color: "#333333",
              text_color: "#FFFFFF",
              active: true,
              order: 0
            };
          }
          
          return null;
        };
        
        // Ensure category is properly formatted
        const sanitizedCategory = sanitizeCategory(article.category);
        
        // Ensure tags are properly formatted
        const sanitizedTags = Array.isArray(article.tags) 
          ? article.tags.map((tag: any) => ({
              id: Number(tag.id) || 0,
              name: String(tag.name || "")
            }))
          : [];
        
        return {
          id: Number(article.id) || 0,
          title: String(article.title || ""),
          slug: String(article.slug || ""),
          excerpt: String(article.excerpt || ""),
          content: String(article.content || ""),
          featured_image: String(article.featured_image || ""),
          featured: Boolean(article.featured),
          category: sanitizedCategory,
          tags: sanitizedTags,
          published_at: String(article.published_at || ""),
          created_at: String(article.created_at || ""),
          updated_at: String(article.updated_at || "")
        };
      };
      
      // Fetch news for each category
      const fetchPromises = categorySlugArray.map(async (slug) => {
        try {
          console.log(`Fetching news for category: ${slug}`);
          const response = await axios.get(`${API_BASE_URL}/categories/${slug}/news`);
          console.log(`Response for ${slug}:`, response.data);
          
          // Process the data based on its structure
          let articleArray: Article[] = [];
          
          if (Array.isArray(response.data)) {
            articleArray = response.data
              .map(sanitizeArticle)
              .filter(Boolean);
          } else if (response.data && Array.isArray(response.data.data)) {
            articleArray = response.data.data
              .map(sanitizeArticle)
              .filter(Boolean);
          }
          
          newCategoryNews[slug] = articleArray;
          console.log(`Processed ${articleArray.length} articles for ${slug}`);
        } catch (error) {
          console.error(`Error fetching news for category ${slug}:`, error);
          // Try fallback method using the news endpoint with category filter
          try {
            console.log(`Using fallback method for ${slug}`);
            const fallbackResponse = await axios.get(`${API_BASE_URL}/news?category=${slug}`);
            
            let articleArray: Article[] = [];
            
            if (Array.isArray(fallbackResponse.data)) {
              articleArray = fallbackResponse.data
                .map(sanitizeArticle)
                .filter(Boolean);
            } else if (fallbackResponse.data && Array.isArray(fallbackResponse.data.data)) {
              articleArray = fallbackResponse.data.data
                .map(sanitizeArticle)
                .filter(Boolean);
            }
            
            newCategoryNews[slug] = articleArray;
            console.log(`Fallback: Processed ${articleArray.length} articles for ${slug}`);
          } catch (fallbackError) {
            console.error(`Fallback also failed for ${slug}:`, fallbackError);
            newCategoryNews[slug] = [];
          }
        }
      });
      
      try {
        await Promise.all(fetchPromises);
        console.log("All category news fetched:", newCategoryNews);
        setCategoryNews(newCategoryNews);
      } catch (error) {
        console.error("Error processing category news:", error);
      } finally {
        setIsLoadingCategories(false);
      }
    };
    
    fetchCategoryNews();
  }, [layoutConfig.blocks, categories]);
  
  const getNewsByCategory = () => {
    return categoryNews;
  };
  
  const getMostViewedNews = () => {
    // Calcular visualizações baseadas no ID ou em outra métrica real
    return [...(allNews || [])].sort((a, b) => {
      // Usamos o ID multiplicado por um fator para simular dados reais de visualização
      const viewsA = a.id ? a.id * 7.3 : 0;
      const viewsB = b.id ? b.id * 7.3 : 0;
      return viewsB - viewsA;
    }).slice(0, 5);
  };
  
  const mainLatestNews = allNews?.slice(0, 12) || [];
  const categoryEntries = Object.entries(getNewsByCategory() || {});
  const trendingNews = allNews?.slice(0, 6) || [];

  // Render custom blocks from layout configuration
  const renderCustomBlocks = () => {
    const categoryNewsData = getNewsByCategory();
    
    if (!layoutConfig?.blocks?.length) {
      // Fallback to default blocks if no configuration
      console.log("No custom layout config found, using defaults");
      return (
        <>
          {categoryEntries.slice(0, 2).map(([category, news], index) => {
            // Always render even if no news items
            return (
              <CategoryNewsCarousel 
                key={`cat-carousel-${category}-${index}`} 
                category={category} 
                news={news} 
              />
            );
          })}
          
          {categoryEntries.slice(0, 4).map(([category, news], index) => {
            // Always render even if no news items  
            return (
              <CategoryNewsSection 
                key={`cat-section-${category}-${index}`} 
                category={category} 
                news={news} 
              />
            );
          })}
        </>
      );
    }
    
    console.log("Rendering custom layout blocks:", layoutConfig.blocks);
    
    // Render blocks based on configuration
    return layoutConfig.blocks
      .sort((a, b) => a.order - b.order)
      .map((block) => {
        const news = categoryNewsData[block.categorySlug] || [];
        console.log(`Rendering block for category ${block.categorySlug} with ${news.length} news items`);
        
        if (block.type === 'carousel') {
          return (
            <CategoryNewsCarousel
              key={`custom-carousel-${block.id}`}
              category={block.categorySlug}
              news={news}
            />
          );
        } else {
          return (
            <CategoryNewsSection
              key={`custom-section-${block.id}`}
              category={block.categorySlug}
              news={news}
            />
          );
        }
      });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <NewsTicker />
      <Header />
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-6">
          <div className="container">
            <FeaturedNewsHero featuredArticles={featuredArticles || []} />
          </div>
        </section>

        {/* Trending Topics Bar */}
        <section className="bg-white py-3 border-y shadow-sm mb-6">
          <div className="container">
            <TrendingTopics trendingNews={trendingNews} />
          </div>
        </section>

        {/* Main Content */}
        <div className="container pb-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar */}
            <div className="lg:col-span-2">
              <div className="sticky top-24 space-y-6">
                <AdPlaceholder 
                  size="sidebar" 
                  id="ad-left-sidebar-1" 
                  className="bg-white rounded-lg shadow-sm"
                />
                
                <LatestNewsSidebar latestNewsItems={latestNewsItems} />
                
                {/* Weather Widget */}
                <div className="mt-6">
                  <WeatherWidget city="Taquaritinga,BR" />
                </div>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="lg:col-span-7">
              <MainNewsGrid mainLatestNews={mainLatestNews} />
              
              <AdPlaceholder 
                size="banner" 
                id="ad-main-banner-1"
                className="my-8 bg-white rounded-lg shadow-sm" 
              />

              {isLoadingCategories ? (
                <div className="text-center py-8">
                  <div className="animate-pulse flex flex-col items-center">
                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="h-64 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
              ) : (
                renderCustomBlocks()
              )}
              
              <AdPlaceholder 
                size="banner" 
                id="ad-main-banner-2"
                className="my-8 bg-white rounded-lg shadow-sm" 
              />
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-3">
              <div className="sticky top-24 space-y-6">
                {/* Use sticky for the sidebar with proper top offset */}
                <div className="mb-6">
                  <MostViewedSidebar mostViewedNews={getMostViewedNews()} />
                </div>
                
                <div className="space-y-6">
                  <AdPlaceholder 
                    size="rectangle" 
                    id="ad-sidebar-rect-1"
                    className="bg-white rounded-lg shadow-sm" 
                  />
                  
                  <NewsletterSignup />
                  
                  <AdPlaceholder 
                    size="sidebar" 
                    id="ad-sidebar-tall-1"
                    className="bg-white rounded-lg shadow-sm" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Vídeos em Destaque - full width with no container restrictions */}
        <FeaturedYouTubeVideo />
      </main>

      <Footer />
    </div>
  );
}
