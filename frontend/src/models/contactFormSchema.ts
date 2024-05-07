import { states } from 'src/settings/states';
import { z } from 'zod';

export const formSchema = z
  .object({
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
    state: z.string().optional(),
    // city: z.string().min(1, { message: 'City is required!' }),
    // address: z.string().min(1, { message: 'Address is required!' }),
    // postalCode: z.string().min(1, { message: 'Postal Code is required!' }),
  })
  .refine(
    (data) => {
      const countryIsUSAOrCanada = ['usa', 'canada'].includes(data.country.toLowerCase());
      const stateIsValid =
        data.state &&
        data.state.trim().length > 0 &&
        data.state.trim().toLowerCase() !== 'state/province';

      if (countryIsUSAOrCanada && !stateIsValid) {
        return false;
      }
      return true;
    },
    {
      message: 'State is required for USA and Canada and cannot be "State/Province"',
      path: ['state'],
    }
  );
