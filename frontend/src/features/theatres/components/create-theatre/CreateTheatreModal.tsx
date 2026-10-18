import { FormProvider } from 'react-hook-form';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Modal, Button } from '@/shared/ui';
import { useCreateTheatreForm } from '../../hooks/useCreateTheatreForm';
import { BasicInfoSection } from './sections/BasicInfoSection';
import { LocationSection } from './sections/LocationSection';
import { ContactLicenseSection } from './sections/ContactLicenseSection';
import { MediaStatusSection } from './sections/MediaStatusSection';

export interface CreateTheatreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (theatreName: string) => void;
}

export function CreateTheatreModal({ isOpen, onClose, onSuccess }: CreateTheatreModalProps) {
  const {
    form,
    locationMode,
    manualCityType,
    setManualCityType,
    logoError,
    serverError,
    isCitiesLoading,
    cityOptions,
    selectedPlaceId,
    selectedPlaceAddress,
    selectedCoordinates,
    isPending,
    handleClose,
    handleLogoSelect,
    handleLogoRemove,
    handleGooglePlaceSelect,
    handleSwitchLocationMode,
    handleCityChange,
    handleSubmit,
  } = useCreateTheatreForm({ onClose, onSuccess });

  return (
    <Modal
      isOpen={isOpen}
      onClose={isPending ? () => {} : handleClose}
      title="Create New Theatre"
      description="Register a new cinema multiplex or single screen theatre."
      size="xl"
    >
      <FormProvider {...form}>
        <form onSubmit={handleSubmit} className="space-y-6">
          {serverError && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-lg border border-danger-200 bg-danger-50 p-3.5 text-danger-700"
            >
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-danger-600" />
              <div className="text-sm">
                <span className="font-semibold">Unable to register theatre:</span>
                <p className="mt-0.5">{serverError}</p>
              </div>
            </div>
          )}

          {/* Section 1: Basic Information */}
          <BasicInfoSection disabled={isPending} />

          {/* Section 2: Address & Location */}
          <LocationSection
            locationMode={locationMode}
            onSwitchLocationMode={handleSwitchLocationMode}
            manualCityType={manualCityType}
            onManualCityTypeChange={setManualCityType}
            isCitiesLoading={isCitiesLoading}
            cityOptions={cityOptions}
            onCityChange={handleCityChange}
            onGooglePlaceSelect={handleGooglePlaceSelect}
            selectedPlaceId={selectedPlaceId}
            selectedAddress={selectedPlaceAddress}
            selectedCoordinates={selectedCoordinates}
            disabled={isPending}
          />

          {/* Section 3: Contact & Legal Details */}
          <ContactLicenseSection disabled={isPending} />

          {/* Section 4: Branding & Operational Status */}
          <MediaStatusSection
            disabled={isPending}
            logoError={logoError}
            onLogoSelect={handleLogoSelect}
            onLogoRemove={handleLogoRemove}
          />

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={handleClose}
              disabled={isPending}
              className="cursor-pointer"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isPending}
              className="min-w-[130px] flex items-center justify-center gap-2 cursor-pointer font-medium"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <span>Create Theatre</span>
              )}
            </Button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
}

export default CreateTheatreModal;
