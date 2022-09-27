import * as React from 'react';
import { useForm } from 'react-hook-form';
import { useCardStore } from '../stores/CardStore';
import { ButtonGrey } from './Button';

type UnlockFormData = {
  pin: string;
  confirmPin: string;
};

const InitialiseCard: React.FC = () => {
  const { initialiseCard, selectedCardId } = useCardStore();

  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    watch,
    formState: { isValid, isSubmitting },
  } = useForm<UnlockFormData>({ mode: 'onChange' });

  React.useEffect(() => {
    setFocus('pin');
  }, [setFocus]);

  const pin = watch('pin');
  const confirmPin = watch('confirmPin');

  const match = pin === confirmPin;

  return (
    <div className="flex flex-col justify-center mx-auto w-full max-w-md bg-white py-8 shadow rounded-lg px-10">
      <h2 className="text-lg font-semibold">Initialise card</h2>
      <p className="text-sm">Enter a 6 digit pin [0-9]</p>
      <form
        className="space-y-6"
        onSubmit={handleSubmit(async (data: UnlockFormData) => {
          try {
            if (!selectedCardId) {
              throw new Error('No selected card id');
            }
            await initialiseCard(selectedCardId, data.pin);
            setFocus('pin');
            reset();
          } catch (error) {
            console.error(error);
          }
        })}
      >
        <input
          placeholder="Card pin"
          type="password"
          className="block w-full appearance-none rounded-md border border-gray-300 mt-1 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-cyan-500 sm:text-sm"
          {...register('pin', { required: true, maxLength: 6, minLength: 6 })}
        />
        <input
          placeholder="Confirm card pin"
          type="password"
          className="block w-full appearance-none rounded-md border border-gray-300 mt-1 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-cyan-500 sm:text-sm"
          {...register('confirmPin', {
            required: true,
            maxLength: 6,
            minLength: 6,
          })}
        />
        <ButtonGrey
          type="submit"
          disabled={!isValid || !match}
          loading={isSubmitting}
          className="w-full"
        >
          Initialise & Unlock
        </ButtonGrey>
      </form>
      <div className="text-center mt-3">
        {confirmPin?.length > 0 && pin.length !== 6 && (
          <span className=" text-red-500">{`Pin must be 6 digits [0-9]`}</span>
        )}
      </div>

      <div className="text-center mt-3">
        {confirmPin?.length > 0 && !match && (
          <span className=" text-red-500">{`Pins don't match`}</span>
        )}
      </div>
    </div>
  );
};

export default InitialiseCard;
