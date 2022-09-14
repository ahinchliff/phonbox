import * as React from 'react';
import { useForm } from 'react-hook-form';
import { useCardStore } from '../stores/CardStore';
import { ButtonGrey } from './Button';

type UnlockFormData = {
  pin: string;
};

const UnlockCard: React.FC = () => {
  const { selectedCard, unlock } = useCardStore();

  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { isValid, isSubmitting },
  } = useForm<UnlockFormData>({ mode: 'onChange' });

  React.useEffect(() => {
    setFocus('pin');
  }, [setFocus]);

  return (
    <div className="flex flex-col justify-center mt-8 mx-auto w-full max-w-md bg-white py-8 shadow rounded-lg px-10">
      <form
        className="space-y-6"
        onSubmit={handleSubmit(async (data: UnlockFormData) => {
          await unlock(data.pin);
          setFocus('pin');
          reset();
        })}
      >
        <input
          placeholder="Card pin"
          type="password"
          className="block w-full appearance-none rounded-md border border-gray-300 mt-1 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
          {...register('pin', { required: true, maxLength: 6, minLength: 6 })}
        />
        <ButtonGrey
          type="submit"
          disabled={!isValid}
          loading={isSubmitting}
          className="w-full"
        >
          Unlock Card
        </ButtonGrey>
      </form>
      <div className="text-center mt-3">
        {selectedCard?.unlockTriesRemaining && (
          <span className=" text-red-500">{`Incorrect pin. ${selectedCard?.unlockTriesRemaining} tries remaining`}</span>
        )}
      </div>
    </div>
  );
};

export default UnlockCard;
