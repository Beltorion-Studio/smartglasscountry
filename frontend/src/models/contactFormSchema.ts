import { z } from 'zod';
export const formSchema = z
  .object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string(),
    projectType: z.string().refine((val) => val !== 'projectType'),
    roleInProject: z.string().refine((val) => val !== 'roleInTheProject'),
    location: z.string().refine((val) => val !== 'location'),
    country: z.string().refine((val) => val !== 'country'),
    state: z.string().optional(),
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
      path: ['state'],
    }
  );
