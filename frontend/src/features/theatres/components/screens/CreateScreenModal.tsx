import { Button, FormErrorBanner, Input, Modal } from '@/shared/ui';
import { SCREEN_NAME_MAX_LENGTH } from '../../schemas/createScreenForm.schema';
import { useCreateScreenForm } from '../../hooks/useCreateScreenForm';

export interface CreateScreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  theatreId: string;
}

export default function CreateScreenModal({ isOpen, onClose, theatreId }: CreateScreenModalProps) {
  const {
    form,
    onSubmit,
    handleClose,
    isSubmitting,
    serverError,
    setServerError,
    unmappedErrors,
  } = useCreateScreenForm({
    theatreId,
    onClose,
  });

  const {
    register,
    formState: { errors },
  } = form;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add New Screen"
      description="Create a screen for this theatre. Seat layouts can be configured after creation."
      size="md"
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-6" noValidate>
        <FormErrorBanner
          message={serverError}
          unmappedErrors={unmappedErrors}
          onDismiss={() => setServerError(null)}
        />

        <Input
          id="screen-name"
          label="Screen Name *"
          placeholder="e.g. Audi 1"
          autoComplete="off"
          maxLength={SCREEN_NAME_MAX_LENGTH}
          disabled={isSubmitting}
          error={errors.name?.message}
          helperText="Must be unique within this theatre."
          {...register('name')}
        />

        <div className="flex items-center justify-end gap-3 border-t border-border pt-3">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isSubmitting}
            className="min-w-[120px] font-medium"
          >
            {isSubmitting ? 'Creating...' : 'Create Screen'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
