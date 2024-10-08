import { z } from 'zod';

export const formSchema = z.object({
  name: z.string().min(1, { message: 'Name is required!' }),
  email: z.string().email({ message: 'Invalid email address!' }),
  phone: z.string(),
  projectType: z
    .string()
    .refine((val) => val !== 'projectType', { message: 'Please choose a project type!' }),
  roleInProject: z.string().refine((val) => val !== 'roleInTheProject', {
    message: 'Please choose a role in the project!',
  }),
  location: z
    .string()
    .refine((val) => val !== 'location', { message: 'Please choose a location!' }),
  country: z.string().refine((val) => val !== 'country', { message: 'Please choose a country!' }),
  orderToken: z.string().min(1, { message: 'Order Token is required!' }),
  state: z.string().min(1, { message: 'State is required!' }),
});
