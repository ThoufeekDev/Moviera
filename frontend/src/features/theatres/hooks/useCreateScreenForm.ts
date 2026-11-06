import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import {
  createScreenFormSchema,
  defaultCreateScreenFormValues,
  type CreateScreenFormValues,
} from '../schemas/createScreenForm.schema';
import { buildCreateScreenPayload } from '../utils/buildCreateScreenPayload';
import { setFormServerErrors } from '@/shared/lib/formErrors';
import { useCreateScreen } from './useCreateScreen';

interface UseCreateScreenFormOptions {
  theatreId: string;
  onClose: () => void;
}

export const useCreateScreenForm = ({ theatreId, onClose }: UseCreateScreenFormOptions) => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [unmappedErrors, setUnmappedErrors] = useState<string[]>([]);
  const createScreenMutation = useCreateScreen();

  const form = useForm<CreateScreenFormValues>({
    resolver: zodResolver(createScreenFormSchema),
    defaultValues: defaultCreateScreenFormValues,
    mode: 'onTouched',
  });

  const { handleSubmit, reset, setError } = form;
  const isSubmitting = createScreenMutation.isPending;

  const handleClose = useCallback(() => {
    if (isSubmitting) return;
    reset(defaultCreateScreenFormValues);
    setServerError(null);
    setUnmappedErrors([]);
    onClose();
  }, [isSubmitting, reset, onClose]);

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    setUnmappedErrors([]);
    const payload = buildCreateScreenPayload(theatreId, values);

    try {
      const screen = await createScreenMutation.mutateAsync(payload);
      toast.success(`Screen "${screen.name}" created successfully.`);
      reset(defaultCreateScreenFormValues);
      onClose();
    } catch (error) {
      const result = setFormServerErrors(setError, error);
      setServerError(result.generalMessage);
      setUnmappedErrors(result.unmappedErrors);
    }
  });

  return {
    form,
    onSubmit,
    handleClose,
    isSubmitting,
    serverError,
    setServerError,
    unmappedErrors,
  };
};
