import type { FormData } from '../../../types/types';
const formSubmissionTemplate = `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Form Submission</title>
    <style type="text/css">
      body,
      table,
      td {
        font-family: Arial, sans-serif;
      }
    </style>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f4f4f4">
    <table role="presentation" style="width: 100%; border-collapse: collapse">
      <tr>
        <td align="center" style="padding: 40px 0">
          <table
            role="presentation"
            style="
              width: 600px;
              border-collapse: collapse;
              border: 0;
              border-spacing: 0;
              background-color: #ffffff;
            "
          >
            <!-- Header -->
            <tr>
              <td style="padding: 30px; background-color: #f0f0f0">
                <table
                  role="presentation"
                  style="width: 100%; border-collapse: collapse; border: 0; border-spacing: 0"
                >
                  <tr>
                    <td style="padding: 0; color: #666666; font-size: 14px; line-height: 20px">
                      <h1
                        style="
                          font-size: 24px;
                          line-height: 32px;
                          margin: 0 0 20px 0;
                          color: #333333;
                        "
                      >
                        New Form Submission from Smart Glass Country calculator
                      </h1>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <!-- Content -->
            <tr>
              <td style="padding: 30px 30px 40px 30px">
                <table
                  role="presentation"
                  style="width: 100%; border-collapse: collapse; border: 0; border-spacing: 0"
                >
                  <tr>
                    <td style="padding: 0 0 5px 0"><strong>Name:</strong></td>
                  </tr>
                  <tr>
                    <td style="padding: 0 0 15px 0">[name]</td>
                  </tr>
                  <tr>
                    <td style="padding: 0 0 5px 0"><strong>Email:</strong></td>
                  </tr>
                  <tr>
                    <td style="padding: 0 0 15px 0">[email]</td>
                  </tr>
                  <tr>
                    <td style="padding: 0 0 5px 0"><strong>Phone:</strong></td>
                  </tr>
                  <tr>
                    <td style="padding: 0 0 15px 0">[phone]</td>
                  </tr>
                  <tr>
                    <td style="padding: 0 0 5px 0"><strong>Project Type:</strong></td>
                  </tr>
                  <tr>
                    <td style="padding: 0 0 15px 0">[projectType]</td>
                  </tr>
                  <tr>
                    <td style="padding: 0 0 5px 0"><strong>Role in Project:</strong></td>
                  </tr>
                  <tr>
                    <td style="padding: 0 0 15px 0">[roleInProject]</td>
                  </tr>
                  <tr>
                    <td style="padding: 0 0 5px 0"><strong>Location:</strong></td>
                  </tr>
                  <tr>
                    <td style="padding: 0 0 15px 0">[location]</td>
                  </tr>
                  <tr>
                    <td style="padding: 0 0 5px 0"><strong>Country:</strong></td>
                  </tr>
                  <tr>
                    <td style="padding: 0 0 15px 0">[country]</td>
                  </tr>
                  <tr>
                    <td style="padding: 0 0 5px 0"><strong>State:</strong></td>
                  </tr>
                  <tr>
                    <td style="padding: 0 0 15px 0">[state]</td>
                  </tr>
                </table>
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td style="padding: 30px; background-color: #f0f0f0">
                <table
                  role="presentation"
                  style="width: 100%; border-collapse: collapse; border: 0; border-spacing: 0"
                >
                  <tr>
                    <td style="padding: 0; color: #666666; font-size: 14px; line-height: 20px">
                      <p style="margin: 0">This is an automated email. Please do not reply.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

function generateFormSubmissionEmail(formData: Omit<FormData, 'orderToken'>): string {
  const { name, email, phone, projectType, roleInProject, location, country, state } = formData;
  return formSubmissionTemplate
    .replace('[name]', name)
    .replace('[email]', email)
    .replace('[phone]', phone)
    .replace('[projectType]', projectType)
    .replace('[roleInProject]', roleInProject)
    .replace('[location]', location)
    .replace('[country]', country)
    .replace('[state]', state);
}

export { generateFormSubmissionEmail };
