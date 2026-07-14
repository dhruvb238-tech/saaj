'use client';

import { useState, useRef, ChangeEvent, FormEvent } from 'react';
import {
  Settings, Lock, Plus, Trash2, Edit2, X, Upload, ToggleLeft, ToggleRight, Check,
  Image as ImageIcon, LayoutGrid, ChevronUp, ChevronDown,
} from 'lucide-react';

// Custom Instagram icon (Lucide removed brand icons)
function InstagramIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}
import Image from 'next/image';
import { Product } from '@/data/products';
import {
  ShowcaseItem,
  CollectionItem,
  BTSImage,
  InstagramPost,
} from '@/data/content';
import { compressImage } from '@/utils/compressImage';

// ─── Types ─────────────────────────────────────────────────────────

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onAddProduct: (prod: Omit<Product, 'id'>) => void;
  onUpdateProduct: (prod: Product) => void;
  onDeleteProduct: (id: string) => void;
  isAdmin: boolean;
  onToggleAdmin: () => void;
  showcaseItems?: ShowcaseItem[];
  onUpdateShowcase?: (items: ShowcaseItem[]) => void;
  collectionItems?: CollectionItem[];
  onUpdateCollections?: (items: CollectionItem[]) => void;
  behindScenesImages?: BTSImage[];
  onUpdateBehindScenes?: (items: BTSImage[]) => void;
  instagramPosts?: InstagramPost[];
  onUpdateInstagram?: (posts: InstagramPost[]) => void;
}

// ─── Helpers ───────────────────────────────────────────────────────

const generateId = () => Math.random().toString(36).substring(2, 10);
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// ─── Component ─────────────────────────────────────────────────────

