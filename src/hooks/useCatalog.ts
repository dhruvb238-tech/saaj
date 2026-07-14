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

// Load an array from localStorage; fall back to the provided seed.
// Used for all admin-editable homepage content slices. The admin panel
// always hands back the full edited array, so once something is saved it
// becomes the source of truth (overriding the seed).
function loadContent<T>(key: string, seed: T[]): T[] {
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed as T[];
    }
  } catch (e) {
    console.error(`Error parsing ${key}`, e);
  }
  return seed;
}

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
    // 1. Load Wishlist from LocalStorage
    const savedWishlist = localStorage.getItem('saaaj_wishlist');
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (e) {
        console.error('Error parsing wishlist', e);
      }
    }

    // 2. Load Products from LocalStorage (Custom Products added by user)
    const savedCustomProducts = localStorage.getItem('saaaj_custom_products');
    let customProducts: Product[] = [];
    if (savedCustomProducts) {
      try {
        customProducts = JSON.parse(savedCustomProducts);
      } catch (e) {
        console.error('Error parsing custom products', e);
      }
    }

    // Merge default products with custom ones
    // Check if custom products have same ID to prevent duplicates
    const merged = [...SEED_PRODUCTS];
    customProducts.forEach((customProd) => {
      const idx = merged.findIndex((p) => p.id === customProd.id);
      if (idx > -1) {
        merged[idx] = customProd; // overwrite/update
      } else {
        merged.push(customProd); // append
      }
    });

    setProducts(merged);
    
    // 3. Load Admin status from LocalStorage
    const savedAdmin = localStorage.getItem('saaaj_is_admin');
    if (savedAdmin === 'true') {
      setIsAdmin(true);
    }

    // 4. Load admin-editable content slices (seed fallback on first visit)
    setShowcaseItems(loadContent('saaaj_showcase', SEED_SHOWCASE));
    setCollectionItems(loadContent('saaaj_collections', SEED_COLLECTIONS));
    setBehindScenesImages(loadContent('saaaj_behind_scenes', SEED_BTS));
    setInstagramPosts(loadContent('saaaj_instagram', SEED_INSTAGRAM));

    setIsLoaded(true);
  }, []);

  // Persist + replace the full content array for a given slice.
  // The admin panel computes the edited array and hands it back here.
  const saveContent = <T,>(setter: (v: T[]) => void, key: string) => (
    next: T[]
  ) => {
    setter(next);
    try {
      localStorage.setItem(key, JSON.stringify(next));
    } catch (e) {
      console.error(`localStorage quota exceeded for ${key}`, e);
      alert(
        'Storage limit reached. Your edit is applied for this session but may not persist after refresh. Consider removing old images to free space.'
      );
    }
  };

  const updateShowcase = saveContent(setShowcaseItems, 'saaaj_showcase');
  const updateCollections = saveContent(
    setCollectionItems,
    'saaaj_collections'
  );
  const updateBehindScenes = saveContent(
    setBehindScenesImages,
    'saaaj_behind_scenes'
  );
  const updateInstagram = saveContent(setInstagramPosts, 'saaaj_instagram');

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

    // Save only custom products to localStorage
    const savedCustomProducts = localStorage.getItem('saaaj_custom_products');
    let customList: Product[] = [];
    if (savedCustomProducts) {
      try {
        customList = JSON.parse(savedCustomProducts);
      } catch (e) {
        console.error(e);
      }
    }
    customList.push(newProduct);
    try {
      localStorage.setItem('saaaj_custom_products', JSON.stringify(customList));
    } catch (e) {
      console.error('localStorage quota exceeded', e);
      alert('Storage limit reached. The product was added to the current session but may not persist after refresh. Consider removing old custom products to free space.');
    }
  };

  // Update product (Admin capability)
  const updateProduct = (updatedProduct: Product) => {
    const updatedProducts = products.map(p => p.id === updatedProduct.id ? updatedProduct : p);
    setProducts(updatedProducts);

    // If it's a custom product, save to custom products localStorage
    if (updatedProduct.id.startsWith('custom-prod-')) {
      const savedCustomProducts = localStorage.getItem('saaaj_custom_products');
      let customList: Product[] = [];
      if (savedCustomProducts) {
        try {
          customList = JSON.parse(savedCustomProducts);
        } catch (e) {
          console.error(e);
        }
      }
      customList = customList.map(p => p.id === updatedProduct.id ? updatedProduct : p);
      localStorage.setItem('saaaj_custom_products', JSON.stringify(customList));
    } else {
      // If it's a seed product being modified (e.g. disabled), we can save it to modified seed products
      const savedModifiedSeeds = localStorage.getItem('saaaj_modified_seeds') || '[]';
      let modifiedSeeds: Product[] = [];
      try {
        modifiedSeeds = JSON.parse(savedModifiedSeeds);
      } catch (e) {}
      
      const idx = modifiedSeeds.findIndex(p => p.id === updatedProduct.id);
      if (idx > -1) {
        modifiedSeeds[idx] = updatedProduct;
      } else {
        modifiedSeeds.push(updatedProduct);
      }
      localStorage.setItem('saaaj_modified_seeds', JSON.stringify(modifiedSeeds));
    }
  };

  // Delete product (Admin capability)
  const deleteProduct = (productId: string) => {
    const updatedProducts = products.filter(p => p.id !== productId);
    setProducts(updatedProducts);

    // Remove from custom list in localStorage if custom
    if (productId.startsWith('custom-prod-')) {
      const savedCustomProducts = localStorage.getItem('saaaj_custom_products');
      if (savedCustomProducts) {
        try {
          const customList: Product[] = JSON.parse(savedCustomProducts);
          const updatedCustomList = customList.filter(p => p.id !== productId);
          localStorage.setItem('saaaj_custom_products', JSON.stringify(updatedCustomList));
        } catch (e) {
          console.error(e);
        }
      }
    } else {
      // For seed products, track deleted IDs
      const savedDeletedSeeds = localStorage.getItem('saaaj_deleted_seeds') || '[]';
      let deletedSeeds: string[] = [];
      try {
        deletedSeeds = JSON.parse(savedDeletedSeeds);
      } catch (e) {}
      if (!deletedSeeds.includes(productId)) {
        deletedSeeds.push(productId);
      }
      localStorage.setItem('saaaj_deleted_seeds', JSON.stringify(deletedSeeds));
    }
  };

  // Toggle Admin status
  const toggleAdmin = () => {
    const nextState = !isAdmin;
    setIsAdmin(nextState);
    localStorage.setItem('saaaj_is_admin', String(nextState));
  };

  // Load modified seeds and deleted seeds on init
  useEffect(() => {
    if (products.length === 0) return;
    
    // Check if we already processed this
    const savedModifiedSeeds = localStorage.getItem('saaaj_modified_seeds');
    const savedDeletedSeeds = localStorage.getItem('saaaj_deleted_seeds');
    
    if (savedModifiedSeeds || savedDeletedSeeds) {
      let modified: Product[] = [];
      let deleted: string[] = [];
      try {
        if (savedModifiedSeeds) modified = JSON.parse(savedModifiedSeeds);
        if (savedDeletedSeeds) deleted = JSON.parse(savedDeletedSeeds);
      } catch (e) {
        console.error(e);
      }

      setProducts(prevProducts => {
        let updated = prevProducts.map(p => {
          const modItem = modified.find(m => m.id === p.id);
          return modItem ? modItem : p;
        });
        if (deleted.length > 0) {
          updated = updated.filter(p => !deleted.includes(p.id));
        }
        return updated;
      });
    }
  }, [isLoaded]);

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
