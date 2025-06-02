'use client';

import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./page.module.css";
import RecipeCard from "@/components/RecipeCard";

interface Recipe {
  title: string;
  image: string;
  link: string;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [showEmptyMessage, setShowEmptyMessage] = useState(false);
  const [displayedRecipes, setDisplayedRecipes] = useState<Recipe[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const currentRequest = useRef<Promise<void> | null>(null);
  const mounted = useRef(false);
  const stateRef = useRef({
    hasMore: true,
    loading: false,
    showResults: false
  });

  useEffect(() => {
    mounted.current = true;

    // Create observer once
    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && stateRef.current.hasMore && !stateRef.current.loading && stateRef.current.showResults) {
          setPage(prev => prev + 1);
        }
      },
      {
        threshold: 1.0,
        rootMargin: '0px'
      }
    );

    return () => {
      mounted.current = false;
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  const lastRecipeElementRef = useCallback((node: HTMLDivElement | null) => {
    if (!mounted.current) return;

    if (observerRef.current) {
      observer.current?.unobserve(observerRef.current);
    }
    if (node) {
      observerRef.current = node;
      observer.current?.observe(node);
    }
  }, []);

  const loadMoreRecipes = useCallback(async () => {
    if (!stateRef.current.hasMore || stateRef.current.loading || currentRequest.current || !mounted.current) {
      return;
    }

    stateRef.current.loading = true;
    setLoading(true);
    currentRequest.current = (async () => {
      try {
        const response = await fetch(
          `/api/recipes?query=${searchQuery}&page=${page}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch recipes');
        }

        const data = await response.json();
        const newRecipes = data.results;

        if (!mounted.current) {
          return;
        }

        if (data.hasMore === false) {
          stateRef.current.hasMore = false;
          setHasMore(false);
        } else {
          setDisplayedRecipes(prev => [...prev, ...newRecipes]);
        }
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        if (mounted.current) {
          stateRef.current.loading = false;
          setLoading(false);
          currentRequest.current = null;
        }
      }
    })();
  }, [page, searchQuery]);

  useEffect(() => {
    stateRef.current = {
      hasMore,
      loading,
      showResults
    };
    if (showResults && page > 0) {
      loadMoreRecipes();
    }
  }, [page, loadMoreRecipes, showResults]);

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
    stateRef.current.hasMore = true;
  };

  const handleRecipeClick = async (recipe: Recipe) => {
    try {
      const response = await fetch('/api/click', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: searchQuery,
          link: recipe.link,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send click data');
      }

      // Ensure the link is treated as an absolute URL
      const absoluteUrl = recipe.link.startsWith('http') ? recipe.link : `https://${recipe.link}`;
      window.location.href = absoluteUrl;
    } catch (error) {
      console.error('Error sending click data:', error);
      // Ensure the link is treated as an absolute URL even in the error case
      const absoluteUrl = recipe.link.startsWith('http') ? recipe.link : `https://${recipe.link}`;
      window.location.href = absoluteUrl;
    }
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
            <div className={styles.recipeGrid}>
              {displayedRecipes.map((recipe, index) => {
                const isLastRecipe = index === displayedRecipes.length - 1;
                return (
                  <div
                    key={`${recipe.link}`}
                    ref={isLastRecipe ? lastRecipeElementRef : null}
                    className={styles.recipeCard}
                  >
                    <RecipeCard
                      title={recipe.title}
                      imageUrl={recipe.image}
                      onClick={() => handleRecipeClick(recipe)}
                    />
                  </div>
                );
              })}
            </div>
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
