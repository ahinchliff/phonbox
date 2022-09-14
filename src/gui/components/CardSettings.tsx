import * as React from 'react';
import { useForm } from 'react-hook-form';
import { useCardStore } from '../stores/CardStore';
import { ButtonGrey } from './Button';

type UpdateCardPinFormData = {
  pin: string;
};

type UpdateCardNameFormData = {
  name: string;
};

const CardSettings: React.FC = () => {
  return (
    <>
      <UpdateName />
      <UpdatePin />
    </>
  );
};

export default CardSettings;

const UpdatePin: React.FC = () => {
  const { updatePin } = useCardStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid, isSubmitting },
  } = useForm<UpdateCardPinFormData>({ mode: 'onChange' });

  return (
    <div className="flex flex-col justify-center mt-8 mx-auto w-full max-w-md bg-white py-4 shadow rounded-lg px-6">
      <form
        onSubmit={handleSubmit(async (data: UpdateCardPinFormData) => {
          await updatePin(data.pin);
          reset();
        })}
      >
        <label htmlFor="pin" className="block text-md font-medium">
          Card Pin
        </label>
        <div className="mt-4">
          <input
            placeholder="New pin"
            type="password"
            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
            {...register('pin', { required: true, maxLength: 6, minLength: 6 })}
          />
        </div>
        <ButtonGrey
          type="submit"
          disabled={!isValid}
          loading={isSubmitting}
          className="w-full mt-2"
        >
          Save
        </ButtonGrey>
      </form>
    </div>
  );
};

const UpdateName: React.FC = () => {
  const { updateName } = useCardStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid, isSubmitting },
  } = useForm<UpdateCardNameFormData>({ mode: 'onChange' });

  return (
    <div className="flex flex-col justify-center mt-8 mx-auto w-full max-w-md bg-white py-4 shadow rounded-lg px-6">
      <form
        onSubmit={handleSubmit(async (data: UpdateCardNameFormData) => {
          await updateName(data.name);
          reset();
        })}
      >
        <label htmlFor="name" className="block text-md font-medium">
          Card Name
        </label>
        <div className="mt-4">
          <input
            placeholder="New name"
            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
            {...register('name', {
              required: true,
              maxLength: 20,
              minLength: 1,
            })}
          />
        </div>
        <ButtonGrey
          type="submit"
          disabled={!isValid}
          loading={isSubmitting}
          className="w-full mt-2"
        >
          Save
        </ButtonGrey>
      </form>
    </div>
  );
};
