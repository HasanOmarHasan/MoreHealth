// features/profiles/Account.tsx
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/Auth';
import axiosClient from '../../services/axiosClient';
import { toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import InputItem from '../../ui/InputItem';
import Button from '../../ui/Button';



interface FormData {
  username: string;
  phone: string;
  city: string;
  region: string;
  age: number | undefined;
  medical_insurance: boolean;
}

const Account = () => {
  const { user , initializeAuth } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    username: '',
    phone: '',
    city: '',
    region: '',
    age: undefined,
    medical_insurance: false,
  });


 

  // Initialize form with user data
  useEffect(() => {
    if (user ) {
      setFormData({
        username: user.username || '',
        phone: user.phone || '',
        city: user.city || '',
        region: user.region || '',
        age: user.age || undefined,
        medical_insurance: user.medical_insurance || false,
      });
    }
  }, [user]);

  // Update user mutation
  const updateMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });
      return axiosClient.patch('/auth/update-user/', formData);
    },
    onSuccess: (response) => {
      const updatedUser = { ...user, ...response.data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      initializeAuth();
      toast.success('Profile updated successfully!');
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Update failed';
      toast.error(message);
    },
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      updateMutation.mutate(formData);
    },
    [formData, updateMutation]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' 
          ? (e.target as HTMLInputElement).checked
          : type === 'number'
          ? Number(value)
          : value
      }));
    },
    []
  );

  if (!user) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Account Settings</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputItem
            name="username"
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            column="sm:col-span-3"
            inputValue={formData.username}
          />

          <InputItem
            name="phone"
            type="text"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            inputValue={formData.phone}
            column="sm:col-span-3"
          />

          <InputItem
            name="city"
            type="text"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            inputValue={formData.city}
            column="sm:col-span-3"
          />

          <InputItem
            name="region"
            type="text"
            placeholder="Region"
            value={formData.region}
            onChange={handleChange}
            inputValue={formData.region}
            column="sm:col-span-3"
          />

          <InputItem
            name="age"
            type="text"
            placeholder="Age"
            value={formData.age?.toString() || ''}
            onChange={handleChange}
            inputValue={formData.age?.toString() || ''}
          />

          <div className="col-span-6 flex items-center gap-2">
            <input
              type="checkbox"
              name="medical_insurance"
              checked={formData.medical_insurance}
              onChange={handleChange}
              className="h-4 w-4"
            />
            <label className="text-sm font-medium text-gray-700">
              Medical Insurance
            </label>
          </div>
        </div>

        <Button
          btnType="submit"
          content="Save Changes"
          isLoading={updateMutation.isPending}
          disabled={updateMutation.isPending}
          width="w-full"
        />
      </form>
    </motion.div>
  );
};

export default Account;