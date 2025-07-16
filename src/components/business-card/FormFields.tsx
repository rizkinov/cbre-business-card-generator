"use client";

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { Checkbox } from "@/src/components/ui/checkbox";
import { CBREBadge } from "@/src/components/cbre/CBREBadge";
import { BusinessCardFormData } from "@/types/business-card";
import { AlertCircle, Info } from "lucide-react";

interface FormFieldsProps {
  form: UseFormReturn<BusinessCardFormData>;
  isSubmitting?: boolean;
}

export function FormFields({ form, isSubmitting = false }: FormFieldsProps) {
  const { register, formState: { errors }, watch, setValue } = form;
  
  const watchedBleed = watch('includeBleed');

  return (
    <div className="space-y-6">
      {/* Personal Information Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-financier font-medium text-cbre-green">
            Personal Information
          </h3>
          <CBREBadge variant="outline" className="text-xs">Required</CBREBadge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-sm font-medium">
              Full Name *
            </Label>
            <Input
              id="fullName"
              {...register('fullName')}
              className={`${errors.fullName ? 'border-red-500' : ''}`}
              placeholder="John Doe"
              disabled={isSubmitting}
            />
            {errors.fullName && (
              <div className="flex items-center gap-1 text-red-500 text-xs">
                <AlertCircle className="w-3 h-3" />
                {errors.fullName.message}
              </div>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Title *
            </Label>
            <Input
              id="title"
              {...register('title')}
              className={`${errors.title ? 'border-red-500' : ''}`}
              placeholder="Director, GWS APAC"
              disabled={isSubmitting}
            />
            {errors.title && (
              <div className="flex items-center gap-1 text-red-500 text-xs">
                <AlertCircle className="w-3 h-3" />
                {errors.title.message}
              </div>
            )}
          </div>

          {/* License Number */}
          <div className="space-y-2">
            <Label htmlFor="licenseNumber" className="text-sm font-medium">
              License Number
              <span className="text-gray-500 ml-1">(Optional)</span>
            </Label>
            <Input
              id="licenseNumber"
              {...register('licenseNumber')}
              className={`${errors.licenseNumber ? 'border-red-500' : ''}`}
              placeholder="1234AB"
              disabled={isSubmitting}
            />
            {errors.licenseNumber && (
              <div className="flex items-center gap-1 text-red-500 text-xs">
                <AlertCircle className="w-3 h-3" />
                {errors.licenseNumber.message}
              </div>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              className={`${errors.email ? 'border-red-500' : ''}`}
              placeholder="john.doe@cbre.com"
              disabled={isSubmitting}
            />
            {errors.email && (
              <div className="flex items-center gap-1 text-red-500 text-xs">
                <AlertCircle className="w-3 h-3" />
                {errors.email.message}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Office Information Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-financier font-medium text-cbre-green">
            Office Information
          </h3>
          <CBREBadge variant="outline" className="text-xs">Required</CBREBadge>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {/* Office Name */}
          <div className="space-y-2">
            <Label htmlFor="officeName" className="text-sm font-medium">
              Office Name *
            </Label>
            <Input
              id="officeName"
              {...register('officeName')}
              className={`${errors.officeName ? 'border-red-500' : ''}`}
              placeholder="CBRE GWS APAC"
              disabled={isSubmitting}
            />
            {errors.officeName && (
              <div className="flex items-center gap-1 text-red-500 text-xs">
                <AlertCircle className="w-3 h-3" />
                {errors.officeName.message}
              </div>
            )}
          </div>

          {/* Office Address */}
          <div className="space-y-2">
            <Label htmlFor="officeAddress" className="text-sm font-medium">
              Office Address *
            </Label>
            <Textarea
              id="officeAddress"
              {...register('officeAddress')}
              className={`${errors.officeAddress ? 'border-red-500' : ''} min-h-[80px]`}
              placeholder="18.01, Level 18, 1Powerhouse Persiaran Bandar Utama, Bandar Utama, Petaling Jaya, Selangor 47800, Malaysia"
              disabled={isSubmitting}
            />
            {errors.officeAddress && (
              <div className="flex items-center gap-1 text-red-500 text-xs">
                <AlertCircle className="w-3 h-3" />
                {errors.officeAddress.message}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-financier font-medium text-cbre-green">
            Contact Information
          </h3>
          <CBREBadge variant="outline" className="text-xs">Required</CBREBadge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Telephone */}
          <div className="space-y-2">
            <Label htmlFor="telephone" className="text-sm font-medium">
              Telephone *
            </Label>
            <Input
              id="telephone"
              type="tel"
              {...register('telephone')}
              className={`${errors.telephone ? 'border-red-500' : ''}`}
              placeholder="03-12345678"
              disabled={isSubmitting}
            />
            {errors.telephone && (
              <div className="flex items-center gap-1 text-red-500 text-xs">
                <AlertCircle className="w-3 h-3" />
                {errors.telephone.message}
              </div>
            )}
          </div>

          {/* Mobile */}
          <div className="space-y-2">
            <Label htmlFor="mobile" className="text-sm font-medium">
              Mobile *
            </Label>
            <Input
              id="mobile"
              type="tel"
              {...register('mobile')}
              className={`${errors.mobile ? 'border-red-500' : ''}`}
              placeholder="012-3456789"
              disabled={isSubmitting}
            />
            {errors.mobile && (
              <div className="flex items-center gap-1 text-red-500 text-xs">
                <AlertCircle className="w-3 h-3" />
                {errors.mobile.message}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Design Options Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-financier font-medium text-cbre-green">
            Options
          </h3>
        </div>
        
        <div className="space-y-4">
          {/* 3mm Bleed Toggle */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox
                id="includeBleed"
                checked={watchedBleed}
                onCheckedChange={(checked: boolean) => setValue('includeBleed', checked)}
                disabled={isSubmitting}
              />
              <Label htmlFor="includeBleed" className="text-sm font-medium">
                Include 3mm bleed for professional printing
              </Label>
            </div>
            <div className="flex items-center gap-1 text-gray-600 text-xs">
              <Info className="w-3 h-3" />
              <span>
                Bleed adds 3mm border around the card (final size: 95mm × 56mm)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 