export default function AdminPanel({
  isOpen, onClose, products, onAddProduct, onUpdateProduct, onDeleteProduct,
  isAdmin, onToggleAdmin,
  showcaseItems: externalShowcase = [], onUpdateShowcase,
  collectionItems: externalCollections = [], onUpdateCollections,
  behindScenesImages: externalBts = [], onUpdateBehindScenes,
  instagramPosts: externalInstagram = [], onUpdateInstagram,
}: AdminPanelProps) {

  // ── Auth ────────────────────────────────────────────────────────
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');

  // ── Tabs ────────────────────────────────────────────────────────
  type Tab = 'products' | 'showcase' | 'collections' | 'bts' | 'instagram';
  const [activeTab, setActiveTab] = useState<Tab>('products');

  // ── Product Form ────────────────────────────────────────────────
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<'Canvas Paintings' | 'Mini Easel Art' | 'Home Decor' | 'Festive Collection'>('Canvas Paintings');
  const [description, setDescription] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [materials, setMaterials] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('5-7 business days');
  const [occasions, setOccasions] = useState('');
  const [available, setAvailable] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [newArrival, setNewArrival] = useState(true);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // ── Showcase ────────────────────────────────────────────────────
  const [showcaseItems, setShowcaseItemsState] = useState<ShowcaseItem[]>(() => externalShowcase);
  const setShowcaseItems = (next: ShowcaseItem[]) => { setShowcaseItemsState(next); onUpdateShowcase?.(next); };
  const [isShowcaseFormOpen, setIsShowcaseFormOpen] = useState(false);
  const [editingShowcaseId, setEditingShowcaseId] = useState<string | null>(null);
  const [showcaseTitle, setShowcaseTitle] = useState('');
  const [showcaseSubtitle, setShowcaseSubtitle] = useState('');
  const [showcaseImage, setShowcaseImage] = useState<string | null>(null);
  const [showcaseActive, setShowcaseActive] = useState(true);
  const showcaseFileRef = useRef<HTMLInputElement>(null);

  // ── Instagram ───────────────────────────────────────────────────
  const [instagramPosts, setInstagramPostsState] = useState<InstagramPost[]>(() => externalInstagram);
  const setInstagramPosts = (next: InstagramPost[]) => { setInstagramPostsState(next); onUpdateInstagram?.(next); };
  const [isInstagramFormOpen, setIsInstagramFormOpen] = useState(false);
  const [editingInstagramId, setEditingInstagramId] = useState<string | null>(null);
  const [instagramCaption, setInstagramCaption] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [instagramImage, setInstagramImage] = useState<string | null>(null);
  const [instagramActive, setInstagramActive] = useState(true);
  const instagramFileRef = useRef<HTMLInputElement>(null);

  // ── Collections ─────────────────────────────────────────────────
  const [collections, setCollectionsState] = useState<CollectionItem[]>(() => externalCollections);
  const setCollections = (next: CollectionItem[]) => { setCollectionsState(next); onUpdateCollections?.(next); };
  const [isCollectionFormOpen, setIsCollectionFormOpen] = useState(false);
  const [editingCollectionId, setEditingCollectionId] = useState<string | null>(null);
  const [collectionName, setCollectionName] = useState('');
  const [collectionDesc, setCollectionDesc] = useState('');
  const [collectionTag, setCollectionTag] = useState('Canvas Paintings');
  const [collectionImage, setCollectionImage] = useState<string | null>(null);
  const [collectionActive, setCollectionActive] = useState(true);
  const collectionFileRef = useRef<HTMLInputElement>(null);

  // ── Behind the Canvas ───────────────────────────────────────────
  const [btsImages, setBtsImagesState] = useState<BTSImage[]>(() => externalBts);
  const setBtsImages = (next: BTSImage[]) => { setBtsImagesState(next); onUpdateBehindScenes?.(next); };
  const [isBtsFormOpen, setIsBtsFormOpen] = useState(false);
  const [editingBtsId, setEditingBtsId] = useState<string | null>(null);
  const [btsAlt, setBtsAlt] = useState('');
  const [btsCaption, setBtsCaption] = useState('');
  const [btsImage, setBtsImage] = useState<string | null>(null);
  const [btsActive, setBtsActive] = useState(true);
  const btsFileRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // ════════════════════════════════════════════════════════════════
  //  SHARED IMAGE HANDLER
  // ════════════════════════════════════════════════════════════════

  const handleImageUpload = async (
    e: ChangeEvent<HTMLInputElement>,
    setter: (url: string | null) => void,
    setUploading?: (v: boolean) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      alert(`Image too large. Max 10MB. Your file: ${(file.size / 1024 / 1024).toFixed(1)}MB`);
      return;
    }
    setUploading?.(true);
    try {
      let imageData: string;
      if (file.size > 1024 * 1024) {
        imageData = await compressImage(file, 1200, 1200, 0.85);
      } else {
        const reader = new FileReader();
        imageData = await new Promise((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }
      setter(imageData);
    } catch (err) {
      console.error('Image processing failed', err);
      alert('Failed to process image. Try a smaller file.');
    } finally {
      setUploading?.(false);
    }
  };

  // ════════════════════════════════════════════════════════════════
  //  PRODUCT HANDLERS
  // ════════════════════════════════════════════════════════════════

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (passcode === 'mahi123') {
      onToggleAdmin();
      setError('');
      setPasscode('');
    } else {
      setError('Invalid artist passcode.');
    }
  };

  const resetProductForm = () => {
    setName(''); setPrice(''); setCategory('Canvas Paintings'); setDescription('');
    setDimensions(''); setMaterials(''); setDeliveryTime('5-7 business days');
    setOccasions(''); setAvailable(true); setFeatured(false); setNewArrival(true);
    setUploadedImage(null);
  };

  const openAddForm = () => { setEditingProduct(null); resetProductForm(); setIsFormOpen(true); };

  const openEditForm = (prod: Product) => {
    setEditingProduct(prod);
    setName(prod.name); setPrice(String(prod.price)); setCategory(prod.category);
    setDescription(prod.description); setDimensions(prod.dimensions); setMaterials(prod.materials);
    setDeliveryTime(prod.deliveryTime); setOccasions(prod.occasions.join(', '));
    setAvailable(prod.available); setFeatured(prod.featured); setNewArrival(prod.newArrival);
    setUploadedImage(prod.images[0]); setIsFormOpen(true);
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!uploadedImage) { alert('Please upload a product image.'); return; }
    const itemOccasions = occasions ? occasions.split(',').map(o => o.trim()).filter(Boolean) : ['Personal Use'];
    const productFields = {
      name, price: Number(price), category, description, images: [uploadedImage],
      features: ['100% hand-painted by Mahi','Premium artist-grade materials','Sealed with protective varnish','Perfect for gifting and decor'],
      dimensions, materials, deliveryTime, occasions: itemOccasions, available, featured, newArrival,
    };
    if (editingProduct) { onUpdateProduct({ ...productFields, id: editingProduct.id }); }
    else { onAddProduct(productFields); }
    setIsFormOpen(false); resetProductForm();
  };

  // ════════════════════════════════════════════════════════════════
  //  SHOWCASE HANDLERS
  // ════════════════════════════════════════════════════════════════

  const openAddShowcase = () => {
    setEditingShowcaseId(null); setShowcaseTitle(''); setShowcaseSubtitle('');
    setShowcaseImage(null); setShowcaseActive(true); setIsShowcaseFormOpen(true);
  };

  const openEditShowcase = (item: ShowcaseItem) => {
    setEditingShowcaseId(item.id); setShowcaseTitle(item.title); setShowcaseSubtitle(item.subtitle);
    setShowcaseImage(item.image); setShowcaseActive(item.active); setIsShowcaseFormOpen(true);
  };

  const handleShowcaseSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!showcaseImage) { alert('Please upload a showcase image.'); return; }
    let updated: ShowcaseItem[];
    if (editingShowcaseId) {
      updated = showcaseItems.map(item => item.id === editingShowcaseId
        ? { ...item, title: showcaseTitle, subtitle: showcaseSubtitle, image: showcaseImage, active: showcaseActive }
        : item);
    } else {
      updated = [...showcaseItems, { id: generateId(), title: showcaseTitle, subtitle: showcaseSubtitle, image: showcaseImage, active: showcaseActive, order: showcaseItems.length }];
    }
    setShowcaseItems(updated); onUpdateShowcase?.(updated); setIsShowcaseFormOpen(false);
  };

  const deleteShowcase = (id: string) => {
    if (confirm('Delete this showcase slide?')) {
      const updated = showcaseItems.filter(i => i.id !== id);
      setShowcaseItems(updated); onUpdateShowcase?.(updated);
    }
  };

  const toggleShowcaseActive = (id: string) => {
    const updated = showcaseItems.map(item => item.id === id ? { ...item, active: !item.active } : item);
    setShowcaseItems(updated); onUpdateShowcase?.(updated);
  };

  const moveShowcase = (id: string, direction: 'up' | 'down') => {
    const idx = showcaseItems.findIndex(i => i.id === id);
    if (idx === -1) return;
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === showcaseItems.length - 1) return;
    const newItems = [...showcaseItems];
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    [newItems[idx], newItems[swapIdx]] = [newItems[swapIdx], newItems[idx]];
    const reordered = newItems.map((item, i) => ({ ...item, order: i }));
    setShowcaseItems(reordered); onUpdateShowcase?.(reordered);
  };

  // ════════════════════════════════════════════════════════════════
  //  COLLECTIONS HANDLERS
  // ════════════════════════════════════════════════════════════════

  const openAddCollection = () => {
    setEditingCollectionId(null); setCollectionName(''); setCollectionDesc('');
    setCollectionTag('Canvas Paintings'); setCollectionImage(null);
    setCollectionActive(true); setIsCollectionFormOpen(true);
  };

  const openEditCollection = (item: CollectionItem) => {
    setEditingCollectionId(item.id); setCollectionName(item.name);
    setCollectionDesc(item.description); setCollectionTag(item.tag);
    setCollectionImage(item.image); setCollectionActive(item.active);
    setIsCollectionFormOpen(true);
  };

  const handleCollectionSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!collectionImage) { alert('Please upload a collection image.'); return; }
    let updated: CollectionItem[];
    if (editingCollectionId) {
      updated = collections.map(item => item.id === editingCollectionId
        ? { ...item, name: collectionName, description: collectionDesc, tag: collectionTag, image: collectionImage, active: collectionActive }
        : item);
    } else {
      updated = [...collections, { id: generateId(), name: collectionName, description: collectionDesc, tag: collectionTag, image: collectionImage, active: collectionActive, order: collections.length }];
    }
    setCollections(updated); onUpdateCollections?.(updated); setIsCollectionFormOpen(false);
  };

  const deleteCollection = (id: string) => {
    if (confirm('Delete this collection card?')) {
      const updated = collections.filter(i => i.id !== id);
      const reordered = updated.map((item, i) => ({ ...item, order: i }));
      setCollections(reordered); onUpdateCollections?.(reordered);
    }
  };

  const toggleCollectionActive = (id: string) => {
    const updated = collections.map(item => item.id === id ? { ...item, active: !item.active } : item);
    setCollections(updated); onUpdateCollections?.(updated);
  };

  const moveCollection = (id: string, direction: 'up' | 'down') => {
    const idx = collections.findIndex(i => i.id === id);
    if (idx === -1) return;
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === collections.length - 1) return;
    const newItems = [...collections];
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    [newItems[idx], newItems[swapIdx]] = [newItems[swapIdx], newItems[idx]];
    const reordered = newItems.map((item, i) => ({ ...item, order: i }));
    setCollections(reordered); onUpdateCollections?.(reordered);
  };

  // ════════════════════════════════════════════════════════════════
  //  BEHIND THE CANVAS HANDLERS
  // ════════════════════════════════════════════════════════════════

  const openAddBts = () => {
    setEditingBtsId(null); setBtsAlt(''); setBtsCaption('');
    setBtsImage(null); setBtsActive(true); setIsBtsFormOpen(true);
  };

  const openEditBts = (item: BTSImage) => {
    setEditingBtsId(item.id); setBtsAlt(item.alt); setBtsCaption(item.caption);
    setBtsImage(item.image); setBtsActive(item.active); setIsBtsFormOpen(true);
  };

  const handleBtsSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!btsImage) { alert('Please upload an image.'); return; }
    let updated: BTSImage[];
    if (editingBtsId) {
      updated = btsImages.map(item => item.id === editingBtsId
        ? { ...item, alt: btsAlt, caption: btsCaption, image: btsImage, active: btsActive }
        : item);
    } else {
      updated = [...btsImages, { id: generateId(), alt: btsAlt, caption: btsCaption, image: btsImage, active: btsActive, order: btsImages.length }];
    }
    setBtsImages(updated); onUpdateBehindScenes?.(updated); setIsBtsFormOpen(false);
  };

  const deleteBts = (id: string) => {
    if (confirm('Delete this image?')) {
      const updated = btsImages.filter(i => i.id !== id);
      const reordered = updated.map((item, i) => ({ ...item, order: i }));
      setBtsImages(reordered); onUpdateBehindScenes?.(reordered);
    }
  };

  const toggleBtsActive = (id: string) => {
    const updated = btsImages.map(item => item.id === id ? { ...item, active: !item.active } : item);
    setBtsImages(updated); onUpdateBehindScenes?.(updated);
  };

  const moveBts = (id: string, direction: 'up' | 'down') => {
    const idx = btsImages.findIndex(i => i.id === id);
    if (idx === -1) return;
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === btsImages.length - 1) return;
    const newItems = [...btsImages];
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    [newItems[idx], newItems[swapIdx]] = [newItems[swapIdx], newItems[idx]];
    const reordered = newItems.map((item, i) => ({ ...item, order: i }));
    setBtsImages(reordered); onUpdateBehindScenes?.(reordered);
  };

  // ════════════════════════════════════════════════════════════════
  //  INSTAGRAM HANDLERS
  // ════════════════════════════════════════════════════════════════

  const openAddInstagram = () => {
    setEditingInstagramId(null); setInstagramCaption(''); setInstagramUrl('');
    setInstagramImage(null); setInstagramActive(true); setIsInstagramFormOpen(true);
  };

  const openEditInstagram = (post: InstagramPost) => {
    setEditingInstagramId(post.id); setInstagramCaption(post.caption); setInstagramUrl(post.postUrl);
    setInstagramImage(post.image); setInstagramActive(post.active); setIsInstagramFormOpen(true);
  };

  const handleInstagramSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!instagramImage) { alert('Please upload an Instagram post image.'); return; }
    let updated: InstagramPost[];
    if (editingInstagramId) {
      updated = instagramPosts.map(post => post.id === editingInstagramId
        ? { ...post, caption: instagramCaption, postUrl: instagramUrl, image: instagramImage, active: instagramActive }
        : post);
    } else {
      updated = [...instagramPosts, { id: generateId(), caption: instagramCaption, postUrl: instagramUrl, image: instagramImage, active: instagramActive, order: instagramPosts.length }];
    }
    setInstagramPosts(updated); onUpdateInstagram?.(updated); setIsInstagramFormOpen(false);
  };

  const deleteInstagram = (id: string) => {
    if (confirm('Delete this Instagram post?')) {
      const updated = instagramPosts.filter(p => p.id !== id);
      setInstagramPosts(updated); onUpdateInstagram?.(updated);
    }
  };

  const toggleInstagramActive = (id: string) => {
    const updated = instagramPosts.map(post => post.id === id ? { ...post, active: !post.active } : post);
    setInstagramPosts(updated); onUpdateInstagram?.(updated);
  };

  const moveInstagram = (id: string, direction: 'up' | 'down') => {
    const idx = instagramPosts.findIndex(p => p.id === id);
    if (idx === -1) return;
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === instagramPosts.length - 1) return;
    const newPosts = [...instagramPosts];
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    [newPosts[idx], newPosts[swapIdx]] = [newPosts[swapIdx], newPosts[idx]];
    const reordered = newPosts.map((post, i) => ({ ...post, order: i }));
    setInstagramPosts(reordered); onUpdateInstagram?.(reordered);
  };

  // ════════════════════════════════════════════════════════════════
  //  RENDER
  // ════════════════════════════════════════════════════════════════

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-brand-bg-primary w-full max-w-5xl rounded-brand shadow-2xl border border-brand-gold/15 overflow-hidden max-h-[92vh] flex flex-col">

        {/* Header */}
        <div className="p-5 border-b border-brand-gold/15 flex justify-between items-center bg-brand-bg-secondary/20 shrink-0">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-brand-accent" />
            <h3 className="font-serif text-xl font-semibold text-brand-text-primary">Mahi&apos;s Studio Admin Portal</h3>
            {isAdmin && <span className="text-[10px] bg-brand-accent/15 text-brand-accent font-semibold px-2 py-0.5 rounded-full">Authorized</span>}
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full text-brand-text-primary hover:bg-brand-bg-secondary transition-colors"><X className="w-5 h-5" /></button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto">
          {!isAdmin ? (
            <div className="max-w-md mx-auto py-16 flex flex-col items-center px-6">
              <div className="w-12 h-12 rounded-full bg-brand-bg-secondary flex items-center justify-center text-brand-accent mb-4 border border-brand-gold/15"><Lock className="w-5 h-5" /></div>
              <h4 className="font-serif text-lg font-semibold text-brand-text-primary mb-2">Artist Verification Required</h4>
              <p className="text-xs text-brand-text-muted text-center mb-6 max-w-xs">To manage the catalog, upload new paintings, or edit status, please verify your identity.</p>
              <form onSubmit={handleLogin} className="w-full space-y-4">
                <div className="flex flex-col">
                  <input type="password" value={passcode} onChange={e => setPasscode(e.target.value)} placeholder="Enter artist passcode (hint: mahi123)"
                    className="bg-brand-bg-primary border border-brand-gold/15 rounded-xl px-4 py-3 text-sm focus:border-brand-accent focus:outline-none text-center transition-colors" />
                  {error && <span className="text-xs text-brand-accent text-center mt-2 font-medium">{error}</span>}
                </div>
                <button type="submit" className="w-full bg-brand-button hover:bg-brand-accent text-brand-bg-primary text-xs font-semibold py-3 px-6 rounded-brand tracking-widest uppercase transition-colors">Verify Identity</button>
              </form>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              {/* Tabs */}
              <div className="flex border-b border-brand-gold/15 bg-brand-bg-secondary/10 shrink-0 overflow-x-auto">
                {([
                  { key: 'products', label: 'Products', icon: LayoutGrid },
                  { key: 'showcase', label: 'Hero', icon: ImageIcon },
                  { key: 'collections', label: 'Collections', icon: LayoutGrid },
                  { key: 'bts', label: 'Behind Canvas', icon: ImageIcon },
                  { key: 'instagram', label: 'Instagram', icon: InstagramIcon },
                ] as const).map(tab => (
                  <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center gap-2 px-5 py-3.5 text-xs font-semibold uppercase tracking-widest transition-all border-b-2 whitespace-nowrap ${activeTab === tab.key ? 'border-brand-accent text-brand-accent bg-brand-accent/5' : 'border-transparent text-brand-text-muted hover:text-brand-text-primary'}`}>
                    <tab.icon className="w-4 h-4" />{tab.label}
                  </button>
                ))}
              </div>

              <div className="p-6 md:p-8">
                {/* PRODUCTS TAB */}
                {activeTab === 'products' && (
                  <div>
                    {isFormOpen ? (
                      <form onSubmit={handleFormSubmit} className="space-y-6 max-w-4xl mx-auto">
                        <div className="flex items-center justify-between pb-3 border-b border-brand-gold/10">
                          <h4 className="font-serif text-lg font-semibold text-brand-text-primary">{editingProduct ? 'Edit Portfolio Artwork' : 'Upload New Artwork'}</h4>
                          <button type="button" onClick={() => { setIsFormOpen(false); resetProductForm(); }} className="text-xs text-brand-text-muted hover:text-brand-accent font-semibold uppercase tracking-wider">Cancel</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="flex flex-col">
                            <label className="text-xs font-semibold uppercase tracking-wider text-brand-text-muted mb-2">Product Name</label>
                            <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Symphony of Clay" className="bg-brand-bg-primary border border-brand-gold/15 rounded-xl px-4 py-3 text-sm focus:border-brand-accent focus:outline-none transition-colors" />
                          </div>
                          <div className="flex flex-col">
                            <label className="text-xs font-semibold uppercase tracking-wider text-brand-text-muted mb-2">Price (INR)</label>
                            <input type="number" required value={price} onChange={e => setPrice(e.target.value)} placeholder="e.g. 3500" className="bg-brand-bg-primary border border-brand-gold/15 rounded-xl px-4 py-3 text-sm focus:border-brand-accent focus:outline-none transition-colors" />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="flex flex-col">
                            <label className="text-xs font-semibold uppercase tracking-wider text-brand-text-muted mb-2">Category</label>
                            <select value={category} onChange={e => setCategory(e.target.value as Product['category'])} className="bg-brand-bg-primary border border-brand-gold/15 rounded-xl px-4 py-3 text-sm focus:border-brand-accent focus:outline-none transition-colors">
                              <option value="Canvas Paintings">Canvas Paintings</option>
                              <option value="Mini Easel Art">Mini Easel Art</option>
                              <option value="Home Decor">Home Decor</option>
                              <option value="Festive Collection">Festive Collection</option>
                            </select>
                          </div>
                          <div className="flex flex-col">
                            <label className="text-xs font-semibold uppercase tracking-wider text-brand-text-muted mb-2">Dimensions</label>
                            <input type="text" required value={dimensions} onChange={e => setDimensions(e.target.value)} placeholder="e.g. 12 x 12 inches" className="bg-brand-bg-primary border border-brand-gold/15 rounded-xl px-4 py-3 text-sm focus:border-brand-accent focus:outline-none transition-colors" />
                          </div>
                          <div className="flex flex-col">
                            <label className="text-xs font-semibold uppercase tracking-wider text-brand-text-muted mb-2">Materials</label>
                            <input type="text" required value={materials} onChange={e => setMaterials(e.target.value)} placeholder="e.g. Heavy Acrylics, Pine Wood" className="bg-brand-bg-primary border border-brand-gold/15 rounded-xl px-4 py-3 text-sm focus:border-brand-accent focus:outline-none transition-colors" />
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <label className="text-xs font-semibold uppercase tracking-wider text-brand-text-muted mb-2">Description</label>
                          <textarea required rows={3} value={description} onChange={e => setDescription(e.target.value)} placeholder="Detailed narrative describing the artwork..." className="bg-brand-bg-primary border border-brand-gold/15 rounded-xl px-4 py-3 text-sm focus:border-brand-accent focus:outline-none resize-none transition-colors" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="flex flex-col">
                            <label className="text-xs font-semibold uppercase tracking-wider text-brand-text-muted mb-2">Occasions (Comma Separated)</label>
                            <input type="text" value={occasions} onChange={e => setOccasions(e.target.value)} placeholder="e.g. Housewarming, Diwali, Wedding Gifts" className="bg-brand-bg-primary border border-brand-gold/15 rounded-xl px-4 py-3 text-sm focus:border-brand-accent focus:outline-none transition-colors" />
                          </div>
                          <div className="flex flex-col">
                            <label className="text-xs font-semibold uppercase tracking-wider text-brand-text-muted mb-2">Delivery SLA</label>
                            <input type="text" required value={deliveryTime} onChange={e => setDeliveryTime(e.target.value)} placeholder="e.g. 5-7 business days" className="bg-brand-bg-primary border border-brand-gold/15 rounded-xl px-4 py-3 text-sm focus:border-brand-accent focus:outline-none transition-colors" />
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-6 items-center pt-2">
                          {[{ label: 'Available (In Stock)', state: available, setter: setAvailable }, { label: 'New Arrival', state: newArrival, setter: setNewArrival }, { label: 'Featured Product', state: featured, setter: setFeatured }].map(t => (
                            <label key={t.label} className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-brand-text-primary">
                              <span>{t.label}</span>
                              <button type="button" onClick={() => t.setter(!t.state)} className="text-brand-accent">{t.state ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8 text-brand-text-muted" />}</button>
                            </label>
                          ))}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold uppercase tracking-wider text-brand-text-muted mb-2">Artwork Photography</span>
                          {uploadedImage ? (
                            <div className="relative w-28 h-28 border border-brand-gold/15 rounded-xl overflow-hidden shadow-md">
                              <Image src={uploadedImage} alt="Preview" fill className="object-cover" />
                              <button type="button" onClick={() => setUploadedImage(null)} className="absolute top-1 right-1 bg-brand-button hover:bg-brand-accent text-white p-0.5 rounded-full"><X className="w-3.5 h-3.5" /></button>
                            </div>
                          ) : (
                            <div onClick={() => fileRef.current?.click()} className="border border-dashed border-brand-gold/25 rounded-xl p-6 text-center cursor-pointer hover:border-brand-accent bg-brand-bg-primary/40 transition-colors w-fit">
                              <input type="file" ref={fileRef} onChange={e => handleImageUpload(e, setUploadedImage, setIsUploading)} accept="image/*" className="hidden" />
                              {isUploading ? <span className="text-xs text-brand-text-muted">Processing...</span> : <><Upload className="w-6 h-6 text-brand-gold mx-auto mb-2" /><span className="text-xs font-medium text-brand-text-primary">Select artwork photo</span></>}
                            </div>
                          )}
                        </div>
                        <button type="submit" className="w-full bg-brand-button hover:bg-brand-accent text-brand-bg-primary text-xs font-semibold py-4 rounded-brand tracking-widest uppercase flex items-center justify-center gap-1.5 shadow-md transition-colors">
                          <Check className="w-4 h-4" />{editingProduct ? 'Save Artwork Updates' : 'Publish Artwork to Store'}
                        </button>
                      </form>
                    ) : (
                      <div className="space-y-6">
                        <div className="flex justify-between items-center">
                          <h4 className="font-serif text-lg font-semibold text-brand-text-primary">Manage Product Catalog ({products.length})</h4>
                          <button onClick={openAddForm} className="bg-brand-button hover:bg-brand-accent text-brand-bg-primary text-[10px] font-semibold py-2.5 px-4 rounded-brand tracking-widest uppercase flex items-center gap-1.5 transition-colors shadow-sm"><Plus className="w-3.5 h-3.5" />Add Artwork</button>
                        </div>
                        <div className="border border-brand-gold/15 rounded-xl overflow-hidden bg-brand-bg-primary shadow-sm">
                          <div className="max-w-full overflow-x-auto">
                            <table className="w-full border-collapse text-left text-xs">
                              <thead>
                                <tr className="bg-brand-bg-secondary/40 border-b border-brand-gold/15 font-semibold text-brand-text-muted">
                                  <th className="p-4">Artwork</th><th className="p-4">Name</th><th className="p-4">Category</th><th className="p-4">Price</th><th className="p-4">Status</th><th className="p-4 text-center">Actions</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-brand-gold/10">
                                {products.map(prod => (
                                  <tr key={prod.id} className="hover:bg-brand-bg-secondary/15 transition-colors">
                                    <td className="p-4"><div className="relative w-12 h-12 rounded-lg overflow-hidden border border-brand-gold/15 bg-brand-bg-secondary"><Image src={prod.images[0]} alt={prod.name} fill className="object-cover" /></div></td>
                                    <td className="p-4 font-semibold text-brand-text-primary max-w-[150px] truncate">{prod.name}</td>
                                    <td className="p-4 text-brand-text-muted">{prod.category}</td>
                                    <td className="p-4 font-semibold text-brand-accent">₹{prod.price.toLocaleString('en-IN')}</td>
                                    <td className="p-4">
                                      <button onClick={() => onUpdateProduct({ ...prod, available: !prod.available })} className={`px-2 py-0.5 rounded-full text-[9px] font-semibold tracking-wider uppercase transition-all ${prod.available ? 'bg-[#25D366]/10 text-[#12a045] border border-[#25D366]/20' : 'bg-brand-text-muted/10 text-brand-text-muted border border-brand-gold/10'}`}>{prod.available ? 'Active' : 'Disabled'}</button>
                                    </td>
                                    <td className="p-4 text-center">
                                      <div className="flex items-center justify-center gap-3">
                                        <button onClick={() => openEditForm(prod)} className="p-1.5 text-brand-text-muted hover:text-brand-gold rounded-full hover:bg-brand-bg-secondary transition-colors" title="Edit product"><Edit2 className="w-3.5 h-3.5" /></button>
                                        <button onClick={() => { if (confirm(`Delete "${prod.name}" permanently?`)) onDeleteProduct(prod.id); }} className="p-1.5 text-brand-text-muted hover:text-brand-accent rounded-full hover:bg-brand-bg-secondary transition-colors" title="Delete product"><Trash2 className="w-3.5 h-3.5" /></button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* SHOWCASE TAB */}
                {activeTab === 'showcase' && (
                  <div>
                    {isShowcaseFormOpen ? (
                      <form onSubmit={handleShowcaseSubmit} className="space-y-6 max-w-3xl mx-auto">
                        <div className="flex items-center justify-between pb-3 border-b border-brand-gold/10">
                          <h4 className="font-serif text-lg font-semibold text-brand-text-primary">{editingShowcaseId ? 'Edit Showcase Slide' : 'Add Showcase Slide'}</h4>
                          <button type="button" onClick={() => setIsShowcaseFormOpen(false)} className="text-xs text-brand-text-muted hover:text-brand-accent font-semibold uppercase tracking-wider">Cancel</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="flex flex-col">
                            <label className="text-xs font-semibold uppercase tracking-wider text-brand-text-muted mb-2">Slide Title</label>
                            <input type="text" required value={showcaseTitle} onChange={e => setShowcaseTitle(e.target.value)} placeholder="e.g. New Collection Launch" className="bg-brand-bg-primary border border-brand-gold/15 rounded-xl px-4 py-3 text-sm focus:border-brand-accent focus:outline-none transition-colors" />
                          </div>
                          <div className="flex flex-col">
                            <label className="text-xs font-semibold uppercase tracking-wider text-brand-text-muted mb-2">Subtitle / Tagline</label>
                            <input type="text" value={showcaseSubtitle} onChange={e => setShowcaseSubtitle(e.target.value)} placeholder="e.g. Hand-painted masterpieces for your home" className="bg-brand-bg-primary border border-brand-gold/15 rounded-xl px-4 py-3 text-sm focus:border-brand-accent focus:outline-none transition-colors" />
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <label className="text-xs font-semibold uppercase tracking-wider text-brand-text-muted">Active</label>
                          <button type="button" onClick={() => setShowcaseActive(!showcaseActive)} className="text-brand-accent">{showcaseActive ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8 text-brand-text-muted" />}</button>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold uppercase tracking-wider text-brand-text-muted mb-2">Showcase Image</span>
                          {showcaseImage ? (
                            <div className="relative w-full max-w-md aspect-video border border-brand-gold/15 rounded-xl overflow-hidden shadow-md">
                              <Image src={showcaseImage} alt="Showcase preview" fill className="object-cover" />
                              <button type="button" onClick={() => setShowcaseImage(null)} className="absolute top-2 right-2 bg-brand-button hover:bg-brand-accent text-white p-1.5 rounded-full shadow-md"><X className="w-4 h-4" /></button>
                            </div>
                          ) : (
                            <div onClick={() => showcaseFileRef.current?.click()} className="border border-dashed border-brand-gold/25 rounded-xl p-8 text-center cursor-pointer hover:border-brand-accent bg-brand-bg-primary/40 transition-colors w-full max-w-md">
                              <input type="file" ref={showcaseFileRef} onChange={e => handleImageUpload(e, setShowcaseImage)} accept="image/*" className="hidden" />
                              <ImageIcon className="w-8 h-8 text-brand-gold mx-auto mb-2" />
                              <span className="text-xs font-medium text-brand-text-primary">Select showcase banner image</span>
                              <p className="text-[10px] text-brand-text-muted mt-1">Recommended: 16:9 ratio, high resolution</p>
                            </div>
                          )}
                        </div>
                        <button type="submit" className="w-full bg-brand-button hover:bg-brand-accent text-brand-bg-primary text-xs font-semibold py-4 rounded-brand tracking-widest uppercase flex items-center justify-center gap-1.5 shadow-md transition-colors">
                          <Check className="w-4 h-4" />{editingShowcaseId ? 'Update Showcase Slide' : 'Add to Showcase'}
                        </button>
                      </form>
                    ) : (
                      <div className="space-y-6">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-serif text-lg font-semibold text-brand-text-primary">Hero Showcase Slides</h4>
                            <p className="text-xs text-brand-text-muted mt-1">Manage banner images displayed on the homepage hero section.</p>
                          </div>
                          <button onClick={openAddShowcase} className="bg-brand-button hover:bg-brand-accent text-brand-bg-primary text-[10px] font-semibold py-2.5 px-4 rounded-brand tracking-widest uppercase flex items-center gap-1.5 transition-colors shadow-sm"><Plus className="w-3.5 h-3.5" />Add Slide</button>
                        </div>
                        {showcaseItems.length === 0 ? (
                          <div className="text-center py-16 border border-dashed border-brand-gold/20 rounded-xl">
                            <ImageIcon className="w-10 h-10 text-brand-text-muted mx-auto mb-3" />
                            <p className="text-sm text-brand-text-muted">No showcase slides yet.</p>
                            <p className="text-xs text-brand-text-muted mt-1">Add slides to display rotating banners on your homepage.</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {showcaseItems.map((item, idx) => (
                              <div key={item.id} className={`border rounded-xl overflow-hidden bg-brand-bg-primary shadow-sm transition-all ${item.active ? 'border-brand-gold/20' : 'border-brand-gold/10 opacity-60'}`}>
                                <div className="relative aspect-video bg-brand-bg-secondary">
                                  <Image src={item.image} alt={item.title} fill className="object-cover" />
                                  {!item.active && <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><span className="text-xs font-semibold text-white uppercase tracking-widest">Hidden</span></div>}
                                  <div className="absolute top-2 left-2 bg-brand-button/90 text-brand-bg-primary text-[10px] font-bold px-2 py-0.5 rounded-full">#{idx + 1}</div>
                                </div>
                                <div className="p-4">
                                  <h5 className="font-serif text-sm font-semibold text-brand-text-primary mb-1">{item.title}</h5>
                                  <p className="text-xs text-brand-text-muted line-clamp-1 mb-3">{item.subtitle}</p>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <button onClick={() => toggleShowcaseActive(item.id)} className={`text-xs font-semibold px-2 py-1 rounded-full transition-all ${item.active ? 'bg-[#25D366]/10 text-[#12a045] border border-[#25D366]/20' : 'bg-brand-text-muted/10 text-brand-text-muted border border-brand-gold/10'}`}>{item.active ? 'Active' : 'Hidden'}</button>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <button onClick={() => moveShowcase(item.id, 'up')} disabled={idx === 0} className="p-1 rounded text-brand-text-muted hover:text-brand-accent hover:bg-brand-bg-secondary disabled:opacity-30 transition-colors"><ChevronUp className="w-4 h-4" /></button>
                                      <button onClick={() => moveShowcase(item.id, 'down')} disabled={idx === showcaseItems.length - 1} className="p-1 rounded text-brand-text-muted hover:text-brand-accent hover:bg-brand-bg-secondary disabled:opacity-30 transition-colors"><ChevronDown className="w-4 h-4" /></button>
                                      <button onClick={() => openEditShowcase(item)} className="p-1.5 rounded-full text-brand-text-muted hover:text-brand-gold hover:bg-brand-bg-secondary transition-colors" title="Edit"><Edit2 className="w-3.5 h-3.5" /></button>
                                      <button onClick={() => deleteShowcase(item.id)} className="p-1.5 rounded-full text-brand-text-muted hover:text-brand-accent hover:bg-brand-bg-secondary transition-colors" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* COLLECTIONS TAB */}
                {activeTab === 'collections' && (
                  <div>
                    {isCollectionFormOpen ? (
                      <form onSubmit={handleCollectionSubmit} className="space-y-6 max-w-3xl mx-auto">
                        <div className="flex items-center justify-between pb-3 border-b border-brand-gold/10">
                          <h4 className="font-serif text-lg font-semibold text-brand-text-primary">{editingCollectionId ? 'Edit Collection Card' : 'Add Collection Card'}</h4>
                          <button type="button" onClick={() => setIsCollectionFormOpen(false)} className="text-xs text-brand-text-muted hover:text-brand-accent font-semibold uppercase tracking-wider">Cancel</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="flex flex-col">
                            <label className="text-xs font-semibold uppercase tracking-wider text-brand-text-muted mb-2">Card Title</label>
                            <input type="text" required value={collectionName} onChange={e => setCollectionName(e.target.value)} placeholder="e.g. Canvas Paintings" className="bg-brand-bg-primary border border-brand-gold/15 rounded-xl px-4 py-3 text-sm focus:border-brand-accent focus:outline-none transition-colors" />
                          </div>
                          <div className="flex flex-col">
                            <label className="text-xs font-semibold uppercase tracking-wider text-brand-text-muted mb-2">Tag (Category or &lsquo;Custom&rsquo;)</label>
                            <input type="text" required value={collectionTag} onChange={e => setCollectionTag(e.target.value)} placeholder="e.g. Canvas Paintings or Custom" className="bg-brand-bg-primary border border-brand-gold/15 rounded-xl px-4 py-3 text-sm focus:border-brand-accent focus:outline-none transition-colors" />
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <label className="text-xs font-semibold uppercase tracking-wider text-brand-text-muted mb-2">Description</label>
                          <textarea required rows={2} value={collectionDesc} onChange={e => setCollectionDesc(e.target.value)} placeholder="Short description shown on the card..." className="bg-brand-bg-primary border border-brand-gold/15 rounded-xl px-4 py-3 text-sm focus:border-brand-accent focus:outline-none resize-none transition-colors" />
                        </div>
                        <div className="flex items-center gap-3">
                          <label className="text-xs font-semibold uppercase tracking-wider text-brand-text-muted">Active</label>
                          <button type="button" onClick={() => setCollectionActive(!collectionActive)} className="text-brand-accent">{collectionActive ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8 text-brand-text-muted" />}</button>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold uppercase tracking-wider text-brand-text-muted mb-2">Card Image</span>
                          {collectionImage ? (
                            <div className="relative w-full max-w-md aspect-[4/3] border border-brand-gold/15 rounded-xl overflow-hidden shadow-md">
                              <Image src={collectionImage} alt="Preview" fill className="object-cover" />
                              <button type="button" onClick={() => setCollectionImage(null)} className="absolute top-2 right-2 bg-brand-button hover:bg-brand-accent text-white p-1.5 rounded-full shadow-md"><X className="w-4 h-4" /></button>
                            </div>
                          ) : (
                            <div onClick={() => collectionFileRef.current?.click()} className="border border-dashed border-brand-gold/25 rounded-xl p-8 text-center cursor-pointer hover:border-brand-accent bg-brand-bg-primary/40 transition-colors w-full max-w-md">
                              <input type="file" ref={collectionFileRef} onChange={e => handleImageUpload(e, setCollectionImage)} accept="image/*" className="hidden" />
                              <ImageIcon className="w-8 h-8 text-brand-gold mx-auto mb-2" />
                              <span className="text-xs font-medium text-brand-text-primary">Select collection image</span>
                              <p className="text-[10px] text-brand-text-muted mt-1">4:3 ratio recommended</p>
                            </div>
                          )}
                        </div>
                        <button type="submit" className="w-full bg-brand-button hover:bg-brand-accent text-brand-bg-primary text-xs font-semibold py-4 rounded-brand tracking-widest uppercase flex items-center justify-center gap-1.5 shadow-md transition-colors">
                          <Check className="w-4 h-4" />{editingCollectionId ? 'Update Collection' : 'Add to Collections'}
                        </button>
                      </form>
                    ) : (
                      <div className="space-y-6">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-serif text-lg font-semibold text-brand-text-primary">Collections Cards</h4>
                            <p className="text-xs text-brand-text-muted mt-1">Manage the collection cards displayed on the homepage.</p>
                          </div>
                          <button onClick={openAddCollection} className="bg-brand-button hover:bg-brand-accent text-brand-bg-primary text-[10px] font-semibold py-2.5 px-4 rounded-brand tracking-widest uppercase flex items-center gap-1.5 transition-colors shadow-sm"><Plus className="w-3.5 h-3.5" />Add Card</button>
                        </div>
                        {collections.length === 0 ? (
                          <div className="text-center py-16 border border-dashed border-brand-gold/20 rounded-xl">
                            <ImageIcon className="w-10 h-10 text-brand-text-muted mx-auto mb-3" />
                            <p className="text-sm text-brand-text-muted">No collection cards yet.</p>
                            <p className="text-xs text-brand-text-muted mt-1">Add cards to showcase your product categories.</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {collections.map((item, idx) => (
                              <div key={item.id} className={`border rounded-xl overflow-hidden bg-brand-bg-primary shadow-sm transition-all ${item.active ? 'border-brand-gold/20' : 'border-brand-gold/10 opacity-60'}`}>
                                <div className="relative aspect-[4/3] bg-brand-bg-secondary">
                                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                                  {!item.active && <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><span className="text-xs font-semibold text-white uppercase tracking-widest">Hidden</span></div>}
                                  <div className="absolute top-2 left-2 bg-brand-button/90 text-brand-bg-primary text-[10px] font-bold px-2 py-0.5 rounded-full">#{idx + 1}</div>
                                </div>
                                <div className="p-4">
                                  <h5 className="font-serif text-sm font-semibold text-brand-text-primary mb-1">{item.name}</h5>
                                  <p className="text-xs text-brand-text-muted line-clamp-1 mb-1">{item.description}</p>
                                  <span className="text-[9px] text-brand-accent font-semibold uppercase tracking-wider">Tag: {item.tag}</span>
                                  <div className="flex items-center justify-between mt-3">
                                    <button onClick={() => toggleCollectionActive(item.id)} className={`text-xs font-semibold px-2 py-1 rounded-full transition-all ${item.active ? 'bg-[#25D366]/10 text-[#12a045] border border-[#25D366]/20' : 'bg-brand-text-muted/10 text-brand-text-muted border border-brand-gold/10'}`}>{item.active ? 'Active' : 'Hidden'}</button>
                                    <div className="flex items-center gap-1">
                                      <button onClick={() => moveCollection(item.id, 'up')} disabled={idx === 0} className="p-1 rounded text-brand-text-muted hover:text-brand-accent hover:bg-brand-bg-secondary disabled:opacity-30 transition-colors"><ChevronUp className="w-4 h-4" /></button>
                                      <button onClick={() => moveCollection(item.id, 'down')} disabled={idx === collections.length - 1} className="p-1 rounded text-brand-text-muted hover:text-brand-accent hover:bg-brand-bg-secondary disabled:opacity-30 transition-colors"><ChevronDown className="w-4 h-4" /></button>
                                      <button onClick={() => openEditCollection(item)} className="p-1.5 rounded-full text-brand-text-muted hover:text-brand-gold hover:bg-brand-bg-secondary transition-colors" title="Edit"><Edit2 className="w-3.5 h-3.5" /></button>
                                      <button onClick={() => deleteCollection(item.id)} className="p-1.5 rounded-full text-brand-text-muted hover:text-brand-accent hover:bg-brand-bg-secondary transition-colors" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* BEHIND THE CANVAS TAB */}
                {activeTab === 'bts' && (
                  <div>
                    {isBtsFormOpen ? (
                      <form onSubmit={handleBtsSubmit} className="space-y-6 max-w-3xl mx-auto">
                        <div className="flex items-center justify-between pb-3 border-b border-brand-gold/10">
                          <h4 className="font-serif text-lg font-semibold text-brand-text-primary">{editingBtsId ? 'Edit Collage Image' : 'Add Collage Image'}</h4>
                          <button type="button" onClick={() => setIsBtsFormOpen(false)} className="text-xs text-brand-text-muted hover:text-brand-accent font-semibold uppercase tracking-wider">Cancel</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="flex flex-col">
                            <label className="text-xs font-semibold uppercase tracking-wider text-brand-text-muted mb-2">Alt Text (for accessibility)</label>
                            <input type="text" required value={btsAlt} onChange={e => setBtsAlt(e.target.value)} placeholder="e.g. Mahi painting in her studio" className="bg-brand-bg-primary border border-brand-gold/15 rounded-xl px-4 py-3 text-sm focus:border-brand-accent focus:outline-none transition-colors" />
                          </div>
                          <div className="flex flex-col">
                            <label className="text-xs font-semibold uppercase tracking-wider text-brand-text-muted mb-2">Caption (shown on image)</label>
                            <input type="text" value={btsCaption} onChange={e => setBtsCaption(e.target.value)} placeholder="e.g. In the Studio" className="bg-brand-bg-primary border border-brand-gold/15 rounded-xl px-4 py-3 text-sm focus:border-brand-accent focus:outline-none transition-colors" />
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <label className="text-xs font-semibold uppercase tracking-wider text-brand-text-muted">Active</label>
                          <button type="button" onClick={() => setBtsActive(!btsActive)} className="text-brand-accent">{btsActive ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8 text-brand-text-muted" />}</button>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold uppercase tracking-wider text-brand-text-muted mb-2">Collage Image</span>
                          {btsImage ? (
                            <div className="relative w-48 h-64 border border-brand-gold/15 rounded-xl overflow-hidden shadow-md">
                              <Image src={btsImage} alt="Preview" fill className="object-cover" />
                              <button type="button" onClick={() => setBtsImage(null)} className="absolute top-2 right-2 bg-brand-button hover:bg-brand-accent text-white p-1.5 rounded-full shadow-md"><X className="w-4 h-4" /></button>
                            </div>
                          ) : (
                            <div onClick={() => btsFileRef.current?.click()} className="border border-dashed border-brand-gold/25 rounded-xl p-8 text-center cursor-pointer hover:border-brand-accent bg-brand-bg-primary/40 transition-colors w-fit">
                              <input type="file" ref={btsFileRef} onChange={e => handleImageUpload(e, setBtsImage)} accept="image/*" className="hidden" />
                              <ImageIcon className="w-8 h-8 text-brand-gold mx-auto mb-2" />
                              <span className="text-xs font-medium text-brand-text-primary">Select image</span>
                              <p className="text-[10px] text-brand-text-muted mt-1">Portrait (3:4) ratio recommended</p>
                            </div>
                          )}
                        </div>
                        <button type="submit" className="w-full bg-brand-button hover:bg-brand-accent text-brand-bg-primary text-xs font-semibold py-4 rounded-brand tracking-widest uppercase flex items-center justify-center gap-1.5 shadow-md transition-colors">
                          <Check className="w-4 h-4" />{editingBtsId ? 'Update Image' : 'Add to Collage'}
                        </button>
                      </form>
                    ) : (
                      <div className="space-y-6">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-serif text-lg font-semibold text-brand-text-primary">Behind the Canvas Images</h4>
                            <p className="text-xs text-brand-text-muted mt-1">Manage the collage photos shown in the &ldquo;Behind the Canvas&rdquo; section (max 2 displayed).</p>
                          </div>
                          <button onClick={openAddBts} className="bg-brand-button hover:bg-brand-accent text-brand-bg-primary text-[10px] font-semibold py-2.5 px-4 rounded-brand tracking-widest uppercase flex items-center gap-1.5 transition-colors shadow-sm"><Plus className="w-3.5 h-3.5" />Add Image</button>
                        </div>
                        {btsImages.length === 0 ? (
                          <div className="text-center py-16 border border-dashed border-brand-gold/20 rounded-xl">
                            <ImageIcon className="w-10 h-10 text-brand-text-muted mx-auto mb-3" />
                            <p className="text-sm text-brand-text-muted">No images yet.</p>
                            <p className="text-xs text-brand-text-muted mt-1">Add images for the Behind the Canvas collage.</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {btsImages.map((item, idx) => (
                              <div key={item.id} className={`border rounded-xl overflow-hidden bg-brand-bg-primary shadow-sm transition-all ${item.active ? 'border-brand-gold/20' : 'border-brand-gold/10 opacity-50'}`}>
                                <div className="relative aspect-[3/4] bg-brand-bg-secondary">
                                  <Image src={item.image} alt={item.alt} fill className="object-cover" />
                                  {!item.active && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><span className="text-xs font-semibold text-white uppercase tracking-widest">Hidden</span></div>}
                                  <div className="absolute top-2 left-2 bg-brand-button/90 text-brand-bg-primary text-[10px] font-bold px-2 py-0.5 rounded-full">#{idx + 1}</div>
                                </div>
                                <div className="p-3">
                                  <p className="text-xs text-brand-text-primary font-medium line-clamp-1 mb-1">{item.alt}</p>
                                  {item.caption && <p className="text-[10px] text-brand-text-muted mb-2">{item.caption}</p>}
                                  <div className="flex items-center justify-between">
                                    <button onClick={() => toggleBtsActive(item.id)} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full transition-all ${item.active ? 'bg-[#25D366]/10 text-[#12a045] border border-[#25D366]/20' : 'bg-brand-text-muted/10 text-brand-text-muted border border-brand-gold/10'}`}>{item.active ? 'Visible' : 'Hidden'}</button>
                                    <div className="flex items-center gap-1">
                                      <button onClick={() => moveBts(item.id, 'up')} disabled={idx === 0} className="p-1 rounded text-brand-text-muted hover:text-brand-accent hover:bg-brand-bg-secondary disabled:opacity-30 transition-colors"><ChevronUp className="w-3.5 h-3.5" /></button>
                                      <button onClick={() => moveBts(item.id, 'down')} disabled={idx === btsImages.length - 1} className="p-1 rounded text-brand-text-muted hover:text-brand-accent hover:bg-brand-bg-secondary disabled:opacity-30 transition-colors"><ChevronDown className="w-3.5 h-3.5" /></button>
                                      <button onClick={() => openEditBts(item)} className="p-1 rounded-full text-brand-text-muted hover:text-brand-gold hover:bg-brand-bg-secondary transition-colors" title="Edit"><Edit2 className="w-3 h-3" /></button>
                                      <button onClick={() => deleteBts(item.id)} className="p-1 rounded-full text-brand-text-muted hover:text-brand-accent hover:bg-brand-bg-secondary transition-colors" title="Delete"><Trash2 className="w-3 h-3" /></button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* INSTAGRAM TAB */}
                {activeTab === 'instagram' && (
                  <div>
                    {isInstagramFormOpen ? (
                      <form onSubmit={handleInstagramSubmit} className="space-y-6 max-w-3xl mx-auto">
                        <div className="flex items-center justify-between pb-3 border-b border-brand-gold/10">
                          <h4 className="font-serif text-lg font-semibold text-brand-text-primary">{editingInstagramId ? 'Edit Instagram Post' : 'Add Instagram Post'}</h4>
                          <button type="button" onClick={() => setIsInstagramFormOpen(false)} className="text-xs text-brand-text-muted hover:text-brand-accent font-semibold uppercase tracking-wider">Cancel</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="flex flex-col">
                            <label className="text-xs font-semibold uppercase tracking-wider text-brand-text-muted mb-2">Instagram Post URL</label>
                            <input type="url" value={instagramUrl} onChange={e => setInstagramUrl(e.target.value)} placeholder="https://instagram.com/p/ABC123..." className="bg-brand-bg-primary border border-brand-gold/15 rounded-xl px-4 py-3 text-sm focus:border-brand-accent focus:outline-none transition-colors" />
                          </div>
                          <div className="flex flex-col">
                            <label className="text-xs font-semibold uppercase tracking-wider text-brand-text-muted mb-2">Caption / Description</label>
                            <input type="text" required value={instagramCaption} onChange={e => setInstagramCaption(e.target.value)} placeholder="e.g. New cosmic collection now live!" className="bg-brand-bg-primary border border-brand-gold/15 rounded-xl px-4 py-3 text-sm focus:border-brand-accent focus:outline-none transition-colors" />
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <label className="text-xs font-semibold uppercase tracking-wider text-brand-text-muted">Active</label>
                          <button type="button" onClick={() => setInstagramActive(!instagramActive)} className="text-brand-accent">{instagramActive ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8 text-brand-text-muted" />}</button>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold uppercase tracking-wider text-brand-text-muted mb-2">Post Thumbnail</span>
                          {instagramImage ? (
                            <div className="relative w-48 h-48 border border-brand-gold/15 rounded-xl overflow-hidden shadow-md">
                              <Image src={instagramImage} alt="Instagram preview" fill className="object-cover" />
                              <button type="button" onClick={() => setInstagramImage(null)} className="absolute top-2 right-2 bg-brand-button hover:bg-brand-accent text-white p-1.5 rounded-full shadow-md"><X className="w-4 h-4" /></button>
                            </div>
                          ) : (
                            <div onClick={() => instagramFileRef.current?.click()} className="border border-dashed border-brand-gold/25 rounded-xl p-8 text-center cursor-pointer hover:border-brand-accent bg-brand-bg-primary/40 transition-colors w-fit">
                              <input type="file" ref={instagramFileRef} onChange={e => handleImageUpload(e, setInstagramImage)} accept="image/*" className="hidden" />
                              <InstagramIcon className="w-8 h-8 text-brand-gold mx-auto mb-2" />
                              <span className="text-xs font-medium text-brand-text-primary">Select post thumbnail</span>
                              <p className="text-[10px] text-brand-text-muted mt-1">Square ratio recommended (1:1)</p>
                            </div>
                          )}
                        </div>
                        <button type="submit" className="w-full bg-brand-button hover:bg-brand-accent text-brand-bg-primary text-xs font-semibold py-4 rounded-brand tracking-widest uppercase flex items-center justify-center gap-1.5 shadow-md transition-colors">
                          <Check className="w-4 h-4" />{editingInstagramId ? 'Update Instagram Post' : 'Add Instagram Post'}
                        </button>
                      </form>
                    ) : (
                      <div className="space-y-6">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-serif text-lg font-semibold text-brand-text-primary">Instagram Feed Posts</h4>
                            <p className="text-xs text-brand-text-muted mt-1">Manage Instagram posts displayed on your website&apos;s social section.</p>
                          </div>
                          <button onClick={openAddInstagram} className="bg-brand-button hover:bg-brand-accent text-brand-bg-primary text-[10px] font-semibold py-2.5 px-4 rounded-brand tracking-widest uppercase flex items-center gap-1.5 transition-colors shadow-sm"><Plus className="w-3.5 h-3.5" />Add Post</button>
                        </div>
                        {instagramPosts.length === 0 ? (
                          <div className="text-center py-16 border border-dashed border-brand-gold/20 rounded-xl">
                            <InstagramIcon className="w-10 h-10 text-brand-text-muted mx-auto mb-3" />
                            <p className="text-sm text-brand-text-muted">No Instagram posts added yet.</p>
                            <p className="text-xs text-brand-text-muted mt-1">Add posts to showcase your Instagram feed on the website.</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {instagramPosts.map((post, idx) => (
                              <div key={post.id} className={`border rounded-xl overflow-hidden bg-brand-bg-primary shadow-sm transition-all ${post.active ? 'border-brand-gold/20' : 'border-brand-gold/10 opacity-50'}`}>
                                <div className="relative aspect-square bg-brand-bg-secondary">
                                  <Image src={post.image} alt={post.caption} fill className="object-cover" />
                                  {!post.active && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><span className="text-xs font-semibold text-white uppercase tracking-widest">Hidden</span></div>}
                                  <div className="absolute top-2 left-2 bg-brand-button/90 text-brand-bg-primary text-[10px] font-bold px-2 py-0.5 rounded-full">#{idx + 1}</div>
                                </div>
                                <div className="p-3">
                                  <p className="text-xs text-brand-text-primary font-medium line-clamp-2 mb-2">{post.caption}</p>
                                  {post.postUrl && <a href={post.postUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-brand-accent hover:underline flex items-center gap-1 mb-3"><span>View on Instagram</span></a>}
                                  <div className="flex items-center justify-between">
                                    <button onClick={() => toggleInstagramActive(post.id)} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full transition-all ${post.active ? 'bg-[#E1306C]/10 text-[#E1306C] border border-[#E1306C]/20' : 'bg-brand-text-muted/10 text-brand-text-muted border border-brand-gold/10'}`}>{post.active ? 'Visible' : 'Hidden'}</button>
                                    <div className="flex items-center gap-1">
                                      <button onClick={() => moveInstagram(post.id, 'up')} disabled={idx === 0} className="p-1 rounded text-brand-text-muted hover:text-brand-accent hover:bg-brand-bg-secondary disabled:opacity-30 transition-colors"><ChevronUp className="w-3.5 h-3.5" /></button>
                                      <button onClick={() => moveInstagram(post.id, 'down')} disabled={idx === instagramPosts.length - 1} className="p-1 rounded text-brand-text-muted hover:text-brand-accent hover:bg-brand-bg-secondary disabled:opacity-30 transition-colors"><ChevronDown className="w-3.5 h-3.5" /></button>
                                      <button onClick={() => openEditInstagram(post)} className="p-1 rounded-full text-brand-text-muted hover:text-brand-gold hover:bg-brand-bg-secondary transition-colors" title="Edit"><Edit2 className="w-3 h-3" /></button>
                                      <button onClick={() => deleteInstagram(post.id)} className="p-1 rounded-full text-brand-text-muted hover:text-brand-accent hover:bg-brand-bg-secondary transition-colors" title="Delete"><Trash2 className="w-3 h-3" /></button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {isAdmin && (
          <div className="p-5 border-t border-brand-gold/15 bg-brand-bg-secondary/20 flex justify-between items-center text-xs shrink-0">
            <span className="text-brand-text-muted font-light">Changes persist locally in your browser.</span>
            <button onClick={onToggleAdmin} className="text-brand-accent hover:underline font-semibold uppercase tracking-wider text-[10px]">Log Out</button>
          </div>
        )}
      </div>
    </div>
  );
}