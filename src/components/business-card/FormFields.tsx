"use client";

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { CBREInput } from "@/src/components/cbre/CBREInput";
import { CBRETextarea } from "@/src/components/cbre/CBRETextarea";
import { Checkbox } from "@/src/components/cbre/CBRECheckbox";
import { Label } from "@/src/components/ui/label";
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
    <div className="space-y-8">
      {/* Personal Information Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-900">Personal Information</h3>
          <span className="text-xs text-gray-400">Required</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <Label htmlFor="fullName" className="text-sm text-gray-600">
              Full Name *
            </Label>
            <CBREInput
              id="fullName"
              {...register('fullName')}
              error={!!errors.fullName}
              placeholder="John Doe"
              disabled={isSubmitting}
            />
            {errors.fullName && (
              <div className="flex items-center gap-1 text-red-600 text-xs">
                <AlertCircle className="w-3 h-3" />
                {errors.fullName.message}
              </div>
            )}
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-sm text-gray-600">
              Title *
            </Label>
            <CBRETextarea
              id="title"
              {...register('title')}
              error={!!errors.title}
              className="min-h-[60px]"
              placeholder="Director, GWS APAC"
              disabled={isSubmitting}
            />
            <div className="flex items-center gap-1 text-gray-400 text-xs">
              <Info className="w-3 h-3" />
              <span>Press Enter to add a second line</span>
            </div>
            {errors.title && (
              <div className="flex items-center gap-1 text-red-600 text-xs">
                <AlertCircle className="w-3 h-3" />
                {errors.title.message}
              </div>
            )}
          </div>

          {/* License Number */}
          <div className="space-y-1.5">
            <Label htmlFor="licenseNumber" className="text-sm text-gray-600">
              License Number <span className="text-gray-400">(Optional)</span>
            </Label>
            <CBREInput
              id="licenseNumber"
              {...register('licenseNumber')}
              error={!!errors.licenseNumber}
              placeholder="1234AB"
              disabled={isSubmitting}
            />
            {errors.licenseNumber && (
              <div className="flex items-center gap-1 text-red-600 text-xs">
                <AlertCircle className="w-3 h-3" />
                {errors.licenseNumber.message}
              </div>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm text-gray-600">
              Email Address *
            </Label>
            <CBREInput
              id="email"
              type="email"
              {...register('email')}
              error={!!errors.email}
              placeholder="john.doe@cbre.com"
              disabled={isSubmitting}
            />
            {errors.email && (
              <div className="flex items-center gap-1 text-red-600 text-xs">
                <AlertCircle className="w-3 h-3" />
                {errors.email.message}
              </div>
            )}
          </div>
        </div>
      </section>

      <hr className="border-gray-200" />

      {/* Office Information Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-900">Office Information</h3>
          <span className="text-xs text-gray-400">Required</span>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {/* Office Name */}
          <div className="space-y-1.5">
            <Label htmlFor="officeName" className="text-sm text-gray-600">
              Office Name *
            </Label>
            <CBREInput
              id="officeName"
              {...register('officeName')}
              error={!!errors.officeName}
              placeholder="CBRE GWS APAC"
              disabled={isSubmitting}
            />
            {errors.officeName && (
              <div className="flex items-center gap-1 text-red-600 text-xs">
                <AlertCircle className="w-3 h-3" />
                {errors.officeName.message}
              </div>
            )}
          </div>

          {/* Office Address */}
          <div className="space-y-1.5">
            <Label htmlFor="officeAddress" className="text-sm text-gray-600">
              Office Address *
            </Label>
            <CBRETextarea
              id="officeAddress"
              {...register('officeAddress')}
              error={!!errors.officeAddress}
              className="min-h-[80px]"
              placeholder="18.01, Level 18, 1Powerhouse Persiaran Bandar Utama, Bandar Utama, Petaling Jaya, Selangor 47800, Malaysia"
              disabled={isSubmitting}
            />
            {errors.officeAddress && (
              <div className="flex items-center gap-1 text-red-600 text-xs">
                <AlertCircle className="w-3 h-3" />
                {errors.officeAddress.message}
              </div>
            )}
          </div>
        </div>
      </section>

      <hr className="border-gray-200" />

      {/* Contact Information Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-900">Contact Information</h3>
          <span className="text-xs text-gray-400">Required</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Telephone */}
          <div className="space-y-1.5">
            <Label htmlFor="telephone" className="text-sm text-gray-600">
              Telephone *
            </Label>
            <CBREInput
              id="telephone"
              type="tel"
              {...register('telephone')}
              error={!!errors.telephone}
              placeholder="03-12345678"
              disabled={isSubmitting}
            />
            {errors.telephone && (
              <div className="flex items-center gap-1 text-red-600 text-xs">
                <AlertCircle className="w-3 h-3" />
                {errors.telephone.message}
              </div>
            )}
          </div>

          {/* Mobile */}
          <div className="space-y-1.5">
            <Label htmlFor="mobile" className="text-sm text-gray-600">
              Mobile *
            </Label>
            <CBREInput
              id="mobile"
              type="tel"
              {...register('mobile')}
              error={!!errors.mobile}
              placeholder="012-3456789"
              disabled={isSubmitting}
            />
            {errors.mobile && (
              <div className="flex items-center gap-1 text-red-600 text-xs">
                <AlertCircle className="w-3 h-3" />
                {errors.mobile.message}
              </div>
            )}
          </div>
        </div>
      </section>

      <hr className="border-gray-200" />

      {/* Options Section */}
      <section>
        <h3 className="text-base font-semibold text-gray-900 mb-4">Options</h3>
        <div className="flex items-start gap-3">
          <Checkbox
            id="includeBleed"
            checked={watchedBleed}
            onCheckedChange={(checked: boolean) => setValue('includeBleed', checked)}
            disabled={isSubmitting}
            className="mt-0.5"
          />
          <div className="space-y-0.5">
            <Label htmlFor="includeBleed" className="text-sm text-gray-700 cursor-pointer leading-none">
              Include 3mm bleed for professional printing
            </Label>
            <p className="text-xs text-gray-400">
              Bleed adds 3mm border around the card (final size: 95mm × 56mm)
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
