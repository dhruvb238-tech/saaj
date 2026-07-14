'use client';

import { useState, useRef, ChangeEvent, FormEvent } from 'react';
import { Upload, X, Send, Check } from 'lucide-react';
import Image from 'next/image';
import { getWhatsAppCustomOrderLink } from '@/config/brand';

export default function CustomInquiryForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    category: 'Canvas Paintings',
    size: '12 x 12 inches',
    occasion: 'None / Personal Use',
    description: '',
  });
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizes = [
    '6 x 6 inches (Mini Easel)',
    '12 x 12 inches (Square)',
    '12 x 16 inches (Medium Portrait)',
    '18 x 24 inches (Large Showcase)',
    'Custom Size (Specify in details)',
  ];

  const categories = [
    'Canvas Paintings',
    'Mini Easel Art',
    'Home Decor',
    'Festive Collection',
  ];

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Compile details into a WhatsApp message format
    const messageDetails = `
*Name:* ${formData.name}
*Phone:* ${formData.phone}
*Category:* ${formData.category}
*Size:* ${formData.size}
*Occasion:* ${formData.occasion}
*Vision & Brief:* ${formData.description}
${imagePreview ? '_[I have an inspiration image ready to share with you!]_' : ''}
`.trim();

    const waLink = getWhatsAppCustomOrderLink(messageDetails);
    
    // Open in new window
    window.open(waLink, '_blank');
    setIsSubmitted(true);

    // Reset form after a delay
    setTimeout(() => {
      setFormData({
        name: '',
        phone: '',
        category: 'Canvas Paintings',
        size: '12 x 12 inches',
        occasion: 'None / Personal Use',
        description: '',
      });
      setImagePreview(null);
      setIsSubmitted(false);
    }, 3000);
  };

  return (
    <section id="custom-inquiry" className="py-24 bg-brand-bg-primary relative border-t border-brand-gold/15">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-brand-accent font-semibold mb-3 inline-block">
            Bespoke Creations
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-brand-text-primary mb-4">
            Commission Custom Art
          </h2>
          <div className="w-12 h-[1px] bg-brand-gold mx-auto mb-4" />
          <p className="text-sm md:text-base text-brand-text-muted font-light">
            Have a specific vision, size, or color palette in mind? Tell us about it, and Mahi will bring it to life on canvas.
          </p>
        </div>

        {/* Custom Form Card */}
        <div className="bg-brand-bg-secondary/40 rounded-brand p-8 md:p-12 luxury-border border luxury-shadow">
          {isSubmitted ? (
            <div className="flex flex-col items-center justify-center text-center py-12 space-y-4">
              <div className="w-16 h-16 bg-brand-accent/10 text-brand-accent rounded-full flex items-center justify-center">
                <Check className="w-8 h-8 animate-scale" />
              </div>
              <h3 className="font-serif text-2xl font-semibold text-brand-text-primary">
                Inquiry Compiled!
              </h3>
              <p className="text-sm text-brand-text-muted max-w-md">
                Redirecting to WhatsApp to send your specifications directly to Mahi. If it didn't open automatically, please verify pop-ups are allowed.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="flex flex-col">
                  <label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-brand-text-muted mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    className="bg-brand-bg-primary border border-brand-gold/15 rounded-xl px-4 py-3 text-sm focus:border-brand-accent focus:outline-none transition-colors duration-300"
                  />
                </div>

                {/* Phone */}
                <div className="flex flex-col">
                  <label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wider text-brand-text-muted mb-2">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g. +91 98765 43210"
                    className="bg-brand-bg-primary border border-brand-gold/15 rounded-xl px-4 py-3 text-sm focus:border-brand-accent focus:outline-none transition-colors duration-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Category */}
                <div className="flex flex-col">
                  <label htmlFor="category" className="text-xs font-semibold uppercase tracking-wider text-brand-text-muted mb-2">
                    Art Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="bg-brand-bg-primary border border-brand-gold/15 rounded-xl px-4 py-3 text-sm focus:border-brand-accent focus:outline-none transition-colors duration-300"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Size */}
                <div className="flex flex-col">
                  <label htmlFor="size" className="text-xs font-semibold uppercase tracking-wider text-brand-text-muted mb-2">
                    Preferred Dimensions
                  </label>
                  <select
                    id="size"
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                    className="bg-brand-bg-primary border border-brand-gold/15 rounded-xl px-4 py-3 text-sm focus:border-brand-accent focus:outline-none transition-colors duration-300"
                  >
                    {sizes.map((sz) => (
                      <option key={sz} value={sz}>
                        {sz}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Occasion */}
                <div className="flex flex-col">
                  <label htmlFor="occasion" className="text-xs font-semibold uppercase tracking-wider text-brand-text-muted mb-2">
                    Special Occasion (Optional)
                  </label>
                  <input
                    type="text"
                    id="occasion"
                    name="occasion"
                    value={formData.occasion}
                    onChange={handleInputChange}
                    placeholder="e.g. Diwali, Anniversary, Housewarming"
                    className="bg-brand-bg-primary border border-brand-gold/15 rounded-xl px-4 py-3 text-sm focus:border-brand-accent focus:outline-none transition-colors duration-300"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col">
                <label htmlFor="description" className="text-xs font-semibold uppercase tracking-wider text-brand-text-muted mb-2">
                  Describe Your Vision
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your color preferences, themes, mood, or context where the art will be displayed..."
                  className="bg-brand-bg-primary border border-brand-gold/15 rounded-xl px-4 py-3 text-sm focus:border-brand-accent focus:outline-none transition-colors duration-300 resize-none"
                />
              </div>

              {/* Inspiration Image Upload */}
              <div className="flex flex-col">
                <span className="text-xs font-semibold uppercase tracking-wider text-brand-text-muted mb-2">
                  Upload Inspiration / Reference Image
                </span>
                
                {imagePreview ? (
                  <div className="relative w-full max-w-[200px] aspect-square rounded-xl overflow-hidden border border-brand-gold/20">
                    <Image
                      src={imagePreview}
                      alt="Inspiration thumbnail"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-brand-button hover:bg-brand-accent text-white p-1 rounded-full shadow-md transition-colors duration-300"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-brand-gold/25 rounded-xl p-8 text-center cursor-pointer hover:border-brand-accent transition-colors duration-300 bg-brand-bg-primary/50"
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <Upload className="w-8 h-8 text-brand-gold mx-auto mb-2" />
                    <p className="text-sm font-medium text-brand-text-primary">
                      Click to upload an image
                    </p>
                    <p className="text-xs text-brand-text-muted mt-1">
                      PNG, JPG or WEBP (Max 5MB)
                    </p>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-brand-button hover:bg-brand-accent text-brand-bg-primary text-xs font-semibold py-4 px-8 rounded-brand tracking-widest uppercase flex items-center justify-center gap-2 shadow-md transition-all duration-300"
              >
                <Send className="w-4 h-4" />
                Submit and Inquire on WhatsApp
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
