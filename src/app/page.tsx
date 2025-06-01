'use client';

import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./page.module.css";
import RecipeCard from "@/components/RecipeCard";

// Mock data for demonstration
const allRecipes = [
  {
    id: 1,
    title: "Classic Margherita Pizza",
    imageUrl: "/pizza.jpg"
  },
  {
    id: 2,
    title: "Chocolate Chip Cookies",
    imageUrl: ""
  },
  {
    id: 3,
    title: "Chicken Stir Fry",
    imageUrl: "/stirfry.jpg"
  },
  {
    id: 4,
    title: "Vegetable Soup",
    imageUrl: ""
  },
  {
    id: 5,
    title: "Beef Tacos",
    imageUrl: "/tacos.jpg"
  },
  {
    id: 6,
    title: "Greek Salad",
    imageUrl: "/salad.jpg"
  }];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [showEmptyMessage, setShowEmptyMessage] = useState(false);
  const [displayedRecipes, setDisplayedRecipes] = useState<typeof allRecipes>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [screenWidth, setScreenWidth] = useState(0);
  const observer = useRef<IntersectionObserver | null>(null);
  const ITEMS_PER_PAGE = 6;

  // Add resize listener
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    // Set initial width
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const lastRecipeElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        setPage(prevPage => prevPage + 1);
      }
    }, {
      threshold: 1.0,
      rootMargin: '0px'
    });

    if (node) {
      observer.current.observe(node);
    }
  }, [loading, hasMore]);

  const loadMoreRecipes = useCallback(() => {
    if (!hasMore || loading) return;

    setLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      const startIndex = (page - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const newRecipes = allRecipes.slice(startIndex, endIndex);

      if (newRecipes.length === 0) {
        setHasMore(false);
      } else {
        setDisplayedRecipes(prev => [...prev, ...newRecipes]);
      }
      setLoading(false);
    }, 500);
  }, [page, hasMore, loading]);

  useEffect(() => {
    if (page > 1) {
      loadMoreRecipes();
    }
  }, [page, loadMoreRecipes]);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setShowEmptyMessage(true);
      setShowResults(false);
      return;
    }
    setShowEmptyMessage(false);
    setShowResults(true);
    setPage(1);
    setDisplayedRecipes([]);
    setHasMore(true);
    loadMoreRecipes();
  };

  const handleRecipeClick = (recipeId: number) => {
    console.log(`Recipe ${recipeId} clicked`);
    // Add navigation or modal display logic here
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.searchContainer}>
          <div className={styles.logoContainer}>
            <Image
              src="/recipe-logo.png"
              alt="Recipe Recommendations Logo"
              width={120}
              height={120}
              priority
              className={styles.logo}
            />
          </div>
          <h1 className={styles.title}>Recipe Recommendations</h1>
          <div className={styles.searchBox}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search for recipes..."
              aria-label="Search recipes"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowEmptyMessage(false);
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              className={styles.searchButton}
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
          {showEmptyMessage && (
            <p className={styles.emptyMessage}>
              Search for a recipe to get started!
            </p>
          )}
        </div>

        {showResults && (
          <div className={styles.resultsContainer}>
            {Array.from({ length: Math.ceil(displayedRecipes.length / (screenWidth >= 1200 ? 3 : screenWidth >= 768 ? 2 : 1)) }).map((_, rowIndex) => (
              <div key={rowIndex} className={styles.recipeRow}>
                {displayedRecipes.slice(
                  rowIndex * (screenWidth >= 1200 ? 3 : screenWidth >= 768 ? 2 : 1),
                  (rowIndex + 1) * (screenWidth >= 1200 ? 3 : screenWidth >= 768 ? 2 : 1)
                ).map((recipe, colIndex) => {
                  const isLastRecipe = rowIndex === Math.ceil(displayedRecipes.length / (screenWidth >= 1200 ? 3 : screenWidth >= 768 ? 2 : 1)) - 1 &&
                    colIndex === (screenWidth >= 1200 ? 2 : screenWidth >= 768 ? 1 : 0);

                  return (
                    <div
                      key={recipe.id}
                      ref={isLastRecipe ? lastRecipeElementRef : null}
                      className={styles.recipeColumn}
                    >
                      <RecipeCard
                        title={recipe.title}
                        imageUrl={recipe.imageUrl}
                        onClick={() => handleRecipeClick(recipe.id)}
                      />
                    </div>
                  );
                })}
              </div>
            ))}
            {loading && (
              <div className={styles.loadingMessage}>
                Loading more recipes...
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
