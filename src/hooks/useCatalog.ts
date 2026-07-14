'use client';

import { useState, useEffect } from 'react';
import { Product, SEED_PRODUCTS } from '@/data/products';
import {
  ShowcaseItem,
  CollectionItem,
  BTSImage,
  InstagramPost,
  SEED_SHOWCASE,
  SEED_COLLECTIONS,
  SEED_BTS,
  SEED_INSTAGRAM,
} from '@/data/content';

export function useCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Admin-editable homepage content slices
  const [showcaseItems, setShowcaseItems] = useState<ShowcaseItem[]>([]);
  const [collectionItems, setCollectionItems] = useState<CollectionItem[]>([]);
  const [behindScenesImages, setBehindScenesImages] = useState<BTSImage[]>([]);
  const [instagramPosts, setInstagramPosts] = useState<InstagramPost[]>([]);

  useEffect(() => {
    // 1. Load Wishlist from LocalStorage (wishlist is device-specific)
    const savedWishlist = localStorage.getItem('saaaj_wishlist');
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (e) {
        console.error('Error parsing wishlist', e);
      }
    }

    // 2. Load Admin status from LocalStorage (authorization is device-specific)
    const savedAdmin = localStorage.getItem('saaaj_is_admin');
    if (savedAdmin === 'true') {
      setIsAdmin(true);
    }

    // 3. Fetch dynamic catalog data from Server API
    async function fetchCatalog() {
      try {
        const response = await fetch('/api/catalog');
        if (!response.ok) throw new Error('Failed to fetch catalog from server');
        const data = await response.json();
        
        if (data.products) setProducts(data.products);
        if (data.showcaseItems) setShowcaseItems(data.showcaseItems);
        if (data.collectionItems) setCollectionItems(data.collectionItems);
        if (data.behindScenesImages) setBehindScenesImages(data.behindScenesImages);
        if (data.instagramPosts) setInstagramPosts(data.instagramPosts);
      } catch (e) {
        console.error('Error loading catalog from API, falling back to static seed data:', e);
        // Fallback to static seed data if server is offline or fails
        setProducts(SEED_PRODUCTS);
        setShowcaseItems(SEED_SHOWCASE);
        setCollectionItems(SEED_COLLECTIONS);
        setBehindScenesImages(SEED_BTS);
        setInstagramPosts(SEED_INSTAGRAM);
      } finally {
        setIsLoaded(true);
      }
    }

    fetchCatalog();
  }, []);

  // Save full state of catalog back to Server API
  const syncCatalog = async (
    nextProducts: Product[],
    nextShowcase: ShowcaseItem[],
    nextCollections: CollectionItem[],
    nextBts: BTSImage[],
    nextInstagram: InstagramPost[]
  ) => {
    try {
      const response = await fetch('/api/catalog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          products: nextProducts,
          showcaseItems: nextShowcase,
          collectionItems: nextCollections,
          behindScenesImages: nextBts,
          instagramPosts: nextInstagram,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const serverError = errorData.error || response.statusText || 'Unknown Server Error';
        throw new Error(`Status ${response.status}: ${serverError}`);
      }
    } catch (e: any) {
      console.error('Failed to sync catalog with server:', e);
      alert(`Error: Could not save changes to the server. (${e.message})`);
    }
  };

  const updateShowcase = (next: ShowcaseItem[]) => {
    setShowcaseItems(next);
    syncCatalog(products, next, collectionItems, behindScenesImages, instagramPosts);
  };

  const updateCollections = (next: CollectionItem[]) => {
    setCollectionItems(next);
    syncCatalog(products, showcaseItems, next, behindScenesImages, instagramPosts);
  };

  const updateBehindScenes = (next: BTSImage[]) => {
    setBehindScenesImages(next);
    syncCatalog(products, showcaseItems, collectionItems, next, instagramPosts);
  };

  const updateInstagram = (next: InstagramPost[]) => {
    setInstagramPosts(next);
    syncCatalog(products, showcaseItems, collectionItems, behindScenesImages, next);
  };

  // Save wishlist updates
  const toggleWishlist = (productId: string) => {
    const updated = wishlist.includes(productId)
      ? wishlist.filter((id) => id !== productId)
      : [...wishlist, productId];
    setWishlist(updated);
    localStorage.setItem('saaaj_wishlist', JSON.stringify(updated));
  };

  // Add a product (Admin capability)
  const addProduct = (newProdData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...newProdData,
      id: `custom-prod-${Date.now()}`
    };

    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);
    syncCatalog(updatedProducts, showcaseItems, collectionItems, behindScenesImages, instagramPosts);
  };

  // Update product (Admin capability)
  const updateProduct = (updatedProduct: Product) => {
    const updatedProducts = products.map(p => p.id === updatedProduct.id ? updatedProduct : p);
    setProducts(updatedProducts);
    syncCatalog(updatedProducts, showcaseItems, collectionItems, behindScenesImages, instagramPosts);
  };

  // Delete product (Admin capability)
  const deleteProduct = (productId: string) => {
    const updatedProducts = products.filter(p => p.id !== productId);
    setProducts(updatedProducts);
    syncCatalog(updatedProducts, showcaseItems, collectionItems, behindScenesImages, instagramPosts);
  };

  // Toggle Admin status
  const toggleAdmin = () => {
    const nextState = !isAdmin;
    setIsAdmin(nextState);
    localStorage.setItem('saaaj_is_admin', String(nextState));
  };

  return {
    products,
    wishlist,
    toggleWishlist,
    addProduct,
    updateProduct,
    deleteProduct,
    isAdmin,
    toggleAdmin,
    isLoaded,
    // Admin-editable content slices
    showcaseItems,
    updateShowcase,
    collectionItems,
    updateCollections,
    behindScenesImages,
    updateBehindScenes,
    instagramPosts,
    updateInstagram,
  };
}
